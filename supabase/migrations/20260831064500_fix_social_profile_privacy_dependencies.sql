-- Fix runtime regressions introduced when community privacy settings were removed
-- from browser-readable user_profiles columns.
--
-- Keep private account state private. Browser roles must not regain SELECT on
-- is_deactivated or UPDATE on derived profile counters. Instead, RLS reads the
-- private state through a narrow internal authz helper, and the legacy post-count
-- trigger maintains its system counter with controlled SECURITY DEFINER rights.

BEGIN;

CREATE SCHEMA IF NOT EXISTS authz;
REVOKE ALL ON SCHEMA authz FROM PUBLIC;
GRANT USAGE ON SCHEMA authz TO anon, authenticated;

CREATE OR REPLACE FUNCTION authz.is_profile_active(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT COALESCE((
    SELECT NOT COALESCE(up.is_deactivated, false)
    FROM public.user_profiles up
    WHERE up.user_id = p_user_id
    LIMIT 1
  ), true);
$$;

REVOKE ALL ON FUNCTION authz.is_profile_active(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION authz.is_profile_active(UUID) TO anon, authenticated;

-- Preserve the public/follower/private visibility model without making the
-- private is_deactivated column readable to browser roles.
DROP POLICY IF EXISTS posts_anon_select ON public.posts;
CREATE POLICY posts_anon_select ON public.posts FOR SELECT TO anon
USING (
  visibility = 'public'
  AND authz.is_profile_active(user_id)
);

DROP POLICY IF EXISTS posts_authenticated_select ON public.posts;
CREATE POLICY posts_authenticated_select ON public.posts FOR SELECT TO authenticated
USING (
  (
    visibility = 'public'
    OR (SELECT auth.uid()) = user_id
    OR (
      visibility = 'followers'
      AND EXISTS (
        SELECT 1
        FROM public.follows f
        WHERE f.follower_id = (SELECT auth.uid())
          AND f.following_id = posts.user_id
      )
    )
  )
  AND authz.is_profile_active(user_id)
  AND NOT authz.is_user_blocked_with(user_id)
);

-- This legacy trigger is still attached to posts and maintains posts_created.
-- It previously ran as the browser role and therefore failed after counter
-- columns were correctly removed from the browser UPDATE grant. Keep the
-- counter server-derived instead of granting users direct counter mutation.
CREATE OR REPLACE FUNCTION public.update_user_post_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.user_profiles
    SET posts_created = COALESCE(posts_created, 0) + 1
    WHERE user_id = NEW.user_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.user_profiles
    SET posts_created = GREATEST(COALESCE(posts_created, 0) - 1, 0)
    WHERE user_id = OLD.user_id;
    RETURN OLD;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.update_user_post_count() FROM PUBLIC, anon, authenticated;

-- Reassert the privacy boundary explicitly so future privilege drift does not
-- turn this runtime fix into disclosure or counter-spoofing access.
REVOKE SELECT (message_permission, allow_mentions_from, is_deactivated, deactivated_at)
  ON public.user_profiles FROM anon, authenticated;
REVOKE UPDATE (posts_created, posts_count, threads_created, helpful_answers,
               followers_count, following_count, reputation_points, helper_score,
               messages_sent_count, violations_count)
  ON public.user_profiles FROM authenticated;

COMMENT ON FUNCTION authz.is_profile_active(UUID) IS
  'Internal RLS helper exposing only a boolean publication decision; private deactivation state remains unreadable to browser roles.';
COMMENT ON FUNCTION public.update_user_post_count() IS
  'System trigger for posts_created. Runs with controlled definer rights so browser roles cannot mutate derived profile counters directly.';

COMMIT;
