-- ============================================================================
-- MISSING TABLES for civil-rights-hub — written 2026-08-03
--
-- Two already-built frontend features reference these tables, and none of
-- them exist in the live database (confirmed via direct REST probes against
-- production, PGRST205 "Could not find the table" on every one of them).
-- Both features were disabled in the frontend (DigestSubscribeBanner.tsx
-- returns null; Community.tsx's Messages tab shows a "coming soon" notice)
-- rather than left silently broken. This file is the real schema to make
-- them work — run it in the Supabase SQL editor when ready, then re-enable
-- both components (see the NOTE comments in each file).
--
-- I do not have Management API / service-role access to this specific
-- Supabase project (vrdnrbjnitptxrexdlao) from my sandbox, so I could not
-- run this myself. Either run it yourself in the dashboard SQL editor, or
-- give me a service_role key / Supabase access token scoped to this project
-- and I'll run + verify it directly next session.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. digest_subscriptions — low risk, single-purpose (weekly email opt-in)
--    Used by: src/components/DigestSubscribeBanner.tsx
-- ----------------------------------------------------------------------------
create table if not exists public.digest_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  state text,
  frequency text not null default 'weekly',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.digest_subscriptions enable row level security;

create policy "users can view their own subscription"
  on public.digest_subscriptions for select
  using (auth.uid() = user_id);

create policy "users can upsert their own subscription"
  on public.digest_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "users can update their own subscription"
  on public.digest_subscriptions for update
  using (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- 2. Direct messaging — conversations / conversation_members /
--    conversation_messages / typing_indicators
--    Used by: src/components/MessagingPanel.tsx
--
--    HIGHER SENSITIVITY: this is private messaging between users on a
--    platform serving civil-rights complainants — message content must only
--    ever be readable by conversation members. Review the RLS policies below
--    carefully (or have someone review them) before going live; this is a
--    reasonable starting design, not a rubber-stamped guarantee.
-- ----------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  name text,
  is_group boolean not null default false,
  last_message_at timestamptz not null default now(),
  last_message_preview text,
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  last_read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (conversation_id, user_id)
);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text,
  media_url text,
  media_type text,
  is_deleted boolean not null default false,
  reply_to_id uuid references public.conversation_messages(id) on delete set null,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create table if not exists public.typing_indicators (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  updated_at timestamptz not null default now(),
  unique (conversation_id, user_id)
);

alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.typing_indicators enable row level security;

-- Helper: is the current user a member of a given conversation?
create or replace function public.is_conversation_member(_conversation_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.conversation_members
    where conversation_id = _conversation_id
      and user_id = auth.uid()
  );
$$;

create policy "members can view their conversations"
  on public.conversations for select
  using (public.is_conversation_member(id));

create policy "members can update conversation metadata"
  on public.conversations for update
  using (public.is_conversation_member(id));

create policy "authenticated users can start a conversation"
  on public.conversations for insert
  with check (auth.uid() is not null);

create policy "members can view membership rows for their conversations"
  on public.conversation_members for select
  using (public.is_conversation_member(conversation_id));

create policy "members can add members to their own conversations"
  on public.conversation_members for insert
  with check (public.is_conversation_member(conversation_id) or user_id = auth.uid());

create policy "members can update their own membership row"
  on public.conversation_members for update
  using (user_id = auth.uid());

create policy "members can view messages in their conversations"
  on public.conversation_messages for select
  using (public.is_conversation_member(conversation_id));

create policy "members can send messages in their conversations"
  on public.conversation_messages for insert
  with check (public.is_conversation_member(conversation_id) and sender_id = auth.uid());

create policy "senders can edit or soft-delete their own messages"
  on public.conversation_messages for update
  using (sender_id = auth.uid());

create policy "members can view typing indicators in their conversations"
  on public.typing_indicators for select
  using (public.is_conversation_member(conversation_id));

create policy "members can upsert their own typing indicator"
  on public.typing_indicators for insert
  with check (public.is_conversation_member(conversation_id) and user_id = auth.uid());

create policy "members can update their own typing indicator"
  on public.typing_indicators for update
  using (user_id = auth.uid());

-- Realtime: MessagingPanel.tsx uses supabase.channel(`conv:${id}`) for live
-- typing/broadcast events, which works without extra config. If you also
-- want live Postgres-Changes updates (new messages appearing without a
-- refetch), add these tables to the realtime publication:
-- alter publication supabase_realtime add table public.conversation_messages;
-- alter publication supabase_realtime add table public.typing_indicators;
