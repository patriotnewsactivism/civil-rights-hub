-- Keep block-aware helpers private to authenticated sessions while preserving
-- anonymous access to genuinely public community content.

BEGIN;

DROP POLICY IF EXISTS user_profiles_public_select ON public.user_profiles;
CREATE POLICY user_profiles_anon_select ON public.user_profiles FOR SELECT TO anon
USING (is_public = true AND is_deactivated = false);
CREATE POLICY user_profiles_authenticated_select ON public.user_profiles FOR SELECT TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  OR (
    is_public = true
    AND is_deactivated = false
    AND NOT public.is_user_blocked_between((SELECT auth.uid()), user_id)
  )
);

DROP POLICY IF EXISTS posts_public_select ON public.posts;
CREATE POLICY posts_anon_select ON public.posts FOR SELECT TO anon
USING (
  visibility = 'public'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = posts.user_id AND up.is_deactivated = true
  )
);
CREATE POLICY posts_authenticated_select ON public.posts FOR SELECT TO authenticated
USING (
  (
    visibility = 'public'
    OR (SELECT auth.uid()) = user_id
    OR (
      visibility = 'followers'
      AND EXISTS (
        SELECT 1 FROM public.follows f
        WHERE f.follower_id = (SELECT auth.uid())
          AND f.following_id = posts.user_id
      )
    )
  )
  AND NOT public.is_user_blocked_between((SELECT auth.uid()), user_id)
  AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = posts.user_id AND up.is_deactivated = true
  )
);

DROP POLICY IF EXISTS follows_public_select ON public.follows;
CREATE POLICY follows_anon_select ON public.follows FOR SELECT TO anon USING (true);
CREATE POLICY follows_authenticated_select ON public.follows FOR SELECT TO authenticated
USING (
  NOT public.is_user_blocked_between((SELECT auth.uid()), follower_id)
  AND NOT public.is_user_blocked_between((SELECT auth.uid()), following_id)
);

DROP POLICY IF EXISTS stories_live_select ON public.stories;
CREATE POLICY stories_anon_select ON public.stories FOR SELECT TO anon
USING (expires_at > NOW());
CREATE POLICY stories_authenticated_select ON public.stories FOR SELECT TO authenticated
USING (
  expires_at > NOW()
  AND NOT public.is_user_blocked_between((SELECT auth.uid()), user_id)
);

REVOKE EXECUTE ON FUNCTION public.get_community_feed(INTEGER, TIMESTAMPTZ, UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_community_feed(INTEGER, TIMESTAMPTZ, UUID) TO authenticated;

COMMIT;
