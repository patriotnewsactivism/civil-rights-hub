-- Fail close high-stakes state legal guidance that predates reviewed provenance.
--
-- state_law_conflicts contains legal-status/severity conclusions, challenge tips,
-- and embedded reporting contacts. reporting_contacts can present phone/email/web
-- records and availability claims such as 24/7. Neither table currently carries
-- field-level primary-source provenance, so browser roles must not read them.

DO $$
BEGIN
  IF to_regclass('public.state_law_conflicts') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.state_law_conflicts ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE SELECT ON TABLE public.state_law_conflicts FROM PUBLIC, anon, authenticated';
  END IF;

  IF to_regclass('public.reporting_contacts') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.reporting_contacts ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE SELECT ON TABLE public.reporting_contacts FROM PUBLIC, anon, authenticated';
  END IF;
END
$$;

COMMENT ON FUNCTION public.has_publishable_provenance(TEXT, UUID) IS
  'Reviewed-primary-source publication predicate. Legacy state conflict/contact datasets remain separately fail-closed until rebuilt with claim-level provenance.';
