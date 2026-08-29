-- Fail-close legacy FOIA/public-records reference datasets until they are rebuilt
-- from reviewed official sources with durable provenance.
--
-- User-owned public.foia_requests remains available under its existing owner RLS.
-- This migration only removes browser access to reference data that previously drove
-- agency contacts, templates, and automatic legal-deadline assumptions.

DO $$
BEGIN
  IF to_regclass('public.foia_agencies') IS NOT NULL THEN
    ALTER TABLE public.foia_agencies ENABLE ROW LEVEL SECURITY;
    REVOKE ALL ON public.foia_agencies FROM PUBLIC, anon, authenticated;
  END IF;

  IF to_regclass('public.foia_templates') IS NOT NULL THEN
    ALTER TABLE public.foia_templates ENABLE ROW LEVEL SECURITY;
    REVOKE ALL ON public.foia_templates FROM PUBLIC, anon, authenticated;
  END IF;
END $$;

COMMENT ON TABLE public.foia_agencies IS
  'Browser access withheld pending field-level verification from official agency sources.';
COMMENT ON TABLE public.foia_templates IS
  'Browser access withheld pending legal/template verification from primary sources.';
