-- Close the remaining claim-level gap for verified people and incidents.
--
-- The earlier field-level migration requires primary evidence for the minimum
-- identity/incident fields. This follow-up requires primary evidence for every
-- populated public factual claim on attorney, activist, and verified incident
-- rows. System/publication metadata (ids, timestamps, verification flags, user
-- ownership) is intentionally excluded.

CREATE OR REPLACE FUNCTION public.provenance_supports_populated_claims(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_row JSONB
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  WITH claim_fields(field_name) AS (
    SELECT unnest(
      CASE p_entity_type
        WHEN 'attorney' THEN ARRAY[
          'name', 'state', 'firm', 'city', 'practice_areas', 'specialties',
          'phone', 'email', 'website', 'bio', 'bar_number', 'years_experience',
          'rating', 'review_count', 'accepts_pro_bono', 'languages',
          'bar_association_status', 'bar_status_date', 'case_success_rate',
          'total_cases_handled', 'client_reviews', 'average_rating',
          'total_reviews', 'years_with_organization', 'notable_cases',
          'professional_bio'
        ]::TEXT[]
        WHEN 'activist' THEN ARRAY[
          'name', 'alias', 'primary_platform', 'channel_url', 'focus_areas',
          'home_state', 'profile_image_url', 'bio'
        ]::TEXT[]
        WHEN 'violation' THEN ARRAY[
          'title', 'description', 'location_state', 'incident_date',
          'location_city', 'latitude', 'longitude', 'media_urls',
          'officer_name', 'officer_badge', 'officer_rank', 'agency_name'
        ]::TEXT[]
        ELSE ARRAY[]::TEXT[]
      END
    )
  ), populated_claims AS (
    SELECT field_name
    FROM claim_fields
    WHERE p_row ? field_name
      AND (p_row -> field_name) IS NOT NULL
      AND (p_row -> field_name) <> 'null'::JSONB
      AND (p_row -> field_name) <> '""'::JSONB
      AND (p_row -> field_name) <> '[]'::JSONB
      AND (p_row -> field_name) <> '{}'::JSONB
  )
  SELECT public.provenance_supports_fields(
    p_entity_type,
    p_entity_id,
    COALESCE((SELECT array_agg(field_name) FROM populated_claims), ARRAY[]::TEXT[])
  );
$$;

REVOKE ALL ON FUNCTION public.provenance_supports_populated_claims(TEXT, UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.provenance_supports_populated_claims(TEXT, UUID, JSONB)
  TO anon, authenticated, service_role;

-- Replace the verification trigger so a trusted write cannot promote a record
-- whose optional public claims outrun its reviewed primary evidence.
CREATE OR REPLACE FUNCTION public.enforce_source_provenance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  required_entity_type TEXT;
  requires_source BOOLEAN := false;
BEGIN
  IF TG_TABLE_NAME = 'attorneys' THEN
    required_entity_type := 'attorney';
    requires_source := COALESCE(NEW.is_verified, false);
  ELSIF TG_TABLE_NAME = 'activists' THEN
    required_entity_type := 'activist';
    requires_source := COALESCE(NEW.verified, false);
  ELSIF TG_TABLE_NAME = 'violations' THEN
    required_entity_type := 'violation';
    requires_source := NEW.status = 'verified';
  ELSE
    RETURN NEW;
  END IF;

  IF requires_source AND (
    NOT public.has_publishable_provenance(required_entity_type, NEW.id)
    OR NOT public.provenance_supports_populated_claims(
      required_entity_type,
      NEW.id,
      to_jsonb(NEW)
    )
  ) THEN
    RAISE EXCEPTION
      'Cannot publish % % without reviewed primary-source support for every populated public claim',
      required_entity_type,
      NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_source_provenance() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Public can view verified attorneys" ON public.attorneys;
CREATE POLICY "Public can view verified attorneys"
  ON public.attorneys
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(is_verified, false) = true
    AND (SELECT public.has_publishable_provenance('attorney', id))
    AND (
      SELECT public.provenance_supports_populated_claims(
        'attorney', id, to_jsonb(attorneys)
      )
    )
  );

DROP POLICY IF EXISTS "Public can view verified activists" ON public.activists;
CREATE POLICY "Public can view verified activists"
  ON public.activists
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(verified, false) = true
    AND (SELECT public.has_publishable_provenance('activist', id))
    AND (
      SELECT public.provenance_supports_populated_claims(
        'activist', id, to_jsonb(activists)
      )
    )
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
      SELECT public.provenance_supports_populated_claims(
        'violation', id, to_jsonb(violations)
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
        SELECT public.provenance_supports_populated_claims(
          'violation', id, to_jsonb(violations)
        )
      )
    )
    OR user_id = (SELECT auth.uid())
  );

COMMENT ON FUNCTION public.provenance_supports_populated_claims(TEXT, UUID, JSONB) IS
  'Requires reviewed primary-source field support for every populated public factual claim on attorney, activist, and verified incident rows.';
