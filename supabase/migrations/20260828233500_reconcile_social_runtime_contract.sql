-- Reconcile the cleaned community schema with the production React client.
-- The 2026-08-28 recovery migration removed synthetic social content and restored
-- restrictive RLS. This follow-up fixes runtime-contract drifts discovered by
-- the live production audit before the community UI is reopened.

ALTER TABLE public.poll_votes DROP CONSTRAINT IF EXISTS poll_votes_poll_id_fkey;
ALTER TABLE public.poll_votes ADD CONSTRAINT poll_votes_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.posts(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS poll_votes_owner_insert ON public.poll_votes;
CREATE POLICY poll_votes_owner_insert ON public.poll_votes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.posts p WHERE p.id = poll_votes.poll_id AND p.poll_data IS NOT NULL));

DROP POLICY IF EXISTS poll_votes_visible_select ON public.poll_votes;
DROP POLICY IF EXISTS poll_votes_owner_select ON public.poll_votes;
CREATE POLICY poll_votes_owner_select ON public.poll_votes FOR SELECT TO authenticated
USING (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.posts p WHERE p.id = poll_votes.poll_id AND p.poll_data IS NOT NULL));
REVOKE SELECT ON public.poll_votes FROM anon;
GRANT SELECT ON public.poll_votes TO authenticated;

CREATE OR REPLACE FUNCTION public.enforce_post_poll_vote()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  poll JSONB;
  ends_at_text TEXT;
  allow_multiple BOOLEAN;
BEGIN
  SELECT p.poll_data INTO poll FROM public.posts p WHERE p.id = NEW.poll_id;
  IF poll IS NULL THEN RAISE EXCEPTION 'Poll does not exist'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(COALESCE(poll->'options', '[]'::jsonb)) AS option_value
    WHERE option_value->>'id' = NEW.option_id::text
  ) THEN RAISE EXCEPTION 'Poll option does not exist'; END IF;
  ends_at_text := NULLIF(poll->>'endsAt', '');
  IF ends_at_text IS NOT NULL AND ends_at_text::timestamptz <= NOW() THEN RAISE EXCEPTION 'Poll has expired'; END IF;
  allow_multiple := COALESCE((poll->>'allowMultiple')::boolean, false);
  IF NOT allow_multiple AND EXISTS (
    SELECT 1 FROM public.poll_votes v
    WHERE v.poll_id = NEW.poll_id AND v.user_id = NEW.user_id AND v.option_id <> NEW.option_id
  ) THEN RAISE EXCEPTION 'Poll allows only one choice'; END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.enforce_post_poll_vote() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS enforce_post_poll_vote_trigger ON public.poll_votes;
CREATE TRIGGER enforce_post_poll_vote_trigger BEFORE INSERT OR UPDATE ON public.poll_votes FOR EACH ROW EXECUTE FUNCTION public.enforce_post_poll_vote();

CREATE OR REPLACE FUNCTION public.refresh_post_poll_counts()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
DECLARE
  target_poll UUID;
  rebuilt_options JSONB;
  voter_count INTEGER;
BEGIN
  target_poll := COALESCE(NEW.poll_id, OLD.poll_id);
  SELECT COALESCE(COUNT(DISTINCT v.user_id), 0)::integer INTO voter_count FROM public.poll_votes v WHERE v.poll_id = target_poll;
  SELECT COALESCE(
    jsonb_agg(
      jsonb_set(option_value, '{voteCount}', to_jsonb((
        SELECT COUNT(*)::integer FROM public.poll_votes v
        WHERE v.poll_id = target_poll AND v.option_id::text = option_value->>'id'
      )), true)
      ORDER BY option_ordinality
    ), '[]'::jsonb
  ) INTO rebuilt_options
  FROM public.posts p,
       LATERAL jsonb_array_elements(COALESCE(p.poll_data->'options', '[]'::jsonb)) WITH ORDINALITY AS options(option_value, option_ordinality)
  WHERE p.id = target_poll;

  UPDATE public.posts p
  SET poll_data = jsonb_set(jsonb_set(p.poll_data, '{options}', rebuilt_options, true), '{totalVotes}', to_jsonb(voter_count), true)
  WHERE p.id = target_poll AND p.poll_data IS NOT NULL;
  RETURN COALESCE(NEW, OLD);
END;
$$;
REVOKE ALL ON FUNCTION public.refresh_post_poll_counts() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS refresh_post_poll_counts_trigger ON public.poll_votes;
CREATE TRIGGER refresh_post_poll_counts_trigger AFTER INSERT OR DELETE ON public.poll_votes FOR EACH ROW EXECUTE FUNCTION public.refresh_post_poll_counts();

CREATE OR REPLACE FUNCTION public.refresh_story_view_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  UPDATE public.stories s SET view_count = (SELECT COUNT(*)::integer FROM public.story_views v WHERE v.story_id = NEW.story_id)
  WHERE s.id = NEW.story_id;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.refresh_story_view_count() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS refresh_story_view_count_trigger ON public.story_views;
CREATE TRIGGER refresh_story_view_count_trigger AFTER INSERT ON public.story_views FOR EACH ROW EXECUTE FUNCTION public.refresh_story_view_count();

DROP POLICY IF EXISTS avatars_auth_update ON storage.objects;
