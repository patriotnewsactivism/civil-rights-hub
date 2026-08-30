-- Civil Rights Hub production community foundation.
-- Adds blocking/muting, notification preferences, hardened conversation RLS,
-- atomic conversation/message RPCs, and block-aware feed/profile policies.
-- All actor identity is derived from auth.uid(); browser callers never supply an owner id.

BEGIN;

-- -----------------------------------------------------------------------------
-- Relationship privacy primitives
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_blocks (
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id),
  CONSTRAINT user_blocks_no_self CHECK (blocker_id <> blocked_id)
);

CREATE TABLE IF NOT EXISTS public.user_mutes (
  muter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  muted_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (muter_id, muted_id),
  CONSTRAINT user_mutes_no_self CHECK (muter_id <> muted_id)
);

CREATE INDEX IF NOT EXISTS user_blocks_blocked_idx ON public.user_blocks(blocked_id, blocker_id);
CREATE INDEX IF NOT EXISTS user_mutes_muted_idx ON public.user_mutes(muted_id, muter_id);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mutes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_blocks_owner_select ON public.user_blocks;
DROP POLICY IF EXISTS user_blocks_owner_insert ON public.user_blocks;
DROP POLICY IF EXISTS user_blocks_owner_delete ON public.user_blocks;
CREATE POLICY user_blocks_owner_select ON public.user_blocks FOR SELECT TO authenticated
  USING (blocker_id = (SELECT auth.uid()));
CREATE POLICY user_blocks_owner_insert ON public.user_blocks FOR INSERT TO authenticated
  WITH CHECK (blocker_id = (SELECT auth.uid()) AND blocker_id <> blocked_id);
CREATE POLICY user_blocks_owner_delete ON public.user_blocks FOR DELETE TO authenticated
  USING (blocker_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS user_mutes_owner_select ON public.user_mutes;
DROP POLICY IF EXISTS user_mutes_owner_insert ON public.user_mutes;
DROP POLICY IF EXISTS user_mutes_owner_delete ON public.user_mutes;
CREATE POLICY user_mutes_owner_select ON public.user_mutes FOR SELECT TO authenticated
  USING (muter_id = (SELECT auth.uid()));
CREATE POLICY user_mutes_owner_insert ON public.user_mutes FOR INSERT TO authenticated
  WITH CHECK (muter_id = (SELECT auth.uid()) AND muter_id <> muted_id);
CREATE POLICY user_mutes_owner_delete ON public.user_mutes FOR DELETE TO authenticated
  USING (muter_id = (SELECT auth.uid()));

REVOKE ALL ON public.user_blocks, public.user_mutes FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_blocks, public.user_mutes TO authenticated;

CREATE OR REPLACE FUNCTION public.is_user_blocked_between(p_user_a UUID, p_user_b UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN p_user_a IS NULL OR p_user_b IS NULL THEN false
    WHEN p_user_a = p_user_b THEN false
    ELSE EXISTS (
      SELECT 1
      FROM public.user_blocks b
      WHERE (b.blocker_id = p_user_a AND b.blocked_id = p_user_b)
         OR (b.blocker_id = p_user_b AND b.blocked_id = p_user_a)
    )
  END;
$$;
REVOKE ALL ON FUNCTION public.is_user_blocked_between(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_user_blocked_between(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.cleanup_relationships_after_block()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM public.follows
  WHERE (follower_id = NEW.blocker_id AND following_id = NEW.blocked_id)
     OR (follower_id = NEW.blocked_id AND following_id = NEW.blocker_id);

  DELETE FROM public.user_mutes
  WHERE muter_id = NEW.blocker_id AND muted_id = NEW.blocked_id;

  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.cleanup_relationships_after_block() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS cleanup_relationships_after_block_trigger ON public.user_blocks;
CREATE TRIGGER cleanup_relationships_after_block_trigger
AFTER INSERT ON public.user_blocks
FOR EACH ROW EXECUTE FUNCTION public.cleanup_relationships_after_block();

-- -----------------------------------------------------------------------------
-- Profile/account privacy controls
-- -----------------------------------------------------------------------------

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS message_permission TEXT NOT NULL DEFAULT 'everyone',
  ADD COLUMN IF NOT EXISTS allow_mentions_from TEXT NOT NULL DEFAULT 'everyone',
  ADD COLUMN IF NOT EXISTS is_deactivated BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_message_permission_check') THEN
    ALTER TABLE public.user_profiles
      ADD CONSTRAINT user_profiles_message_permission_check
      CHECK (message_permission IN ('everyone', 'following', 'none'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_allow_mentions_from_check') THEN
    ALTER TABLE public.user_profiles
      ADD CONSTRAINT user_profiles_allow_mentions_from_check
      CHECK (allow_mentions_from IN ('everyone', 'following', 'none'));
  END IF;
END $$;

DROP POLICY IF EXISTS user_profiles_public_select ON public.user_profiles;
CREATE POLICY user_profiles_public_select ON public.user_profiles FOR SELECT TO anon, authenticated
USING (
  (SELECT auth.uid()) = user_id
  OR (
    is_public = true
    AND is_deactivated = false
    AND (
      (SELECT auth.uid()) IS NULL
      OR NOT public.is_user_blocked_between((SELECT auth.uid()), user_id)
    )
  )
);

-- Existing recovery migration uses column-level grants. Expose only the new non-secret
-- preference/deactivation fields, while retaining owner-only RLS for writes.
GRANT SELECT (message_permission, allow_mentions_from, is_deactivated, deactivated_at)
  ON public.user_profiles TO anon, authenticated;
GRANT UPDATE (message_permission, allow_mentions_from)
  ON public.user_profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.deactivate_my_account()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor UUID := (SELECT auth.uid());
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  UPDATE public.user_profiles
  SET is_deactivated = true, deactivated_at = NOW(), updated_at = NOW()
  WHERE user_id = actor;
END;
$$;

CREATE OR REPLACE FUNCTION public.reactivate_my_account()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor UUID := (SELECT auth.uid());
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  UPDATE public.user_profiles
  SET is_deactivated = false, deactivated_at = NULL, updated_at = NOW()
  WHERE user_id = actor;
END;
$$;

REVOKE ALL ON FUNCTION public.deactivate_my_account() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.reactivate_my_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.deactivate_my_account() TO authenticated;
GRANT EXECUTE ON FUNCTION public.reactivate_my_account() TO authenticated;

-- -----------------------------------------------------------------------------
-- Block-aware social reads and writes
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS posts_public_select ON public.posts;
CREATE POLICY posts_public_select ON public.posts FOR SELECT TO anon, authenticated
USING (
  (
    visibility = 'public'
    OR (SELECT auth.uid()) = user_id
    OR (
      visibility = 'followers'
      AND EXISTS (
        SELECT 1 FROM public.follows f
        WHERE f.follower_id = (SELECT auth.uid())
          AND f.following_id = posts.user_id
      )
    )
  )
  AND (
    (SELECT auth.uid()) IS NULL
    OR NOT public.is_user_blocked_between((SELECT auth.uid()), user_id)
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = posts.user_id AND up.is_deactivated = true
  )
);

DROP POLICY IF EXISTS follows_public_select ON public.follows;
CREATE POLICY follows_public_select ON public.follows FOR SELECT TO anon, authenticated
USING (
  (SELECT auth.uid()) IS NULL
  OR NOT public.is_user_blocked_between((SELECT auth.uid()), follower_id)
  AND NOT public.is_user_blocked_between((SELECT auth.uid()), following_id)
);

DROP POLICY IF EXISTS follows_owner_insert ON public.follows;
CREATE POLICY follows_owner_insert ON public.follows FOR INSERT TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = follower_id
  AND follower_id <> following_id
  AND NOT public.is_user_blocked_between(follower_id, following_id)
);

DROP POLICY IF EXISTS stories_live_select ON public.stories;
CREATE POLICY stories_live_select ON public.stories FOR SELECT TO anon, authenticated
USING (
  expires_at > NOW()
  AND (
    (SELECT auth.uid()) IS NULL
    OR NOT public.is_user_blocked_between((SELECT auth.uid()), user_id)
  )
);

-- Deterministic, cursor-based feed. RLS remains authoritative; muting is an additional
-- personalized feed preference and does not make otherwise-public content secret.
CREATE OR REPLACE FUNCTION public.get_community_feed(
  p_limit INTEGER DEFAULT 30,
  p_before_created_at TIMESTAMPTZ DEFAULT NULL,
  p_before_id UUID DEFAULT NULL
)
RETURNS SETOF public.posts
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
  SELECT p.*
  FROM public.posts p
  WHERE
    (
      p_before_created_at IS NULL
      OR p.created_at < p_before_created_at
      OR (p.created_at = p_before_created_at AND (p_before_id IS NULL OR p.id < p_before_id))
    )
    AND (
      (SELECT auth.uid()) IS NULL
      OR NOT EXISTS (
        SELECT 1 FROM public.user_mutes m
        WHERE m.muter_id = (SELECT auth.uid()) AND m.muted_id = p.user_id
      )
    )
  ORDER BY p.created_at DESC, p.id DESC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 30), 1), 100);
$$;
REVOKE ALL ON FUNCTION public.get_community_feed(INTEGER, TIMESTAMPTZ, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_community_feed(INTEGER, TIMESTAMPTZ, UUID) TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- Notification preferences and owner-only notification controls
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  in_app_enabled BOOLEAN NOT NULL DEFAULT true,
  email_enabled BOOLEAN NOT NULL DEFAULT false,
  follower_notifications BOOLEAN NOT NULL DEFAULT true,
  reaction_notifications BOOLEAN NOT NULL DEFAULT true,
  comment_notifications BOOLEAN NOT NULL DEFAULT true,
  reply_notifications BOOLEAN NOT NULL DEFAULT true,
  mention_notifications BOOLEAN NOT NULL DEFAULT true,
  community_notifications BOOLEAN NOT NULL DEFAULT true,
  message_notifications BOOLEAN NOT NULL DEFAULT true,
  topic_notifications BOOLEAN NOT NULL DEFAULT true,
  moderation_notifications BOOLEAN NOT NULL DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS notification_preferences_owner_select ON public.notification_preferences;
DROP POLICY IF EXISTS notification_preferences_owner_insert ON public.notification_preferences;
DROP POLICY IF EXISTS notification_preferences_owner_update ON public.notification_preferences;
CREATE POLICY notification_preferences_owner_select ON public.notification_preferences FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY notification_preferences_owner_insert ON public.notification_preferences FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY notification_preferences_owner_update ON public.notification_preferences FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
REVOKE ALL ON public.notification_preferences FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notification_preferences TO authenticated;

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS message TEXT,
  ADD COLUMN IF NOT EXISTS related_entity_type TEXT,
  ADD COLUMN IF NOT EXISTS related_entity_id UUID,
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS dedupe_key TEXT;

UPDATE public.notifications
SET title = COALESCE(NULLIF(title, ''), INITCAP(REPLACE(type, '_', ' ')), 'Notification'),
    message = COALESCE(NULLIF(message, ''), NULLIF(content, ''), 'You have a new notification.')
WHERE title IS NULL OR title = '' OR message IS NULL OR message = '';

CREATE UNIQUE INDEX IF NOT EXISTS notifications_user_dedupe_idx
  ON public.notifications(user_id, dedupe_key)
  WHERE dedupe_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS notifications_user_unread_created_idx
  ON public.notifications(user_id, is_read, created_at DESC);

DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'notifications'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.notifications', p.policyname);
  END LOOP;
END $$;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_owner_select ON public.notifications FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE POLICY notifications_owner_update ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY notifications_owner_delete ON public.notifications FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

REVOKE ALL ON public.notifications FROM PUBLIC, anon, authenticated;
GRANT SELECT, DELETE ON public.notifications TO authenticated;
GRANT UPDATE (is_read, read_at) ON public.notifications TO authenticated;

-- Harden legacy caller-supplied notification helpers by deriving the recipient from the session.
CREATE OR REPLACE FUNCTION public.get_unread_notifications_count(p_user_id UUID DEFAULT NULL)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COUNT(*)::integer
  FROM public.notifications n
  WHERE n.user_id = (SELECT auth.uid()) AND n.is_read = false;
$$;
REVOKE ALL ON FUNCTION public.get_unread_notifications_count(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_unread_notifications_count(UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- Conversation RLS helpers: avoid recursive policies on conversation_members.
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_conversation_member(p_conversation_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_members cm
    WHERE cm.conversation_id = p_conversation_id AND cm.user_id = p_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_conversation_admin(p_conversation_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_members cm
    WHERE cm.conversation_id = p_conversation_id AND cm.user_id = p_user_id AND cm.is_admin = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_conversation_member(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_conversation_admin(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_conversation_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_conversation_admin(UUID, UUID) TO authenticated;

DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = ANY (ARRAY['conversations','conversation_members','conversation_messages','typing_indicators'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

CREATE POLICY conversations_member_select ON public.conversations FOR SELECT TO authenticated
  USING (public.is_conversation_member(id, (SELECT auth.uid())));
CREATE POLICY conversations_admin_update ON public.conversations FOR UPDATE TO authenticated
  USING (public.is_conversation_admin(id, (SELECT auth.uid())))
  WITH CHECK (public.is_conversation_admin(id, (SELECT auth.uid())));

CREATE POLICY conversation_members_member_select ON public.conversation_members FOR SELECT TO authenticated
  USING (public.is_conversation_member(conversation_id, (SELECT auth.uid())));
CREATE POLICY conversation_members_self_delete ON public.conversation_members FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY conversation_messages_member_select ON public.conversation_messages FOR SELECT TO authenticated
  USING (
    public.is_conversation_member(conversation_id, (SELECT auth.uid()))
    AND NOT public.is_user_blocked_between((SELECT auth.uid()), sender_id)
  );
CREATE POLICY conversation_messages_sender_update ON public.conversation_messages FOR UPDATE TO authenticated
  USING (sender_id = (SELECT auth.uid()))
  WITH CHECK (sender_id = (SELECT auth.uid()));

CREATE POLICY typing_member_select ON public.typing_indicators FOR SELECT TO authenticated
  USING (public.is_conversation_member(conversation_id, (SELECT auth.uid())));
CREATE POLICY typing_self_insert ON public.typing_indicators FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND public.is_conversation_member(conversation_id, (SELECT auth.uid()))
  );
CREATE POLICY typing_self_update ON public.typing_indicators FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
CREATE POLICY typing_self_delete ON public.typing_indicators FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

REVOKE ALL ON public.conversations, public.conversation_members, public.conversation_messages, public.typing_indicators
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.conversations, public.conversation_members, public.conversation_messages, public.typing_indicators
  TO authenticated;
GRANT UPDATE (name, avatar_url) ON public.conversations TO authenticated;
GRANT UPDATE (content, is_deleted, deleted_at, edited_at) ON public.conversation_messages TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.typing_indicators TO authenticated;
GRANT DELETE ON public.conversation_members TO authenticated;

-- -----------------------------------------------------------------------------
-- Atomic messaging API
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_or_create_direct_conversation(p_other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor UUID := (SELECT auth.uid());
  conversation_id UUID;
  pair_key TEXT;
  other_permission TEXT;
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_other_user_id IS NULL OR p_other_user_id = actor THEN RAISE EXCEPTION 'Invalid conversation participant'; END IF;
  IF public.is_user_blocked_between(actor, p_other_user_id) THEN RAISE EXCEPTION 'Messaging is unavailable between these accounts'; END IF;

  SELECT COALESCE(up.message_permission, 'everyone') INTO other_permission
  FROM public.user_profiles up WHERE up.user_id = p_other_user_id AND up.is_deactivated = false;
  IF NOT FOUND THEN RAISE EXCEPTION 'Recipient is unavailable'; END IF;
  IF other_permission = 'none' THEN RAISE EXCEPTION 'Recipient is not accepting new messages'; END IF;
  IF other_permission = 'following' AND NOT EXISTS (
    SELECT 1 FROM public.follows f WHERE f.follower_id = p_other_user_id AND f.following_id = actor
  ) THEN
    RAISE EXCEPTION 'Recipient only accepts messages from accounts they follow';
  END IF;

  pair_key := LEAST(actor::text, p_other_user_id::text) || ':' || GREATEST(actor::text, p_other_user_id::text);
  PERFORM pg_advisory_xact_lock(hashtextextended(pair_key, 0));

  SELECT c.id INTO conversation_id
  FROM public.conversations c
  WHERE c.is_group = false
    AND EXISTS (SELECT 1 FROM public.conversation_members m WHERE m.conversation_id = c.id AND m.user_id = actor)
    AND EXISTS (SELECT 1 FROM public.conversation_members m WHERE m.conversation_id = c.id AND m.user_id = p_other_user_id)
    AND (SELECT COUNT(*) FROM public.conversation_members m WHERE m.conversation_id = c.id) = 2
  ORDER BY c.created_at ASC
  LIMIT 1;

  IF conversation_id IS NULL THEN
    INSERT INTO public.conversations(is_group, created_by)
    VALUES (false, actor)
    RETURNING id INTO conversation_id;

    INSERT INTO public.conversation_members(conversation_id, user_id, is_admin)
    VALUES
      (conversation_id, actor, true),
      (conversation_id, p_other_user_id, false);
  END IF;

  RETURN conversation_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_group_conversation(p_name TEXT, p_member_ids UUID[])
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor UUID := (SELECT auth.uid());
  conversation_id UUID;
  clean_members UUID[];
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;

  SELECT COALESCE(array_agg(DISTINCT u), ARRAY[]::UUID[])
  INTO clean_members
  FROM unnest(COALESCE(p_member_ids, ARRAY[]::UUID[])) AS u
  WHERE u IS NOT NULL AND u <> actor;

  IF COALESCE(array_length(clean_members, 1), 0) < 1 THEN RAISE EXCEPTION 'Select at least one other member'; END IF;
  IF array_length(clean_members, 1) > 49 THEN RAISE EXCEPTION 'Group conversations are limited to 50 members'; END IF;
  IF EXISTS (SELECT 1 FROM unnest(clean_members) u WHERE public.is_user_blocked_between(actor, u)) THEN
    RAISE EXCEPTION 'Blocked accounts cannot be added to a new group';
  END IF;

  INSERT INTO public.conversations(is_group, name, created_by)
  VALUES (true, LEFT(COALESCE(NULLIF(BTRIM(p_name), ''), 'Group Chat'), 120), actor)
  RETURNING id INTO conversation_id;

  INSERT INTO public.conversation_members(conversation_id, user_id, is_admin)
  VALUES (conversation_id, actor, true);

  INSERT INTO public.conversation_members(conversation_id, user_id, is_admin)
  SELECT conversation_id, u, false FROM unnest(clean_members) u;

  RETURN conversation_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.send_conversation_message(p_conversation_id UUID, p_content TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  actor UUID := (SELECT auth.uid());
  message_id UUID;
  is_group_conversation BOOLEAN;
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_conversation_id IS NULL OR NOT public.is_conversation_member(p_conversation_id, actor) THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;
  IF NULLIF(BTRIM(p_content), '') IS NULL THEN RAISE EXCEPTION 'Message cannot be empty'; END IF;
  IF char_length(p_content) > 4000 THEN RAISE EXCEPTION 'Message exceeds 4000 characters'; END IF;

  SELECT c.is_group INTO is_group_conversation FROM public.conversations c WHERE c.id = p_conversation_id;
  IF is_group_conversation = false AND EXISTS (
    SELECT 1 FROM public.conversation_members cm
    WHERE cm.conversation_id = p_conversation_id
      AND cm.user_id <> actor
      AND public.is_user_blocked_between(actor, cm.user_id)
  ) THEN
    RAISE EXCEPTION 'Messaging is unavailable between these accounts';
  END IF;

  IF (SELECT COUNT(*) FROM public.conversation_messages m
      WHERE m.sender_id = actor AND m.created_at > NOW() - INTERVAL '60 seconds') >= 30 THEN
    RAISE EXCEPTION 'Message rate limit exceeded; try again shortly';
  END IF;

  INSERT INTO public.conversation_messages(conversation_id, sender_id, content)
  VALUES (p_conversation_id, actor, BTRIM(p_content))
  RETURNING id INTO message_id;

  RETURN message_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_conversation_read(p_conversation_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE actor UUID := (SELECT auth.uid());
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  UPDATE public.conversation_members
  SET last_read_at = NOW()
  WHERE conversation_id = p_conversation_id AND user_id = actor;
  IF NOT FOUND THEN RAISE EXCEPTION 'Conversation not found'; END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.get_or_create_direct_conversation(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.create_group_conversation(TEXT, UUID[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.send_conversation_message(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mark_conversation_read(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_or_create_direct_conversation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_group_conversation(TEXT, UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_conversation_message(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_conversation_read(UUID) TO authenticated;

-- Conversation message notifications. Existing direct_messages triggers remain for legacy rows;
-- the current UI writes conversation_messages and previously produced no message notification.
CREATE OR REPLACE FUNCTION public.notify_on_conversation_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.notifications(
    user_id, type, from_user_id, content, title, message,
    related_entity_type, related_entity_id, is_read, created_at, dedupe_key
  )
  SELECT
    cm.user_id,
    'message',
    NEW.sender_id,
    LEFT(COALESCE(NEW.content, 'New message'), 500),
    'New message',
    LEFT(COALESCE(NEW.content, 'You received a new message.'), 500),
    'conversation',
    NEW.conversation_id,
    false,
    NOW(),
    'conversation-message:' || NEW.id::text
  FROM public.conversation_members cm
  LEFT JOIN public.notification_preferences np ON np.user_id = cm.user_id
  WHERE cm.conversation_id = NEW.conversation_id
    AND cm.user_id <> NEW.sender_id
    AND COALESCE(np.in_app_enabled, true)
    AND COALESCE(np.message_notifications, true)
    AND NOT public.is_user_blocked_between(cm.user_id, NEW.sender_id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.notify_on_conversation_message() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trigger_notify_conversation_message ON public.conversation_messages;
CREATE TRIGGER trigger_notify_conversation_message
AFTER INSERT ON public.conversation_messages
FOR EACH ROW EXECUTE FUNCTION public.notify_on_conversation_message();

-- Make notifications realtime if not already present, without failing when already published.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;

COMMIT;
