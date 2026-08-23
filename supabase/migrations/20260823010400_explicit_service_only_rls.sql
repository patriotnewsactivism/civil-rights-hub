-- Explicitly mark service-only monetization tables as browser fail-closed.
--
-- These tables were created with service_role-only policies. service_role bypasses
-- RLS, so the policy canonicalization correctly removed those redundant policies,
-- which left the tables with RLS enabled but no explicit browser policy. Keep the
-- intended service-only model while making the denial explicit for anon/authenticated.

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['api_access_keys', 'newsletter_sponsorships']
  LOOP
    IF to_regclass('public.' || tbl) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'fail_closed_web', tbl);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
        'fail_closed_web',
        tbl
      );
    END IF;
  END LOOP;
END
$$;

COMMENT ON TABLE public.api_access_keys IS
  'Service-only API credential metadata. Browser roles are explicitly denied by RLS.';
COMMENT ON TABLE public.newsletter_sponsorships IS
  'Service-only newsletter sponsorship administration. Browser roles are explicitly denied by RLS.';
