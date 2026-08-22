-- Extend the reviewed-primary-source publication gate beyond people/incidents.
-- Depends on:
--   20260822180500_source_provenance_gate.sql
--   20260822210500_harden_source_provenance.sql
--
-- High-stakes legal tables fail closed immediately. Scanner/resource records also
-- require reviewed provenance; the frontend is separately held until those rows
-- are actually re-verified.

-- Explicit trusted backend privileges. Browser roles remain SELECT-only under RLS.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_provenance TO service_role;

-- Expand provenance entity types without creating a second overlapping check.
ALTER TABLE public.data_provenance
  DROP CONSTRAINT IF EXISTS data_provenance_entity_type_check;
ALTER TABLE public.data_provenance
  ADD CONSTRAINT data_provenance_entity_type_check
  CHECK (
    entity_type IN (
      'attorney',
      'violation',
      'activist',
      'state_law',
      'federal_law',
      'scanner',
      'resource'
    )
  );

-- A source labeled verified_primary must actually be a source class capable of
-- being primary evidence. News coverage and generic/other links can be useful
-- context, but they can never carry the primary label.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'data_provenance_verified_primary_source_type_check'
      AND conrelid = 'public.data_provenance'::regclass
  ) THEN
    ALTER TABLE public.data_provenance
      ADD CONSTRAINT data_provenance_verified_primary_source_type_check
      CHECK (
        verification_status <> 'verified_primary'
        OR source_type IN (
          'official',
          'court_record',
          'government',
          'bar_directory',
          'organization'
        )
      );
  END IF;
END
$$;

-- Replace the publication predicate with coverage for legal references,
-- scanner-provider links, and approved resources.
CREATE OR REPLACE FUNCTION public.has_publishable_provenance(
  p_entity_type TEXT,
  p_entity_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.data_provenance p
    WHERE p.entity_type = p_entity_type
      AND p.entity_id = p_entity_id
      AND p.is_active = true
      AND p.is_primary_source = true
      AND p.verification_status = 'verified_primary'
      AND p.last_verified_at IS NOT NULL
      AND (
        (
          p_entity_type = 'attorney'
          AND p.source_type IN ('bar_directory', 'government', 'official')
          AND p.last_verified_at >= NOW() - INTERVAL '180 days'
        )
        OR
        (
          p_entity_type = 'activist'
          AND p.source_type IN ('organization', 'government', 'official')
          AND p.last_verified_at >= NOW() - INTERVAL '365 days'
        )
        OR
        (
          p_entity_type = 'violation'
          AND p.source_type IN ('court_record', 'government', 'official')
        )
        OR
        (
          p_entity_type = 'state_law'
          AND p.source_type IN ('government', 'official', 'court_record')
          AND p.last_verified_at >= NOW() - INTERVAL '180 days'
        )
        OR
        (
          p_entity_type = 'federal_law'
          AND p.source_type IN ('government', 'official', 'court_record')
          AND p.last_verified_at >= NOW() - INTERVAL '365 days'
        )
        OR
        (
          p_entity_type = 'scanner'
          AND p.source_type IN ('organization', 'official')
          AND p.last_verified_at >= NOW() - INTERVAL '30 days'
        )
        OR
        (
          p_entity_type = 'resource'
          AND p.source_type IN ('organization', 'government', 'official', 'court_record')
          AND p.last_verified_at >= NOW() - INTERVAL '365 days'
        )
      )
  );
$$;

REVOKE ALL ON FUNCTION public.has_publishable_provenance(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_publishable_provenance(TEXT, UUID)
  TO anon, authenticated, service_role;

-- State-law rows contain legal conclusions and previously had unconditional
-- public read access. They now require current reviewed primary authority.
ALTER TABLE public.state_laws ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view state laws" ON public.state_laws;
DROP POLICY IF EXISTS "Public can view source-verified state laws" ON public.state_laws;
CREATE POLICY "Public can view source-verified state laws"
  ON public.state_laws
  FOR SELECT
  TO anon, authenticated
  USING ((SELECT public.has_publishable_provenance('state_law', id)));

-- Same rule for federal-law summaries.
ALTER TABLE public.federal_laws ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view federal laws" ON public.federal_laws;
DROP POLICY IF EXISTS "Public can view source-verified federal laws" ON public.federal_laws;
CREATE POLICY "Public can view source-verified federal laws"
  ON public.federal_laws
  FOR SELECT
  TO anon, authenticated
  USING ((SELECT public.has_publishable_provenance('federal_law', id)));

-- Scanner verification means the provider page was checked recently. It does
-- not automatically verify legacy listener counts, frequencies, descriptions,
-- or agency-affiliation claims; verified seeding must scrub unsupported fields.
ALTER TABLE public.scanner_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view scanner links" ON public.scanner_links;
DROP POLICY IF EXISTS "Public can view source-verified scanner links" ON public.scanner_links;
CREATE POLICY "Public can view source-verified scanner links"
  ON public.scanner_links
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(is_active, false) = true
    AND (SELECT public.has_publishable_provenance('scanner', id))
  );

-- Moderator approval is not the same thing as factual provenance. Approved
-- resources become public only after the underlying resource/source is verified.
ALTER TABLE public.resource_library ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view approved resources" ON public.resource_library;
DROP POLICY IF EXISTS "Public can view source-verified resources" ON public.resource_library;
CREATE POLICY "Public can view source-verified resources"
  ON public.resource_library
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(is_approved, false) = true
    AND (SELECT public.has_publishable_provenance('resource', id))
  );

COMMENT ON CONSTRAINT data_provenance_verified_primary_source_type_check
  ON public.data_provenance IS
  'Prevents news and generic/other links from being mislabeled as primary evidence.';
