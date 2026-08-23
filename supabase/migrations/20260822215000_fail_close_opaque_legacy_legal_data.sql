-- Fail close legacy legal/matching surfaces whose deployed SQL is not auditable
-- from the repository.
--
-- 20260803174500_lead_routing_and_tools.sql is only a SELECT 1 placeholder and
-- states that the actual SQL was applied directly to the live database. Until
-- the production definitions are recovered and rebuilt with reviewed source
-- provenance, browser roles must not be able to query those tables or execute
-- the attorney-matching RPC.

DO $$
DECLARE
  fn RECORD;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure::TEXT AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'match_attorneys_for_lead'
  LOOP
    EXECUTE
      'REVOKE EXECUTE ON FUNCTION ' || fn.signature ||
      ' FROM PUBLIC, anon, authenticated, service_role';
  END LOOP;
END
$$;

DO $$
BEGIN
  IF to_regclass('public.statute_of_limitations') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.statute_of_limitations ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE SELECT ON TABLE public.statute_of_limitations FROM PUBLIC, anon, authenticated';
  END IF;

  IF to_regclass('public.state_rights_comparison') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.state_rights_comparison ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE SELECT ON TABLE public.state_rights_comparison FROM PUBLIC, anon, authenticated';
  END IF;
END
$$;

COMMENT ON FUNCTION public.has_publishable_provenance(TEXT, UUID) IS
  'Reviewed-primary-source publication predicate. Opaque legacy legal datasets remain separately fail-closed until their deployed definitions and sources are recovered.';
