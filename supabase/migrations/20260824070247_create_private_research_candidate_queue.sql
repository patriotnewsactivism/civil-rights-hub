create table if not exists private.research_candidates (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('tavily','courtlistener','openstates','congress','regulations')),
  query text not null,
  title text not null,
  source_url text not null check (source_url ~* '^https://'),
  payload jsonb not null default '{}'::jsonb,
  trust_status text not null default 'discovery_only' check (trust_status in ('discovery_only','official_candidate','needs_primary_verification','rejected','promoted')),
  processed boolean not null default false,
  discovered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(source, source_url)
);
alter table private.research_candidates enable row level security;
comment on table private.research_candidates is 'Service-only staging queue for research discoveries. No browser policies; candidates are never public merely by being discovered.';
