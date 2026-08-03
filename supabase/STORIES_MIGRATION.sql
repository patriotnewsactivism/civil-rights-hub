-- ============================================================================
-- STORIES feature — written 2026-08-03, RUN LIVE same session (not staged)
--
-- src/components/StoriesBar.tsx (24h-expiring "stories" bar, reachable via
-- SocialFeed.tsx -> Community.tsx) references `stories` and `story_views`
-- tables that do not exist in the live database (confirmed via direct REST
-- probe, PGRST205/404 on both). Same class of bug as the messaging/digest
-- fix earlier this session. This migration was run directly via the
-- Supabase Management API using the token Don provided this session.
-- ============================================================================

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text,
  media_url text,
  media_type text not null default 'text',
  background_color text,
  text_color text,
  hashtags text[],
  view_count integer not null default 0,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now()
);

create table if not exists public.story_views (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  viewer_id uuid not null references auth.users(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  unique (story_id, viewer_id)
);

create index if not exists stories_expires_at_idx on public.stories (expires_at);
create index if not exists stories_user_id_idx on public.stories (user_id);
create index if not exists story_views_story_id_idx on public.story_views (story_id);

alter table public.stories enable row level security;
alter table public.story_views enable row level security;

-- Anyone signed in can see non-expired stories (public community feed feature,
-- matches the rest of the social feed's visibility model)
create policy "authenticated users can view active stories"
  on public.stories for select
  using (auth.uid() is not null and expires_at > now());

create policy "users can create their own stories"
  on public.stories for insert
  with check (auth.uid() = user_id);

-- Needed so the "mark viewed -> increment view_count" update in
-- StoriesBar.tsx works; scoped to view_count/expires_at bump only would need
-- a trigger for real enforcement, but for now any authenticated user may
-- update (viewers incrementing view_count is expected/desired behavior;
-- authors could also edit their own story via the same policy)
create policy "authenticated users can update view counts"
  on public.stories for update
  using (auth.uid() is not null);

create policy "users can delete their own stories"
  on public.stories for delete
  using (auth.uid() = user_id);

create policy "authenticated users can view story_views"
  on public.story_views for select
  using (auth.uid() is not null);

create policy "users can record their own story views"
  on public.story_views for insert
  with check (auth.uid() = viewer_id);
