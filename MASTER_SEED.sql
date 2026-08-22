-- RETIRED — DO NOT RUN
--
-- Historical versions of this file bulk-seeded real-world incidents, people,
-- attorneys, agencies, and community content without durable per-record source
-- provenance. Some rows were also marked verified by the seed itself. That does
-- not meet Civil Rights Hub's current publication standard.
--
-- The historical SQL remains available in Git history for audit/reconstruction,
-- but the working-tree entry point is intentionally non-executable.
--
-- Production data must now be introduced through reviewed migrations/workflows
-- that:
--   1. preserve the source URL/document and publisher;
--   2. classify whether the source is primary or secondary;
--   3. leave community/user reports pending by default;
--   4. never infer attorney licensure, practice status, or pro-bono availability;
--   5. never present a person, agency, incident, or legal claim as verified merely
--      because a bulk seed inserted it; and
--   6. satisfy the source-provenance publication gate before any verified flag is
--      set.
--
-- See:
--   supabase/migrations/20260822180500_source_provenance_gate.sql
--   supabase/migrations/20260822210500_harden_source_provenance.sql
--
-- Fail loudly if somebody still tries to execute this legacy entry point.
DO $$
BEGIN
  RAISE EXCEPTION USING
    MESSAGE = 'MASTER_SEED.sql is retired and must not be executed.',
    DETAIL = 'Historical bulk seed data lacked durable per-record provenance.',
    HINT = 'Use reviewed, source-backed migrations/workflows and the data_provenance gate.';
END
$$;
