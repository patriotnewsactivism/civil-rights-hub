-- Social Media Platform v2
-- Adds: stories/ephemeral posts, group conversations, live streams,
--       user interest tracking for transparent algorithm,
--       reactions (beyond simple likes), typing indicators
-- All tables include RLS. No shadow-banning: no hidden post suppression.

-- ============================================================
-- STORIES / EPHEMERAL POSTS (24-hour lifetime)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.stories (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content         TEXT,
  media_url       TEXT,
  media_type      TEXT CHECK (media_type IN ('image', 'video', 'text', 'poll')),
  background_color TEXT DEFAULT '#1a1a2e',
  text_color      TEXT DEFAULT '#ffffff',
  link_url        TEXT,
  link_title      TEXT,
  hashtags        TEXT[],
  view_count      INTEGER DEFAULT 0 NOT NULL,
  expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours') NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.story_views (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id    UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
  viewer_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  viewed_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(story_id, viewer_id)
);

-- Auto-delete expired stories (called by a cron or on-read filter)
CREATE OR REPLACE FUNCTION public.cleanup_expired_stories()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM public.stories WHERE expires_at < NOW();
END;
$$;

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='stories' AND policyname='stories_select') THEN
    CREATE POLICY stories_select ON public.stories FOR SELECT USING (expires_at > NOW());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='stories' AND policyname='stories_insert') THEN
    CREATE POLICY stories_insert ON public.stories FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='stories' AND policyname='stories_delete') THEN
    CREATE POLICY stories_delete ON public.stories FOR DELETE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='story_views' AND policyname='story_views_select') THEN
    CREATE POLICY story_views_select ON public.story_views FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='story_views' AND policyname='story_views_insert') THEN
    CREATE POLICY story_views_insert ON public.story_views FOR INSERT WITH CHECK (auth.uid() = viewer_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS stories_user_id_idx ON public.stories(user_id);
CREATE INDEX IF NOT EXISTS stories_expires_at_idx ON public.stories(expires_at);

-- ============================================================
-- GROUP CONVERSATIONS & MESSAGING UPGRADE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name                  TEXT,
  is_group              BOOLEAN DEFAULT false NOT NULL,
  created_by            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_message_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_message_preview  TEXT,
  avatar_url            TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.conversation_members (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id   UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_read_at      TIMESTAMPTZ,
  is_admin          BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id   UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content           TEXT,
  media_url         TEXT,
  media_type        TEXT CHECK (media_type IN ('image', 'video', 'audio', 'file')),
  reply_to_id       UUID REFERENCES public.conversation_messages(id) ON DELETE SET NULL,
  is_deleted        BOOLEAN DEFAULT false NOT NULL,
  deleted_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  edited_at         TIMESTAMPTZ
);

-- Typing indicators (ephemeral — cleaned by trigger or TTL)
CREATE TABLE IF NOT EXISTS public.typing_indicators (
  conversation_id   UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY(conversation_id, user_id)
);

-- Extend direct_messages with conversation_id for backwards compat migration
ALTER TABLE public.direct_messages
  ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_type TEXT;

-- RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- conversations: only members can see
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='conversations' AND policyname='conversations_select') THEN
    CREATE POLICY conversations_select ON public.conversations FOR SELECT
      USING (id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='conversations' AND policyname='conversations_insert') THEN
    CREATE POLICY conversations_insert ON public.conversations FOR INSERT WITH CHECK (auth.uid() = created_by);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='conversations' AND policyname='conversations_update') THEN
    CREATE POLICY conversations_update ON public.conversations FOR UPDATE
      USING (id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid() AND is_admin = true));
  END IF;

  -- conversation_members: visible to members
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='conversation_members' AND policyname='conv_members_select') THEN
    CREATE POLICY conv_members_select ON public.conversation_members FOR SELECT
      USING (conversation_id IN (SELECT conversation_id FROM public.conversation_members cm WHERE cm.user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='conversation_members' AND policyname='conv_members_insert') THEN
    CREATE POLICY conv_members_insert ON public.conversation_members FOR INSERT WITH CHECK (
      auth.uid() = user_id OR
      conversation_id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid() AND is_admin = true)
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='conversation_members' AND policyname='conv_members_delete') THEN
    CREATE POLICY conv_members_delete ON public.conversation_members FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- messages: members read, sender writes
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='conversation_messages' AND policyname='conv_messages_select') THEN
    CREATE POLICY conv_messages_select ON public.conversation_messages FOR SELECT
      USING (conversation_id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='conversation_messages' AND policyname='conv_messages_insert') THEN
    CREATE POLICY conv_messages_insert ON public.conversation_messages FOR INSERT
      WITH CHECK (auth.uid() = sender_id AND
        conversation_id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='conversation_messages' AND policyname='conv_messages_update') THEN
    CREATE POLICY conv_messages_update ON public.conversation_messages FOR UPDATE USING (auth.uid() = sender_id);
  END IF;

  -- typing indicators
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='typing_indicators' AND policyname='typing_select') THEN
    CREATE POLICY typing_select ON public.typing_indicators FOR SELECT
      USING (conversation_id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='typing_indicators' AND policyname='typing_upsert') THEN
    CREATE POLICY typing_upsert ON public.typing_indicators FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS conv_members_user_idx ON public.conversation_members(user_id);
CREATE INDEX IF NOT EXISTS conv_members_conv_idx ON public.conversation_members(conversation_id);
CREATE INDEX IF NOT EXISTS conv_messages_conv_idx ON public.conversation_messages(conversation_id, created_at DESC);

-- Trigger: update last_message_at / preview when a message is sent
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      last_message_preview = LEFT(COALESCE(NEW.content, '[media]'), 80)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_conversation_message ON public.conversation_messages;
CREATE TRIGGER on_conversation_message
  AFTER INSERT ON public.conversation_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- ============================================================
-- LIVE STREAMS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.live_streams (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title             TEXT NOT NULL DEFAULT 'Live Stream',
  description       TEXT,
  recording_url     TEXT,
  thumbnail_url     TEXT,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending','live','ended','failed')) NOT NULL,
  viewer_count      INTEGER DEFAULT 0 NOT NULL,
  peak_viewers      INTEGER DEFAULT 0 NOT NULL,
  duration_seconds  INTEGER,
  location_lat      DOUBLE PRECISION,
  location_lng      DOUBLE PRECISION,
  location_state    TEXT,
  location_city     TEXT,
  post_id           UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  started_at        TIMESTAMPTZ,
  ended_at          TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='live_streams' AND policyname='live_select') THEN
    CREATE POLICY live_select ON public.live_streams FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='live_streams' AND policyname='live_insert') THEN
    CREATE POLICY live_insert ON public.live_streams FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='live_streams' AND policyname='live_update') THEN
    CREATE POLICY live_update ON public.live_streams FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS live_streams_user_idx ON public.live_streams(user_id);
CREATE INDEX IF NOT EXISTS live_streams_status_idx ON public.live_streams(status, created_at DESC);

-- ============================================================
-- USER INTEREST TRACKING (powers transparent For You algorithm)
-- Tracks which hashtags each user engages with — no black box
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_interests (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hashtag           TEXT NOT NULL,
  interaction_count INTEGER DEFAULT 1 NOT NULL,
  last_interacted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, hashtag)
);

ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_interests' AND policyname='interests_select') THEN
    CREATE POLICY interests_select ON public.user_interests FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_interests' AND policyname='interests_upsert') THEN
    CREATE POLICY interests_upsert ON public.user_interests FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS user_interests_user_idx ON public.user_interests(user_id, interaction_count DESC);

-- Function to record interest when user likes/comments on a post
CREATE OR REPLACE FUNCTION public.track_hashtag_interest(
  p_user_id UUID,
  p_hashtags TEXT[]
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF p_hashtags IS NULL OR array_length(p_hashtags, 1) IS NULL THEN RETURN; END IF;
  INSERT INTO public.user_interests (user_id, hashtag, interaction_count, last_interacted_at)
  SELECT p_user_id, unnest(p_hashtags), 1, NOW()
  ON CONFLICT (user_id, hashtag)
  DO UPDATE SET
    interaction_count   = user_interests.interaction_count + 1,
    last_interacted_at  = NOW();
END;
$$;

-- ============================================================
-- POST REACTIONS (extends likes with reaction types)
-- No engagement manipulation: all reactions weighted equally
-- ============================================================

CREATE TABLE IF NOT EXISTS public.post_reactions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id       UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT CHECK (reaction_type IN ('like','solidarity','fire','heart','fist')) NOT NULL DEFAULT 'like',
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='post_reactions' AND policyname='reactions_select') THEN
    CREATE POLICY reactions_select ON public.post_reactions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='post_reactions' AND policyname='reactions_upsert') THEN
    CREATE POLICY reactions_upsert ON public.post_reactions FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS post_reactions_post_idx ON public.post_reactions(post_id);
CREATE INDEX IF NOT EXISTS post_reactions_user_idx ON public.post_reactions(user_id);

-- ============================================================
-- ENABLE REALTIME for social tables
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_indicators;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_streams;
