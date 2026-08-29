-- Reconcile the cleaned community schema with the production React client.
-- The 2026-08-28 recovery migration removed synthetic social content and restored
-- restrictive RLS. This follow-up fixes runtime-contract drifts discovered by
-- the live production audit before the community UI is reopened.

-- Polls are stored by the current client in posts.poll_data and identify a poll by
-- the owning posts.id. Legacy poll_votes still referenced the unused post_polls table,
-- which made legitimate votes fail FK validation.
ALTER TABLE public.poll_votes
  DROP CONSTRAINT IF EXISTS poll_votes_poll_id_fkey;

ALTER TABLE public.poll_votes
  ADD CONSTRAINT poll_votes_poll_id_fkey
  FOREIGN KEY (poll_id) REFERENCES public.posts(id) ON DELETE CASCADE;

-- Votes may only target an existing poll post. The individual vote ledger is private
-- to the voter; aggregate results are maintained in posts.poll_data by a trigger below.
DROP POLICY IF EXISTS poll_votes_owner_insert ON public.poll_votes;
CREATE POLICY poll_votes_owner_insert
  ON public.poll_votes FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = poll_votes.poll_id
        AND p.poll_data IS NOT NULL
    )
  );

DROP POLICY IF EXISTS poll_votes_visible_select ON public.poll_votes;
DROP POLICY IF EXISTS poll_votes_owner_select ON public.poll_votes;
CREATE POLICY poll_votes_owner_select
  ON public.poll_votes FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = poll_votes.poll_id
        AND p.poll_data IS NOT NULL
    )
  );

REVOKE SELECT ON public.poll_votes FROM anon;
GRANT SELECT ON public.poll_votes TO authenticated;

-- Validate the embedded option list and poll rules before a row can enter the vote ledger.
-- Locking the owning post serializes votes for a poll, closing the race where two concurrent
-- inserts from the same voter could otherwise choose two different options on a single-choice poll.
CREATE OR REPLACE FUNCTION public.enforce_post_poll_vote()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  poll JSONB;
  ends_at_text TEXT;
  allow_multiple BOOLEAN;
BEGIN
  SELECT p.poll_data
    INTO poll
  FROM public.posts p
  WHERE p.id = NEW.poll_id
  FOR UPDATE;

  IF poll IS NULL THEN
    RAISE EXCEPTION 'Poll does not exist';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(COALESCE(poll->'options', '[]'::jsonb)) AS option_value
    WHERE option_value->>'id' = NEW.option_id::text
  ) THEN
    RAISE EXCEPTION 'Poll option does not exist';
  END IF;

  ends_at_text := NULLIF(poll->>'endsAt', '');
  IF ends_at_text IS NOT NULL AND ends_at_text::timestamptz <= NOW() THEN
    RAISE EXCEPTION 'Poll has expired';
  END IF;

  allow_multiple := COALESCE((poll->>'allowMultiple')::boolean, false);
  IF NOT allow_multiple AND EXISTS (
    SELECT 1
    FROM public.poll_votes v
    WHERE v.poll_id = NEW.poll_id
      AND v.user_id = NEW.user_id
      AND v.option_id <> NEW.option_id
  ) THEN
    RAISE EXCEPTION 'Poll allows only one choice';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_post_poll_vote() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS enforce_post_poll_vote_trigger ON public.poll_votes;
CREATE TRIGGER enforce_post_poll_vote_trigger
BEFORE INSERT ON public.poll_votes
FOR EACH ROW EXECUTE FUNCTION public.enforce_post_poll_vote();

-- The cleaned post policy correctly prevents a voter from updating somebody else's
-- post. Therefore poll totals cannot be browser-maintained. Rebuild aggregate totals
-- after vote-ledger changes under a narrowly scoped SECURITY DEFINER trigger.
CREATE OR REPLACE FUNCTION public.refresh_post_poll_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_poll UUID;
  rebuilt_options JSONB;
  voter_count INTEGER;
BEGIN
  target_poll := COALESCE(NEW.poll_id, OLD.poll_id);

  SELECT COALESCE(COUNT(DISTINCT v.user_id), 0)::integer
    INTO voter_count
  FROM public.poll_votes v
  WHERE v.poll_id = target_poll;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_set(
        option_value,
        '{voteCount}',
        to_jsonb((
          SELECT COUNT(*)::integer
          FROM public.poll_votes v
          WHERE v.poll_id = target_poll
            AND v.option_id::text = option_value->>'id'
        )),
        true
      )
      ORDER BY option_ordinality
    ),
    '[]'::jsonb
  )
  INTO rebuilt_options
  FROM public.posts p,
       LATERAL jsonb_array_elements(COALESCE(p.poll_data->'options', '[]'::jsonb))
         WITH ORDINALITY AS options(option_value, option_ordinality)
  WHERE p.id = target_poll;

  UPDATE public.posts p
  SET poll_data = jsonb_set(
      jsonb_set(p.poll_data, '{options}', rebuilt_options, true),
      '{totalVotes}', to_jsonb(voter_count), true
    )
  WHERE p.id = target_poll
    AND p.poll_data IS NOT NULL;

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_post_poll_counts() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS refresh_post_poll_counts_trigger ON public.poll_votes;
CREATE TRIGGER refresh_post_poll_counts_trigger
AFTER INSERT OR DELETE ON public.poll_votes
FOR EACH ROW EXECUTE FUNCTION public.refresh_post_poll_counts();

-- Poll result fields are server-derived once a post exists. A post owner may create a poll,
-- but cannot later rewrite poll_data directly to fabricate vote totals or options. Future poll
-- editing should go through a purpose-built, validated server operation instead of broad UPDATE.
CREATE OR REPLACE FUNCTION public.protect_post_poll_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated')
     AND NEW.poll_data IS DISTINCT FROM OLD.poll_data THEN
    RAISE EXCEPTION 'poll_data is server-managed after publication';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_post_poll_data() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS protect_post_poll_data_trigger ON public.posts;
CREATE TRIGGER protect_post_poll_data_trigger
BEFORE UPDATE OF poll_data ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.protect_post_poll_data();

-- Story view_count is system-derived. The browser may insert its own story_views row,
-- but must not need UPDATE permission on another user's story merely to increment it.
CREATE OR REPLACE FUNCTION public.refresh_story_view_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.stories s
  SET view_count = (
    SELECT COUNT(*)::integer
    FROM public.story_views v
    WHERE v.story_id = NEW.story_id
  )
  WHERE s.id = NEW.story_id;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_story_view_count() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS refresh_story_view_count_trigger ON public.story_views;
CREATE TRIGGER refresh_story_view_count_trigger
AFTER INSERT ON public.story_views
FOR EACH ROW EXECUTE FUNCTION public.refresh_story_view_count();

-- RSVP counts are maintained by refresh_community_event_rsvp_count() from the recovery
-- migration. Prevent organizers from spoofing those public totals with direct table writes.
CREATE OR REPLACE FUNCTION public.protect_community_event_system_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.rsvp_count := 0;
      NEW.attendee_count := 0;
    ELSIF NEW.rsvp_count IS DISTINCT FROM OLD.rsvp_count
       OR NEW.attendee_count IS DISTINCT FROM OLD.attendee_count THEN
      RAISE EXCEPTION 'event attendance counters are server-managed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_community_event_system_fields() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS protect_community_event_system_fields_trigger ON public.community_events;
CREATE TRIGGER protect_community_event_system_fields_trigger
BEFORE INSERT OR UPDATE OF rsvp_count, attendee_count ON public.community_events
FOR EACH ROW EXECUTE FUNCTION public.protect_community_event_system_fields();

-- Discussion upvote totals are derived exclusively from thread_upvotes.
CREATE OR REPLACE FUNCTION public.refresh_forum_thread_upvote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_thread UUID;
BEGIN
  target_thread := COALESCE(NEW.thread_id, OLD.thread_id);
  UPDATE public.forum_threads t
  SET like_count = (
    SELECT COUNT(*)::integer
    FROM public.thread_upvotes u
    WHERE u.thread_id = target_thread
  )
  WHERE t.id = target_thread;
  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_forum_thread_upvote_count() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS refresh_forum_thread_upvote_count_trigger ON public.thread_upvotes;
CREATE TRIGGER refresh_forum_thread_upvote_count_trigger
AFTER INSERT OR DELETE ON public.thread_upvotes
FOR EACH ROW EXECUTE FUNCTION public.refresh_forum_thread_upvote_count();

-- Reply totals and last activity are derived from non-deleted forum_posts. Handle UPDATE
-- as well so moderation/deletion state or a moved legacy row cannot leave stale counters.
CREATE OR REPLACE FUNCTION public.refresh_forum_thread_reply_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  old_thread UUID;
  new_thread UUID;
BEGIN
  old_thread := CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN OLD.thread_id ELSE NULL END;
  new_thread := CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN NEW.thread_id ELSE NULL END;

  IF old_thread IS NOT NULL THEN
    UPDATE public.forum_threads t
    SET post_count = (
          SELECT COUNT(*)::integer
          FROM public.forum_posts p
          WHERE p.thread_id = old_thread AND NOT COALESCE(p.is_deleted, false)
        ),
        last_post_at = COALESCE((
          SELECT MAX(p.created_at)
          FROM public.forum_posts p
          WHERE p.thread_id = old_thread AND NOT COALESCE(p.is_deleted, false)
        ), t.created_at)
    WHERE t.id = old_thread;
  END IF;

  IF new_thread IS NOT NULL AND new_thread IS DISTINCT FROM old_thread THEN
    UPDATE public.forum_threads t
    SET post_count = (
          SELECT COUNT(*)::integer
          FROM public.forum_posts p
          WHERE p.thread_id = new_thread AND NOT COALESCE(p.is_deleted, false)
        ),
        last_post_at = COALESCE((
          SELECT MAX(p.created_at)
          FROM public.forum_posts p
          WHERE p.thread_id = new_thread AND NOT COALESCE(p.is_deleted, false)
        ), t.created_at)
    WHERE t.id = new_thread;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_forum_thread_reply_stats() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS refresh_forum_thread_reply_stats_trigger ON public.forum_posts;
CREATE TRIGGER refresh_forum_thread_reply_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.forum_posts
FOR EACH ROW EXECUTE FUNCTION public.refresh_forum_thread_reply_stats();

-- like_count, post_count, last_post_at and moderator pin state are not author-controlled facts.
-- Normalize them on browser INSERT and reject browser UPDATE attempts. There is no durable
-- thread-view ledger yet, so view_count is NULL and the existing UI suppresses the view label.
CREATE OR REPLACE FUNCTION public.protect_forum_thread_system_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.like_count := 0;
      NEW.post_count := 0;
      NEW.view_count := NULL;
      NEW.is_pinned := false;
      NEW.last_post_at := COALESCE(NEW.created_at, NOW());
    ELSIF NEW.like_count IS DISTINCT FROM OLD.like_count
       OR NEW.post_count IS DISTINCT FROM OLD.post_count
       OR NEW.view_count IS DISTINCT FROM OLD.view_count
       OR NEW.last_post_at IS DISTINCT FROM OLD.last_post_at
       OR NEW.is_pinned IS DISTINCT FROM OLD.is_pinned THEN
      RAISE EXCEPTION 'discussion counters and moderator pin state are server-managed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_forum_thread_system_fields() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS protect_forum_thread_system_fields_trigger ON public.forum_threads;
CREATE TRIGGER protect_forum_thread_system_fields_trigger
BEFORE INSERT OR UPDATE OF like_count, post_count, view_count, last_post_at, is_pinned ON public.forum_threads
FOR EACH ROW EXECUTE FUNCTION public.protect_forum_thread_system_fields();

-- Remove a legacy avatar UPDATE policy that predates the explicit per-user folder
-- contract installed by the recovery migration.
DROP POLICY IF EXISTS avatars_auth_update ON storage.objects;
