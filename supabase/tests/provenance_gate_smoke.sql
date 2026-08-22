-- Rollback-only smoke tests for the reviewed provenance publication gate.
--
-- Run only after all 20260822 provenance migrations are applied to a disposable
-- branch/database or inside an explicit transaction on the intended project.
-- This script leaves no test records behind because it ends with ROLLBACK.

BEGIN;

CREATE TEMP TABLE provenance_test_ids (
  key TEXT PRIMARY KEY,
  id UUID NOT NULL
) ON COMMIT DROP;

INSERT INTO provenance_test_ids (key, id)
VALUES
  ('attorney', gen_random_uuid()),
  ('scanner', gen_random_uuid());

-- ---------------------------------------------------------------------------
-- Attorney: no provenance must never promote.
-- ---------------------------------------------------------------------------
INSERT INTO public.attorneys (
  id,
  name,
  state,
  practice_areas,
  is_verified
)
SELECT id, 'Provenance Test Attorney', 'Texas', ARRAY[]::TEXT[], false
FROM provenance_test_ids
WHERE key = 'attorney';

DO $$
DECLARE
  rejected BOOLEAN := false;
BEGIN
  BEGIN
    UPDATE public.attorneys
    SET is_verified = true
    WHERE id = (SELECT id FROM provenance_test_ids WHERE key = 'attorney');
  EXCEPTION WHEN OTHERS THEN
    rejected := true;
  END;

  IF NOT rejected THEN
    RAISE EXCEPTION 'FAIL: attorney promoted without provenance';
  END IF;
END
$$;

-- Secondary evidence is useful context but cannot publish the attorney.
INSERT INTO public.data_provenance (
  entity_type,
  entity_id,
  source_url,
  source_title,
  source_publisher,
  source_type,
  is_primary_source,
  verification_status,
  last_verified_at,
  supported_fields
)
SELECT
  'attorney',
  id,
  'https://example.org/test-secondary',
  'Secondary test source',
  'Example',
  'news',
  false,
  'verified_secondary',
  NOW(),
  ARRAY['name', 'state']::TEXT[]
FROM provenance_test_ids
WHERE key = 'attorney';

DO $$
DECLARE
  rejected BOOLEAN := false;
BEGIN
  BEGIN
    UPDATE public.attorneys
    SET is_verified = true
    WHERE id = (SELECT id FROM provenance_test_ids WHERE key = 'attorney');
  EXCEPTION WHEN OTHERS THEN
    rejected := true;
  END;

  IF NOT rejected THEN
    RAISE EXCEPTION 'FAIL: secondary-only attorney evidence permitted publication';
  END IF;
END
$$;

-- A current bar/official source can anchor identity publication.
INSERT INTO public.data_provenance (
  entity_type,
  entity_id,
  source_url,
  source_title,
  source_publisher,
  source_type,
  is_primary_source,
  verification_status,
  last_verified_at,
  supported_fields
)
SELECT
  'attorney',
  id,
  'https://example.gov/test-bar-record',
  'Official bar test record',
  'Example Bar Authority',
  'bar_directory',
  true,
  'verified_primary',
  NOW(),
  ARRAY['name', 'state']::TEXT[]
FROM provenance_test_ids
WHERE key = 'attorney';

UPDATE public.attorneys
SET is_verified = true,
    verified_date = CURRENT_DATE
WHERE id = (SELECT id FROM provenance_test_ids WHERE key = 'attorney');

DO $$
BEGIN
  IF NOT public.has_publishable_provenance(
    'attorney',
    (SELECT id FROM provenance_test_ids WHERE key = 'attorney')
  ) THEN
    RAISE EXCEPTION 'FAIL: current official attorney evidence was not publishable';
  END IF;
END
$$;

-- Identity evidence cannot silently prove an unrelated populated phone claim.
DO $$
DECLARE
  rejected BOOLEAN := false;
BEGIN
  BEGIN
    UPDATE public.attorneys
    SET phone = '555-0100'
    WHERE id = (SELECT id FROM provenance_test_ids WHERE key = 'attorney');
  EXCEPTION WHEN OTHERS THEN
    rejected := true;
  END;

  IF NOT rejected THEN
    RAISE EXCEPTION 'FAIL: unsupported attorney phone claim was accepted';
  END IF;
END
$$;

-- A first-party organization source may support contact details, but the bar
-- source remains the publication anchor for attorney identity/licensing.
INSERT INTO public.data_provenance (
  entity_type,
  entity_id,
  source_url,
  source_title,
  source_publisher,
  source_type,
  is_primary_source,
  verification_status,
  last_verified_at,
  supported_fields
)
SELECT
  'attorney',
  id,
  'https://example-law-firm.test/attorney',
  'Attorney profile',
  'Example Law Firm',
  'organization',
  true,
  'verified_primary',
  NOW(),
  ARRAY['phone']::TEXT[]
FROM provenance_test_ids
WHERE key = 'attorney';

UPDATE public.attorneys
SET phone = '555-0100'
WHERE id = (SELECT id FROM provenance_test_ids WHERE key = 'attorney');

-- A true pro-bono badge is a separate factual claim and must fail until a
-- reviewed primary source explicitly supports it. The default false value does
-- not itself require evidence because the UI does not display a negative claim.
DO $$
DECLARE
  rejected BOOLEAN := false;
BEGIN
  BEGIN
    UPDATE public.attorneys
    SET accepts_pro_bono = true
    WHERE id = (SELECT id FROM provenance_test_ids WHERE key = 'attorney');
  EXCEPTION WHEN OTHERS THEN
    rejected := true;
  END;

  IF NOT rejected THEN
    RAISE EXCEPTION 'FAIL: unsupported pro-bono claim was accepted';
  END IF;
END
$$;

-- Expire the qualifying bar anchor. The organization profile may remain current
-- for phone data, but it cannot independently publish attorney identity.
UPDATE public.data_provenance
SET last_verified_at = NOW() - INTERVAL '181 days'
WHERE entity_type = 'attorney'
  AND entity_id = (SELECT id FROM provenance_test_ids WHERE key = 'attorney')
  AND source_type = 'bar_directory';

DO $$
BEGIN
  IF public.has_publishable_provenance(
    'attorney',
    (SELECT id FROM provenance_test_ids WHERE key = 'attorney')
  ) THEN
    RAISE EXCEPTION 'FAIL: stale attorney publication anchor remained publishable';
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Scanner: exact provider URL + recent primary provider evidence required.
-- ---------------------------------------------------------------------------
INSERT INTO public.scanner_links (
  id,
  state,
  state_code,
  scanner_name,
  broadcastify_url,
  listener_count,
  is_active
)
SELECT
  id,
  'Texas',
  'TX',
  'Provider Verification Test Feed',
  'https://www.broadcastify.com/listen/feed/00000',
  0,
  false
FROM provenance_test_ids
WHERE key = 'scanner';

INSERT INTO public.data_provenance (
  entity_type,
  entity_id,
  source_url,
  source_title,
  source_publisher,
  source_type,
  is_primary_source,
  verification_status,
  last_verified_at,
  supported_fields
)
SELECT
  'scanner',
  id,
  'https://www.broadcastify.com/listen/feed/00000',
  'Provider test feed',
  'Broadcastify',
  'organization',
  true,
  'verified_primary',
  NOW(),
  ARRAY['state', 'state_code', 'scanner_name', 'broadcastify_url']::TEXT[]
FROM provenance_test_ids
WHERE key = 'scanner';

UPDATE public.scanner_links
SET is_active = true
WHERE id = (SELECT id FROM provenance_test_ids WHERE key = 'scanner');

DO $$
BEGIN
  IF NOT public.has_publishable_provenance(
    'scanner',
    (SELECT id FROM provenance_test_ids WHERE key = 'scanner')
  ) THEN
    RAISE EXCEPTION 'FAIL: current provider-backed scanner was not publishable';
  END IF;
END
$$;

-- Listener counts are not inferred from the existence of the feed URL.
DO $$
BEGIN
  IF public.provenance_supports_fields(
    'scanner',
    (SELECT id FROM provenance_test_ids WHERE key = 'scanner'),
    ARRAY['listener_count']::TEXT[]
  ) THEN
    RAISE EXCEPTION 'FAIL: scanner provider record silently supported listener_count';
  END IF;
END
$$;

ROLLBACK;
