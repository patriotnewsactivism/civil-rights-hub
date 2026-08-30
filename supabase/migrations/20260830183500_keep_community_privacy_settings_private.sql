-- Community privacy preferences are account settings, not public profile fields.
-- Keep them off the browser-readable profile surface and expose only the owner's
-- settings through a server-derived RPC.

BEGIN;

REVOKE SELECT (message_permission, allow_mentions_from, is_deactivated, deactivated_at)
  ON public.user_profiles FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_my_community_privacy_settings()
RETURNS TABLE (
  message_permission TEXT,
  allow_mentions_from TEXT,
  is_deactivated BOOLEAN,
  deactivated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    up.message_permission,
    up.allow_mentions_from,
    up.is_deactivated,
    up.deactivated_at
  FROM public.user_profiles up
  WHERE up.user_id = (SELECT auth.uid());
$$;

REVOKE ALL ON FUNCTION public.get_my_community_privacy_settings() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_community_privacy_settings() TO authenticated;

COMMIT;
