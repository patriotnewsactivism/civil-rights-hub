-- Source provenance gate for public-facing civil-rights data.
--
-- Existing verification flags were populated by several bulk seed migrations whose
-- provenance is not durable enough to support publication as established fact.
-- This migration preserves those legacy decisions in a private audit table,
-- demotes them, and requires an active source record before anything can be
-- promoted to verified again.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.verification_quarantine (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  legacy_status TEXT,
  snapshot JSONB NOT NULL,
  reason TEXT NOT NULL,
  quarantined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_quarantine_entity
  ON private.verification_quarantine (entity_type, entity_id);

-- Public evidence ledger. Only fields safe and useful for public auditability
-- live here; reviewer identity and internal notes are kept in private schema.
CREATE TABLE IF NOT EXISTS public.data_provenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('attorney', 'violation', 'activist')),
  entity_id UUID NOT NULL,
  source_url TEXT NOT NULL CHECK (source_url ~* '^https://'),
  source_title TEXT,
  source_publisher TEXT,
  source_type TEXT NOT NULL DEFAULT 'official'
    CHECK (source_type IN ('official', 'court_record', 'government', 'bar_directory', 'organization', 'news', 'other')),
  is_primary_source BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (entity_type, entity_id, source_url)
);

CREATE INDEX IF NOT EXISTS idx_data_provenance_entity
  ON public.data_provenance (entity_type, entity_id)
  WHERE is_active = true;

CREATE TABLE IF NOT EXISTS private.provenance_reviews (
  provenance_id UUID PRIMARY KEY REFERENCES public.data_provenance(id) ON DELETE CASCADE,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verification_notes TEXT,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.data_provenance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active provenance" ON public.data_provenance;
CREATE POLICY "Public can view active provenance"
  ON public.data_provenance
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- No INSERT/UPDATE/DELETE policy is intentionally created. Verification writes
-- must come from trusted server-side/service-role workflows or migrations.

-- Preserve every legacy publication decision before demoting it.
INSERT INTO private.verification_quarantine (entity_type, entity_id, legacy_status, snapshot, reason)
SELECT
  'attorney',
  id,
  'is_verified=true',
  to_jsonb(a),
  'Legacy verified flag lacks durable per-record source provenance.'
FROM public.attorneys a
WHERE COALESCE(is_verified, false) = true;

INSERT INTO private.verification_quarantine (entity_type, entity_id, legacy_status, snapshot, reason)
SELECT
  'activist',
  id,
  'verified=true',
  to_jsonb(a),
  'Legacy verified flag lacks durable per-record source provenance.'
FROM public.activists a
WHERE COALESCE(verified, false) = true;

INSERT INTO private.verification_quarantine (entity_type, entity_id, legacy_status, snapshot, reason)
SELECT
  'violation',
  id,
  status,
  to_jsonb(v),
  'Legacy verified status lacks durable per-record source provenance.'
FROM public.violations v
WHERE status = 'verified';

-- Fail closed: nothing remains verified merely because a bulk seed said so.
UPDATE public.attorneys
SET is_verified = false,
    verified_date = NULL
WHERE COALESCE(is_verified, false) = true;

UPDATE public.activists
SET verified = false
WHERE COALESCE(verified, false) = true;

UPDATE public.violations
SET status = 'pending'
WHERE status = 'verified';

-- Known malformed seed artifacts remain retained for audit but are explicitly
-- unpublishable. Clear bogus contact values so they cannot leak through an
-- administrative or accidental unfiltered surface.
UPDATE public.attorneys
SET phone = NULL
WHERE phone IS NOT NULL
  AND phone ~* '(prior|placeholder|example|fake|test)';

UPDATE public.attorneys
SET website = NULL
WHERE website IS NOT NULL
  AND website ~* '(prior2\.prior2\.com|placeholder|example\.|fake\.|test\.)';

-- ---------------------------------------------------------------------------
-- Fail-closed Data API policies.
-- ---------------------------------------------------------------------------
-- Attorneys are public only after source-backed verification.
ALTER TABLE public.attorneys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view attorneys" ON public.attorneys;
DROP POLICY IF EXISTS "Public can view verified attorneys" ON public.attorneys;
CREATE POLICY "Public can view verified attorneys"
  ON public.attorneys
  FOR SELECT
  TO anon, authenticated
  USING (COALESCE(is_verified, false) = true);

-- Anonymous visitors see only source-verified incidents. Signed-in users may
-- additionally see their own pending reports so they can manage submissions.
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view violations" ON public.violations;
DROP POLICY IF EXISTS "Public can view verified violations" ON public.violations;
DROP POLICY IF EXISTS "Users can view verified or own violations" ON public.violations;
CREATE POLICY "Public can view verified violations"
  ON public.violations
  FOR SELECT
  TO anon
  USING (status = 'verified');
CREATE POLICY "Users can view verified or own violations"
  ON public.violations
  FOR SELECT
  TO authenticated
  USING (status = 'verified' OR user_id = (SELECT auth.uid()));

-- Harden ownership updates. A user cannot turn a report into a verified record
-- because the provenance trigger below rejects that transition without a source.
DROP POLICY IF EXISTS "Users can update their own violations" ON public.violations;
CREATE POLICY "Users can update their own violations"
  ON public.violations
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Standalone agency/officer seed tables do not currently have per-row
-- provenance. Remove direct public reads; public accountability views can derive
-- names from source-verified violations until these entities get their own
-- verification workflow.
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view agencies" ON public.agencies;
DROP POLICY IF EXISTS "Anyone can view officers" ON public.officers;

-- Junction-table reads are limited to links belonging to verified violations.
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
    )
  );

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

  IF requires_source AND NOT EXISTS (
    SELECT 1
    FROM public.data_provenance p
    WHERE p.entity_type = required_entity_type
      AND p.entity_id = NEW.id
      AND p.is_active = true
  ) THEN
    RAISE EXCEPTION 'Cannot verify % % without active source provenance', required_entity_type, NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_attorneys_require_provenance ON public.attorneys;
CREATE TRIGGER trg_attorneys_require_provenance
  BEFORE INSERT OR UPDATE ON public.attorneys
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_source_provenance();

DROP TRIGGER IF EXISTS trg_activists_require_provenance ON public.activists;
CREATE TRIGGER trg_activists_require_provenance
  BEFORE INSERT OR UPDATE ON public.activists
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_source_provenance();

DROP TRIGGER IF EXISTS trg_violations_require_provenance ON public.violations;
CREATE TRIGGER trg_violations_require_provenance
  BEFORE INSERT OR UPDATE ON public.violations
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_source_provenance();

REVOKE EXECUTE ON FUNCTION public.enforce_source_provenance() FROM PUBLIC, anon, authenticated;

COMMENT ON TABLE public.data_provenance IS
  'Public source ledger for records that Civil Rights Hub publishes as verified.';
COMMENT ON TABLE private.verification_quarantine IS
  'Audit snapshot of legacy verification decisions demoted by the provenance gate.';
COMMENT ON TABLE private.provenance_reviews IS
  'Internal reviewer identity and notes for public provenance records.';
