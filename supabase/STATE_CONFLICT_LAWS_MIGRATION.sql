-- ============================================================================
-- State Conflict Laws + Reporting Contacts — schema only, written + run live
-- 2026-08-03. Content NOT populated here — see note at bottom.
--
-- StateConflictLaws.tsx (reachable from Rights page) references
-- `state_law_conflicts` and `reporting_contacts` tables that don't exist
-- (confirmed 404/PGRST205 via direct REST probe). It's a purely read-only
-- display component — no insert/update UI anywhere in it — so this is
-- meant to be populated by an admin/CMS process, not end users.
--
-- IMPORTANT: this migration creates STRUCTURE ONLY. I am not fabricating
-- legal content (which state laws conflict with which federal civil rights
-- protections, specific statute citations, named advocacy orgs' current
-- phone/email). This is exactly the kind of content where a hallucinated
-- citation or wrong phone number for a crisis reporting contact could
-- genuinely mislead someone in a real legal situation. Real content here
-- needs either Don's own research/citations or a dedicated, source-checked
-- pass — not invented by me. Until populated, both tables exist and the
-- app queries them cleanly (empty result, no more 404 errors) — the UI
-- already handles an empty/loading state gracefully.
-- ============================================================================

create table if not exists public.state_law_conflicts (
  id uuid primary key default gen_random_uuid(),
  state text not null,
  conflict_title text not null,
  description text not null,
  affected_right text not null,
  federal_protection text not null,
  state_law_citation text not null,
  status text not null default 'active' check (status in ('active', 'challenged', 'struck_down', 'enjoined')),
  challenge_tips text[] not null default '{}',
  reporting_contacts jsonb not null default '[]', -- [{org, phone?, web?, email?}]
  severity text not null default 'medium' check (severity in ('critical', 'high', 'medium')),
  last_updated date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.reporting_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organization text not null,
  contact_type text not null,
  contact_value text not null,
  category text not null,
  scope text not null default 'national' check (scope in ('national', 'state')),
  state text,
  description text not null default '',
  is_emergency boolean not null default false,
  available_hours text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists state_law_conflicts_state_idx on public.state_law_conflicts (state);
create index if not exists state_law_conflicts_severity_idx on public.state_law_conflicts (severity);
create index if not exists reporting_contacts_scope_idx on public.reporting_contacts (scope);
create index if not exists reporting_contacts_state_idx on public.reporting_contacts (state);

alter table public.state_law_conflicts enable row level security;
alter table public.reporting_contacts enable row level security;

-- Public reference content — anyone (including anonymous visitors) can read.
-- No public insert/update/delete policy — writes are admin/service-role only
-- (via Supabase dashboard or a future admin tool), matching the "no insert UI
-- in the app" reality today.
create policy "anyone can view state law conflicts"
  on public.state_law_conflicts for select
  using (true);

create policy "anyone can view reporting contacts"
  on public.reporting_contacts for select
  using (true);
