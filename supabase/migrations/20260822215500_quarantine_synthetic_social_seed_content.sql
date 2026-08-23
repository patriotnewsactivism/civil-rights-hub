-- Quarantine and remove known synthetic community content inserted by:
--   20260315000002_seed_social_posts.sql
--   20260409000007_seed_more_demo_posts.sql
--
-- Those migrations attached invented posts/threads to the oldest real auth user,
-- creating false attribution and synthetic social proof. This cleanup snapshots
-- only records matching the distinctive seeded content before deleting them.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.synthetic_content_quarantine (
  id BIGSERIAL PRIMARY KEY,
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  snapshot JSONB NOT NULL,
  reason TEXT NOT NULL,
  quarantined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_table, source_id)
);

CREATE INDEX IF NOT EXISTS idx_synthetic_content_quarantine_source
  ON private.synthetic_content_quarantine (source_table, source_id);

-- Exact seeded post families. Prefixes are intentionally long and distinctive;
-- we snapshot first and delete only the snapshotted ids.
INSERT INTO private.synthetic_content_quarantine (
  source_table,
  source_id,
  snapshot,
  reason
)
SELECT
  'posts',
  p.id,
  to_jsonb(p),
  'Synthetic social-feed record inserted by a known demo seed migration under a real user id.'
FROM public.posts p
WHERE p.content LIKE ANY (ARRAY[
  '🚨 KNOW YOUR RIGHTS: You have the right to record police in public spaces in all 50 states.%',
  'FOIA WIN: After 6 months of requests and appeals, we finally received 847 pages%',
  'Fourth Amendment reminder: A traffic stop does NOT give police the right to search your vehicle%',
  'UPDATE on the Martinez v. City of Phoenix case:%',
  'RESOURCE: If you are detained or arrested, remember these 5 words:%',
  'ICE checkpoint alert for communities near I-10 in Texas.%',
  'Body camera footage analysis: New study from Yale Law shows%',
  'LEGAL UPDATE: The 9th Circuit just ruled that peaceful protesters%',
  'Shield law update for journalists: As of March 2026,%',
  'Community organizing tip: When documenting police encounters,%',
  'POLL: What is the most important civil rights issue you want this platform to focus on in 2026?%',
  'FALSE ARREST LEGAL GUIDE: If you were arrested without probable cause,%',
  'COURT UPDATE: The 9th Circuit ruled today in Porter v. Bowen%',
  'KNOW YOUR RIGHTS — Traffic Stop Edition (THREAD):%',
  'MAJOR FOIA WIN in Illinois: After 14 months of requests and one lawsuit,%',
  'LEGAL RESOURCE: If you''re arrested at a protest, here''s what happens next%',
  'Recording police? Know these facts:%',
  'ATTORNEY SPOTLIGHT: The National Lawyers Guild legal observer program%',
  'FOURTH AMENDMENT PRIMER — What "Reasonable Expectation of Privacy" Actually Means:%',
  'COMMUNITY WIN: After 18 months of organizing, Phoenix activists%',
  'IMMIGRATION RIGHTS REMINDER:%',
  'JUST PUBLISHED: Our full analysis of the new DOJ report on consent decrees%',
  'SURVEILLANCE THREAD: What is a Stingray (IMSI Catcher)?%',
  'SECTION 1983 EXPLAINED — The Most Important Civil Rights Law You''ve Never Heard Of:%',
  'RESOURCE ALERT: The Reporters Committee for Freedom of the Press has a free 24/7 legal defense hotline%',
  'KNOW YOUR RIGHTS — At a Checkpoint:%'
]::TEXT[])
ON CONFLICT (source_table, source_id) DO NOTHING;

-- Forum threads inserted by the March demo seed. These titles are exact and were
-- coupled with fabricated view counts and first-person experience claims.
INSERT INTO private.synthetic_content_quarantine (
  source_table,
  source_id,
  snapshot,
  reason
)
SELECT
  'forum_threads',
  f.id,
  to_jsonb(f),
  'Synthetic forum thread inserted by 20260315000002_seed_social_posts.sql under a real user id.'
FROM public.forum_threads f
WHERE f.title IN (
  'Guide: How to File a Compelling FOIA Request (With Templates)',
  'Know Your Rights: Recording Police in All 50 States (2026 Update)',
  'How to Find Pro Bono Civil Rights Attorneys in Your Area',
  'Community Watch: Share Your Local Police Accountability Stories',
  'Qualified Immunity Reform: Latest Legislative Updates 2026',
  'Tech Tools for Civil Rights Activists: Privacy, Security, Documentation',
  'Understanding Section 1983 Claims: When Can You Sue for Civil Rights Violations?'
)
ON CONFLICT (source_table, source_id) DO NOTHING;

DELETE FROM public.posts p
USING private.synthetic_content_quarantine q
WHERE q.source_table = 'posts'
  AND q.source_id = p.id
  AND q.reason LIKE 'Synthetic social-feed record inserted by a known demo seed migration%';

DELETE FROM public.forum_threads f
USING private.synthetic_content_quarantine q
WHERE q.source_table = 'forum_threads'
  AND q.source_id = f.id
  AND q.reason LIKE 'Synthetic forum thread inserted by 20260315000002_seed_social_posts.sql%';

COMMENT ON TABLE private.synthetic_content_quarantine IS
  'Audit snapshots of known synthetic/demo community records removed from public tables.';
