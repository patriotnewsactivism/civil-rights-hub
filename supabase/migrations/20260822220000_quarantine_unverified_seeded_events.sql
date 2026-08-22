-- Quarantine and remove the published event rows inserted by
-- 20260409000008_seed_community_events_2026.sql.
--
-- That migration published specific future dates, locations, organizer names,
-- contacts, and registration URLs without durable per-event provenance. Match on
-- BOTH exact title and exact scheduled start time so unrelated real submissions
-- with similar titles are not swept up.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.event_verification_quarantine (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL UNIQUE,
  snapshot JSONB NOT NULL,
  reason TEXT NOT NULL,
  quarantined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TEMP TABLE seeded_event_keys (
  title TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (title, start_date)
) ON COMMIT DROP;

INSERT INTO seeded_event_keys (title, start_date) VALUES
  ('National Day of Immigrant Rights — May Day 2026', '2026-05-01T10:00:00Z'),
  ('March Against Police Brutality — Houston', '2026-06-07T10:00:00Z'),
  ('Disability Rights Day of Action — Washington DC', '2026-07-26T09:00:00Z'),
  ('Environmental Justice March — East Side Detroit', '2026-04-25T11:00:00Z'),
  ('Stop AAPI Hate Community Rally — Atlanta', '2026-03-16T12:00:00Z'),
  ('Juneteenth Freedom March — Chicago', '2026-06-19T11:00:00Z'),
  ('Know Your Rights: Traffic Stops and Checkpoints — Phoenix', '2026-05-09T10:00:00Z'),
  ('Digital Security for Activists & Journalists — Online', '2026-05-14T18:00:00Z'),
  ('First Amendment Auditor Meetup — Dallas', '2026-05-16T13:00:00Z'),
  ('Community Copwatch Training — Oakland', '2026-06-13T09:00:00Z'),
  ('Section 1983 Civil Rights Litigation — CLE Webinar 2026', '2026-09-11T12:00:00Z'),
  ('Tenant Rights Workshop — Know Before You Get Evicted', '2026-05-28T18:30:00Z'),
  ('Immigration Know Your Rights: ICE Encounters — Los Angeles', '2026-05-30T10:00:00Z'),
  ('Legal Observer Training — NLG New York Chapter', '2026-07-11T10:00:00Z'),
  ('FOIA Boot Camp — How to Get the Records You Need', '2026-06-20T09:00:00Z'),
  ('Voting Rights Clinic — Register, Know, Protect', '2026-08-06T10:00:00Z'),
  ('Press Freedom Workshop for Student Journalists', '2026-09-19T09:00:00Z'),
  ('SCOTUS October Term 2026 — Civil Rights Cases Public Gallery', '2026-10-05T08:00:00Z'),
  ('Chicago Police Misconduct Hearing — COPA Watch', '2026-06-03T09:30:00Z'),
  ('National Police Accountability Conference 2026', '2026-07-17T08:00:00Z'),
  ('Housing Justice Summit — Los Angeles', '2026-08-15T08:30:00Z'),
  ('Bail Reform Town Hall — Philadelphia', '2026-06-25T18:00:00Z'),
  ('LGBTQ+ Legal Rights Clinic — Miami', '2026-06-06T10:00:00Z'),
  ('ACLU Supreme Court Decision Watch — Online', '2026-06-26T08:00:00Z'),
  ('Cop City Trial Watch Party — Atlanta', '2026-05-07T17:00:00Z');

INSERT INTO private.event_verification_quarantine (event_id, snapshot, reason)
SELECT
  e.id,
  to_jsonb(e),
  'Published by 20260409000008_seed_community_events_2026.sql without durable per-event source provenance.'
FROM public.community_events e
JOIN seeded_event_keys k
  ON k.title = e.title
 AND k.start_date = e.start_date
ON CONFLICT (event_id) DO NOTHING;

DELETE FROM public.community_events e
USING private.event_verification_quarantine q
WHERE q.event_id = e.id
  AND q.reason = 'Published by 20260409000008_seed_community_events_2026.sql without durable per-event source provenance.';

COMMENT ON TABLE private.event_verification_quarantine IS
  'Audit snapshots of legacy seeded event listings withheld until individually re-verified against authoritative organizer or venue sources.';
