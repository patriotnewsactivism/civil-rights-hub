-- ============================================================================
-- Officer/agency accountability fields on `violations` — written + run live
-- 2026-08-03.
--
-- Real, deeper gap found (not just a naming drift): ViolationReport.tsx's
-- submission form collects agency + officer name/badge/rank in an "Agency &
-- Officer Information" section, but a code comment admits this was never
-- wired up ("Agency and officer linking disabled until database tables
-- are created") — the data is silently discarded on submit. Meanwhile
-- OfficerAccountability.tsx (which groups violations by officer to surface
-- repeat-offender patterns — the actual point of that whole feature) and
-- CityPage.tsx both already read `officer_name`/`agency_name` off
-- `violations`, expecting flat text columns (same pattern as agency_name
-- everywhere else in this app, e.g. foia_requests) — not a normalized
-- agencies/officers relational schema. Adding the flat columns is the
-- correct minimal fix that matches how every other part of the app already
-- models "agency name" (free text, not FK'd).
-- ============================================================================

alter table public.violations
  add column if not exists officer_name text,
  add column if not exists officer_badge text,
  add column if not exists officer_rank text,
  add column if not exists agency_name text;

create index if not exists violations_officer_name_idx on public.violations (officer_name);
create index if not exists violations_agency_name_idx on public.violations (agency_name);
