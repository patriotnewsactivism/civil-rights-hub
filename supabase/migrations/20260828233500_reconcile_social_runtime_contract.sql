-- Reconcile the cleaned community schema with the production React client.
-- The 2026-08-28 recovery migration removed synthetic social content and restored
-- restrictive RLS. This follow-up fixes two runtime-contract drifts discovered by
-- the live production audit before the community UI is reopened.

-- Polls are stored by the current client in posts.poll_data and identify a poll by
-- the owning posts.id. Legacy poll_votes still referenced the unused post_polls table,
-- which made legitimate votes fail FK validation.
ALTER TABLE public.poll_votes
  DROP CONSTRAINT IF EXISTS poll_votes_poll_id_fkey;

ALTER TABLE public.poll_votes
  ADD CONSTRAINT poll_votes_poll_id_fkey
  FOREIGN KEY (poll_id) REFERENCES public.posts(id) ON DELETE CASCADE;

-- Ensure votes can only target posts that actually contain poll data.
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
CREATE POLICY poll_votes_visible_select
  ON public.poll_votes FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.posts p
      WHERE p.id = poll_votes.poll_id
        AND p.poll_data IS NOT NULL
    )
  );

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

-- Remove a legacy avatar UPDATE policy that predates the explicit per-user folder
-- contract installed by the recovery migration.
DROP POLICY IF EXISTS avatars_auth_update ON storage.objects;
