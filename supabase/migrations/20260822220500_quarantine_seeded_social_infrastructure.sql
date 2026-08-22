-- Remove synthetic public groups/events and contaminated popularity counters
-- introduced by 20260221000004_seed_social_infrastructure.sql.
--
-- Achievement/reputation definitions are product configuration and remain.
-- The public groups/events were fabricated under the first real auth user, and
-- popular_tags was assigned invented engagement counts. Snapshot public records
-- before deletion and reset popularity rather than presenting synthetic proof.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.social_infrastructure_quarantine (
  id BIGSERIAL PRIMARY KEY,
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  snapshot JSONB NOT NULL,
  reason TEXT NOT NULL,
  quarantined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_table, source_id)
);

INSERT INTO private.social_infrastructure_quarantine (
  source_table,
  source_id,
  snapshot,
  reason
)
SELECT
  'groups',
  g.id,
  to_jsonb(g),
  'Synthetic public group inserted by 20260221000004_seed_social_infrastructure.sql under the first real auth user.'
FROM public.groups g
WHERE g.slug IN (
  'civil-rights-discussion',
  'foia-tips-strategies',
  'know-your-rights',
  'cop-watch-organizers',
  'legal-observers'
)
ON CONFLICT (source_table, source_id) DO NOTHING;

INSERT INTO private.social_infrastructure_quarantine (
  source_table,
  source_id,
  snapshot,
  reason
)
SELECT
  'community_events',
  e.id,
  to_jsonb(e),
  'Synthetic event inserted by 20260221000004_seed_social_infrastructure.sql under the first real auth user.'
FROM public.community_events e
WHERE (e.title, e.start_date) IN (
  ('Virtual Know Your Rights Workshop', '2026-03-15 18:00:00+00'::TIMESTAMPTZ),
  ('FOIA Filing Webinar', '2026-03-08 14:00:00+00'::TIMESTAMPTZ),
  ('Community Meetup: Chicago', '2026-03-22 11:00:00+00'::TIMESTAMPTZ),
  ('Legal Observer Training', '2026-04-05 09:00:00+00'::TIMESTAMPTZ),
  ('Cop Watch Coordination Meeting', '2026-02-28 19:00:00+00'::TIMESTAMPTZ)
)
ON CONFLICT (source_table, source_id) DO NOTHING;

DELETE FROM public.groups g
USING private.social_infrastructure_quarantine q
WHERE q.source_table = 'groups'
  AND q.source_id = g.id;

DELETE FROM public.community_events e
USING private.social_infrastructure_quarantine q
WHERE q.source_table = 'community_events'
  AND q.source_id = e.id;

-- Legacy migrations set arbitrary floors (for example FOIA=200) and later demo
-- posts incremented those counters again. Zero is truthful; the application can
-- rebuild counts from genuine post activity after the cleanup is verified.
UPDATE public.popular_tags
SET use_count = 0;

COMMENT ON TABLE private.social_infrastructure_quarantine IS
  'Audit snapshots of synthetic public groups/events removed from the live community dataset.';
