-- Qualify outer scanner_links references inside the nested provenance EXISTS.
-- This avoids PostgreSQL resolving an unqualified `id` to data_provenance.id.

DROP POLICY IF EXISTS "Public can view source-verified scanner links" ON public.scanner_links;
CREATE POLICY "Public can view source-verified scanner links"
  ON public.scanner_links
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(scanner_links.is_active, false) = true
    AND (SELECT public.has_publishable_provenance('scanner', scanner_links.id))
    AND (
      SELECT public.provenance_supports_fields(
        'scanner',
        scanner_links.id,
        ARRAY['state', 'state_code', 'scanner_name']
        || CASE WHEN scanner_links.city IS NOT NULL THEN ARRAY['city'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN scanner_links.county IS NOT NULL THEN ARRAY['county'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN scanner_links.description IS NOT NULL THEN ARRAY['description'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN scanner_links.frequency IS NOT NULL THEN ARRAY['frequency'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN scanner_links.listener_count > 0 THEN ARRAY['listener_count'] ELSE ARRAY[]::TEXT[] END
        || CASE WHEN scanner_links.notes IS NOT NULL THEN ARRAY['notes'] ELSE ARRAY[]::TEXT[] END
      )
    )
    AND EXISTS (
      SELECT 1
      FROM public.data_provenance p
      WHERE p.entity_type = 'scanner'
        AND p.entity_id = scanner_links.id
        AND p.is_active = true
        AND p.is_primary_source = true
        AND p.verification_status = 'verified_primary'
        AND p.last_verified_at >= NOW() - INTERVAL '30 days'
        AND p.source_url = COALESCE(
          scanner_links.broadcastify_url,
          scanner_links.scanner_radio_url,
          scanner_links.other_url
        )
    )
  );
