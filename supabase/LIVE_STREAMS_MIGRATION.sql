-- ============================================================================
-- Live Streams (emergency police-encounter recording) — written + run live
-- 2026-08-03. GoLiveRecorder.tsx (the "GO LIVE — Record Police" emergency
-- button) inserts/updates a `live_streams` table that does not exist
-- (confirmed 404/PGRST205). This is a safety-critical feature — recording
-- police encounters — so getting the backend actually working matters.
-- ============================================================================

create table if not exists public.live_streams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  recording_url text,
  status text not null default 'ended' check (status in ('live', 'ended')),
  duration_seconds integer,
  location_lat double precision,
  location_lng double precision,
  location_state text,
  location_city text,
  post_id uuid references public.posts(id) on delete set null,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists live_streams_user_id_idx on public.live_streams (user_id);
create index if not exists live_streams_created_at_idx on public.live_streams (created_at desc);

alter table public.live_streams enable row level security;

-- Public/community visibility (these recordings get auto-posted to the
-- community feed as accountability evidence — same visibility model as
-- posts, not private data)
create policy "authenticated users can view live streams"
  on public.live_streams for select
  using (auth.uid() is not null);

create policy "users can create their own live streams"
  on public.live_streams for insert
  with check (auth.uid() = user_id);

create policy "users can update their own live streams"
  on public.live_streams for update
  using (auth.uid() = user_id);

create policy "users can delete their own live streams"
  on public.live_streams for delete
  using (auth.uid() = user_id);
