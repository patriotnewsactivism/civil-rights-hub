-- Harden the source-provenance gate introduced by 20260822180500.
--
-- Publication standard:
--   * "verified" means at least one ACTIVE, REVIEWED PRIMARY source exists.
--   * Attorney verification must be re-checked at least every 180 days.
--   * Activist/directory verification must be re-checked at least every 365 days.
--   * Incident verification requires primary official/court/government evidence.
--   * Secondary sources may be retained for context, but cannot by themselves
--     make a real-world record publishable as verified.
--
-- This migration intentionally does NOT promote any existing provenance row.
-- Existing rows start as needs_review and therefore remain fail-closed until a
-- trusted reviewer explicitly verifies the primary evidence.

ALTER TABLE public.data_provenance
  ADD COLUMN IF NOT EXISTS source_date DATE,
  ADD COLUMN IF NOT EXISTS retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS source_document_id TEXT,
  ADD COLUMN IF NOT EXISTS source_fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'needs_review';

-- Never infer review quality from legacy flags. The new status defaults to
-- needs_review for every pre-existing provenance record.
UPDATE public.data_provenance
SET verification_status = 'needs_review'
WHERE verification_status IS NULL
   OR verification_status NOT IN (
     'needs_review',
     'verified_primary',
     'verified_secondary',
     'stale',
     'rejected'
   );

UPDATE public.data_provenance
SET retrieved_at = COALESCE(retrieved_at, created_at, NOW());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'data_provenance_verification_status_check'
      AND conrelid = 'public.data_provenance'::regclass
  ) THEN
    ALTER TABLE public.data_provenance
      ADD CONSTRAINT data_provenance_verification_status_check
      CHECK (
        verification_status IN (
          'needs_review',
          'verified_primary',
          'verified_secondary',
          'stale',
          'rejected'
        )
      );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'data_provenance_primary_status_requires_primary_source'
      AND conrelid = 'public.data_provenance'::regclass
  ) THEN
    ALTER TABLE public.data_provenance
      ADD CONSTRAINT data_provenance_primary_status_requires_primary_source
      CHECK (
        verification_status <> 'verified_primary'
        OR (
          is_primary_source = true
          AND last_verified_at IS NOT NULL
        )
      );
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_data_provenance_publishable
  ON public.data_provenance (entity_type, entity_id, last_verified_at)
  WHERE is_active = true
    AND is_primary_source = true
    AND verification_status = 'verified_primary';

-- Central publication predicate. SECURITY DEFINER makes the check deterministic
-- inside RLS and trigger evaluation while execute permission is revoked below.
CREATE OR REPLACE FUNCTION public.has_publishable_provenance(
  p_entity_type TEXT,
  p_entity_id UUID
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
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
        -- Attorney identity/licensure/publication should be anchored to a bar,
        -- government, or other official source and refreshed frequently.
        (
          p_entity_type = 'attorney'
          AND p.source_type IN ('bar_directory', 'government', 'official')
          AND p.last_verified_at >= NOW() - INTERVAL '180 days'
        )
        OR
        -- Activist/directory identity can be established by the person's or
        -- organization's official source. Refresh at least annually.
        (
          p_entity_type = 'activist'
          AND p.source_type IN ('organization', 'government', 'official')
          AND p.last_verified_at >= NOW() - INTERVAL '365 days'
        )
        OR
        -- An incident cannot be promoted to verified based solely on a news
        -- article or community submission. Require primary official evidence.
        (
          p_entity_type = 'violation'
          AND p.source_type IN ('court_record', 'government', 'official')
        )
      )
  );
$$;

REVOKE ALL ON FUNCTION public.has_publishable_provenance(TEXT, UUID)
  FROM PUBLIC, anon, authenticated;

-- Promotion trigger: even trusted writes cannot set a publication flag unless
-- the reviewed primary-source predicate is already satisfied.
CREATE OR REPLACE FUNCTION public.enforce_source_provenance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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

  IF requires_source
     AND NOT public.has_publishable_provenance(required_entity_type, NEW.id)
  THEN
    RAISE EXCEPTION
      'Cannot publish % % as verified without reviewed primary-source provenance',
      required_entity_type,
      NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_source_provenance()
  FROM PUBLIC, anon, authenticated;

-- Public evidence ledger exposes only reviewed source records. Internal review
-- state remains private rather than leaking unfinished evidence collection.
DROP POLICY IF EXISTS "Public can view active provenance" ON public.data_provenance;
DROP POLICY IF EXISTS "Public can view reviewed provenance" ON public.data_provenance;
CREATE POLICY "Public can view reviewed provenance"
  ON public.data_provenance
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND verification_status IN ('verified_primary', 'verified_secondary')
  );

-- Attorneys: both the entity flag AND current primary-source review are needed.
ALTER TABLE public.attorneys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view attorneys" ON public.attorneys;
DROP POLICY IF EXISTS "Public can view verified attorneys" ON public.attorneys;
CREATE POLICY "Public can view verified attorneys"
  ON public.attorneys
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(is_verified, false) = true
    AND public.has_publishable_provenance('attorney', id)
  );

-- Activists/directories: same fail-closed rule, including annual freshness.
ALTER TABLE public.activists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view activists" ON public.activists;
DROP POLICY IF EXISTS "Anyone can view verified activists" ON public.activists;
DROP POLICY IF EXISTS "Public can view verified activists" ON public.activists;
CREATE POLICY "Public can view verified activists"
  ON public.activists
  FOR SELECT
  TO anon, authenticated
  USING (
    COALESCE(verified, false) = true
    AND public.has_publishable_provenance('activist', id)
  );

-- Incidents: anonymous users receive only primary-source-verified records.
-- Signed-in submitters can still see their own pending reports.
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view violations" ON public.violations;
DROP POLICY IF EXISTS "Public can view verified violations" ON public.violations;
DROP POLICY IF EXISTS "Users can view verified or own violations" ON public.violations;
CREATE POLICY "Public can view verified violations"
  ON public.violations
  FOR SELECT
  TO anon
  USING (
    status = 'verified'
    AND public.has_publishable_provenance('violation', id)
  );
CREATE POLICY "Users can view verified or own violations"
  ON public.violations
  FOR SELECT
  TO authenticated
  USING (
    (
      status = 'verified'
      AND public.has_publishable_provenance('violation', id)
    )
    OR user_id = (SELECT auth.uid())
  );

-- Links to officers/agencies inherit the verified-incident gate so a stale or
-- unsupported incident cannot expose linked accountability entities indirectly.
DROP POLICY IF EXISTS "Anyone can view violation_officers links" ON public.violation_officers;
DROP POLICY IF EXISTS "Public can view verified violation_officers links" ON public.violation_officers;
CREATE POLICY "Public can view verified violation_officers links"
  ON public.violation_officers
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.violations v
      WHERE v.id = violation_id
        AND v.status = 'verified'
        AND public.has_publishable_provenance('violation', v.id)
    )
  );

DROP POLICY IF EXISTS "Anyone can view violation_agencies links" ON public.violation_agencies;
DROP POLICY IF EXISTS "Public can view verified violation_agencies links" ON public.violation_agencies;
CREATE POLICY "Public can view verified violation_agencies links"
  ON public.violation_agencies
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.violations v
      WHERE v.id = violation_id
        AND v.status = 'verified'
        AND public.has_publishable_provenance('violation', v.id)
    )
  );

COMMENT ON FUNCTION public.has_publishable_provenance(TEXT, UUID) IS
  'Fail-closed publication predicate requiring reviewed primary-source provenance, including freshness for directory records.';

COMMENT ON COLUMN public.data_provenance.verification_status IS
  'Review state for one source. Only verified_primary can independently satisfy the public publication gate.';
COMMENT ON COLUMN public.data_provenance.last_verified_at IS
  'Time a trusted reviewer last confirmed this source still supports the entity claim.';
