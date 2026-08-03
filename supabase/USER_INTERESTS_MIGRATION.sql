-- ============================================================================
-- USER INTERESTS / hashtag-affinity feature — written + run live 2026-08-03
--
-- SocialFeed.tsx's personalized ranking (scorePost) and hashtag-click
-- tracking reference a `user_interests` table and a `track_hashtag_interest`
-- RPC function, neither of which exist in the live database. Both calls were
-- wrapped in try/catch so this failed silently (no crash, but personalization
-- never actually worked) — same missing-backend pattern as stories/messaging.
-- ============================================================================

create table if not exists public.user_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hashtag text not null,
  weight integer not null default 1,
  updated_at timestamptz not null default now(),
  unique (user_id, hashtag)
);

alter table public.user_interests enable row level security;

create policy "users can view their own interests"
  on public.user_interests for select
  using (auth.uid() = user_id);

create policy "users can manage their own interests"
  on public.user_interests for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Upserts (user_id, hashtag) rows, incrementing weight by 1 each time a user
-- interacts with that hashtag (matches SocialFeed.tsx's client-side
-- optimistic update: next.set(t, (next.get(t) ?? 0) + 1)).
create or replace function public.track_hashtag_interest(p_user_id uuid, p_hashtags text[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  tag text;
begin
  if p_user_id is null or p_hashtags is null then
    return;
  end if;

  -- security definer bypasses RLS, so enforce ownership explicitly here
  if p_user_id is distinct from auth.uid() then
    return;
  end if;

  foreach tag in array p_hashtags loop
    insert into public.user_interests (user_id, hashtag, weight, updated_at)
    values (p_user_id, tag, 1, now())
    on conflict (user_id, hashtag)
    do update set weight = public.user_interests.weight + 1, updated_at = now();
  end loop;
end;
$$;

grant execute on function public.track_hashtag_interest(uuid, text[]) to authenticated;
