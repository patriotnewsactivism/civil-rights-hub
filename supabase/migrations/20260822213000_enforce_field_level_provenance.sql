-- Add claim-level evidence scope to the provenance ledger.
-- A source can support some fields without proving every statement on a row.

ALTER TABLE public.data_provenance
  ADD COLUMN IF NOT EXISTS supported_fields TEXT[] NOT NULL DEFAULT '{}'::TEXT[];

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'data_provenance_supported_fields_no_blank_check'
      AND conrelid = 'public.data_provenance'::regclass
  ) THEN
    ALTER TABLE public.data_provenance
      ADD CONSTRAINT data_provenance_supported_fields_no_blank_check
      CHECK (array_position(supported_fields, '') IS NULL);
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.provenance_supports_fields(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_required_fields TEXT[]
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM unnest(COALESCE(p_required_fields, '{}'::TEXT[])) AS required_field
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.data_provenance p
      WHERE p.entity_type = p_entity_type
        AND p.entity_id = p_entity_id
        AND p.is_active = true
        AND p.is_primary_source = true
        AND p.verification_status = 'verified_primary'
        AND required_field = ANY(p.supported_fields)
    )
  );
$$;

REVOKE ALL ON FUNCTION public.provenance_supports_fields(TEXT, UUID, TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.provenance_supports_fields(TEXT, UUID, TEXT[])
  TO anon, authenticated, service_role;

-- Rebuild the verification trigger so a real-world entity cannot be promoted
-- unless primary evidence covers the minimum identity/incident claims as well
-- as satisfying the source-type/freshness gate.
CREATE OR REPLACE FUNCTION public.enforce_source_provenance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  required_entity_type TEXT;
  required_fields TEXT[];
  requires_source BOOLEAN := false;
BEGIN
  IF TG_TABLE_NAME = 'attorneys' THEN
    required_entity_type := 'attorney';
    required_fields := ARRAY['name', 'state'];
    requires_source := COALESCE(NEW.is_verified, false);
  ELSIF TG_TABLE_NAME = 'activists' THEN
    required_entity_type := 'activist';
    required_fields := ARRAY['name'];
    requires_source := COALESCE(NEW.verified, false);
  ELSIF TG_TABLE_NAME = 'violations' THEN
    required_entity_type := 'violation';
    required_fields := ARRAY['title', 'description', 'location_state', 'incident_date'];
    requires_source := NEW.status = 'verified';
  ELSE
    RETURN NEW;
  END IF;

  IF requires_source AND (
    NOT public.has_publishable_provenance(required_entity_type, NEW.id)
    OR NOT public.provenance_supports_fields(required_entity_type, NEW.id, required_fields)
  ) THEN
    RAISE EXCEPTION
      'Cannot publish % % without reviewed primary-source provenance for required claims',
      required_entity_type,
      NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_source_provenance() FROM PUBLIC, anon, authenticated;

-- Recreate entity policies with minimum claim coverage.
DROP POLICY IF EXISTS "Public can view verified attorneys" ON public.attorneys;
CREATE POLICY "Public can view verified attorneys"
  ON public.attorneys
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(is_verified, false) = true
    AND (SELECT public.has_publishable_provenance('attorney', id))
    AND (SELECT public.provenance_supports_fields('attorney', id, ARRAY['name', 'state']))
  );

DROP POLICY IF EXISTS "Public can view verified activists" ON public.activists;
CREATE POLICY "Public can view verified activists"
  ON public.activists
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(verified, false) = true
    AND (SELECT public.has_publishable_provenance('activist', id))
    AND (SELECT public.provenance_supports_fields('activist', id, ARRAY['name']))
  );

DROP POLICY IF EXISTS "Public can view verified violations" ON public.violations;
DROP POLICY IF EXISTS "Users can view verified or own violations" ON public.violations;
CREATE POLICY "Public can view verified violations"
  ON public.violations
  FOR SELECT
  TO anon
  USING (
    status = 'verified'
    AND (SELECT public.has_publishable_provenance('violation', id))
    AND (
      SELECT public.provenance_supports_fields(
        'violation', id, ARRAY['title', 'description', 'location_state', 'incident_date']
      )
    )
  );
CREATE POLICY "Users can view verified or own violations"
  ON public.violations
  FOR SELECT
  TO authenticated
  USING (
    (
      status = 'verified'
      AND (SELECT public.has_publishable_provenance('violation', id))
      AND (
        SELECT public.provenance_supports_fields(
          'violation', id, ARRAY['title', 'description', 'location_state', 'incident_date']
        )
      )
    )
    OR user_id = (SELECT auth.uid())
  );

-- State legal summaries are high stakes: require evidence for the core legal
-- conclusions plus every optional claim-bearing field that is populated.
DROP POLICY IF EXISTS "Public can view source-verified state laws" ON public.state_laws;
CREATE POLICY "Public can view source-verified state laws"
  ON public.state_laws
  FOR SELECT
  TO anon, authenticated
  USING (
    (SELECT public.has_publishable_provenance('state_law', id))
    AND (
      SELECT public.provenance_supports_fields(
        'state_law',
        id,
        ARRAY[
          'state',
          'state_code',
          'recording_consent_type',
          'recording_law_details',
          'can_record_police',
          'police_recording_details',
          'has_shield_law',
          'protest_permit_required'
        ]
        || CASE WHEN recording_law_citation IS NOT NULL THEN ARRAY['recording_law_citation'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN police_recording_restrictions IS NOT NULL THEN ARRAY['police_recording_restrictions'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN shield_law_details IS NOT NULL THEN ARRAY['shield_law_details'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN journalist_protections IS NOT NULL THEN ARRAY['journalist_protections'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN assembly_rights_details IS NOT NULL THEN ARRAY['assembly_rights_details'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN activist_protections IS NOT NULL THEN ARRAY['activist_protections'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN state_aclu_url IS NOT NULL THEN ARRAY['state_aclu_url'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN state_legal_aid_url IS NOT NULL THEN ARRAY['state_legal_aid_url'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN state_resources IS NOT NULL THEN ARRAY['state_resources'] ELSE ARRAY[]::TEXT[] END
      )
    )
  );

DROP POLICY IF EXISTS "Public can view source-verified federal laws" ON public.federal_laws;
CREATE POLICY "Public can view source-verified federal laws"
  ON public.federal_laws
  FOR SELECT
  TO anon, authenticated
  USING (
    (SELECT public.has_publishable_provenance('federal_law', id))
    AND (
      SELECT public.provenance_supports_fields(
        'federal_law',
        id,
        ARRAY['title', 'category', 'statute_citation', 'summary']
        || CASE WHEN short_name IS NOT NULL THEN ARRAY['short_name'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN year_enacted IS NOT NULL THEN ARRAY['year_enacted'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN full_text IS NOT NULL THEN ARRAY['full_text'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN key_provisions IS NOT NULL THEN ARRAY['key_provisions'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN protected_classes IS NOT NULL THEN ARRAY['protected_classes'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN enforcing_agency IS NOT NULL THEN ARRAY['enforcing_agency'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN enforcement_details IS NOT NULL THEN ARRAY['enforcement_details'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN amendments IS NOT NULL THEN ARRAY['amendments'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN related_laws IS NOT NULL THEN ARRAY['related_laws'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN external_links IS NOT NULL THEN ARRAY['external_links'] ELSE ARRAY[]::TEXT[] END
      )
    )
  );

-- Scanner provider verification is narrow: source evidence must support the
-- identity/location fields, and the reviewed primary source URL must be the
-- actual provider link exposed to the user.
DROP POLICY IF EXISTS "Public can view source-verified scanner links" ON public.scanner_links;
CREATE POLICY "Public can view source-verified scanner links"
  ON public.scanner_links
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(is_active, false) = true
    AND (SELECT public.has_publishable_provenance('scanner', id))
    AND (
      SELECT public.provenance_supports_fields(
        'scanner',
        id,
        ARRAY['state', 'state_code', 'scanner_name']
        || CASE WHEN city IS NOT NULL THEN ARRAY['city'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN county IS NOT NULL THEN ARRAY['county'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN description IS NOT NULL THEN ARRAY['description'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN frequency IS NOT NULL THEN ARRAY['frequency'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN listener_count > 0 THEN ARRAY['listener_count'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN notes IS NOT NULL THEN ARRAY['notes'] ELSE ARRAY[]::TEXT[] END
      )
    )
    AND EXISTS (
      SELECT 1
      FROM public.data_provenance p
      WHERE p.entity_type = 'scanner'
        AND p.entity_id = id
        AND p.is_active = true
        AND p.is_primary_source = true
        AND p.verification_status = 'verified_primary'
        AND p.last_verified_at >= NOW() - INTERVAL '30 days'
        AND p.source_url = COALESCE(broadcastify_url, scanner_radio_url, other_url)
    )
  );

DROP POLICY IF EXISTS "Public can view source-verified resources" ON public.resource_library;
CREATE POLICY "Public can view source-verified resources"
  ON public.resource_library
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(is_approved, false) = true
    AND (SELECT public.has_publishable_provenance('resource', id))
    AND (
      SELECT public.provenance_supports_fields(
        'resource',
        id,
        ARRAY['title', 'resource_type', 'category']
        || CASE WHEN description IS NOT NULL THEN ARRAY['description'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN author IS NOT NULL THEN ARRAY['author'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN source IS NOT NULL THEN ARRAY['source'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN external_url IS NOT NULL THEN ARRAY['external_url'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN file_url IS NOT NULL THEN ARRAY['file_url'] ELSE ARRAY[]::TEXT[] END
      )
    )
  );

COMMENT ON COLUMN public.data_provenance.supported_fields IS
  'Entity column names whose displayed factual claims are directly supported by this source.';
COMMENT ON FUNCTION public.provenance_supports_fields(TEXT, UUID, TEXT[]) IS
  'Returns true only when every requested field is covered by active reviewed primary-source provenance.';
