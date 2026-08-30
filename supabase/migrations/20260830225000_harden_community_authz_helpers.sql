-- Keep recursion-safe community authorization helpers outside the exposed public
-- RPC schema and bind their decisions to auth.uid(). Public browser-callable
-- SECURITY DEFINER functions remain narrow, actor-derived RPCs only.

BEGIN;

CREATE SCHEMA IF NOT EXISTS authz;
REVOKE ALL ON SCHEMA authz FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA authz TO authenticated;

CREATE OR REPLACE FUNCTION authz.is_user_blocked_with(p_other_user UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT CASE
    WHEN (SELECT auth.uid()) IS NULL OR p_other_user IS NULL THEN false
    WHEN (SELECT auth.uid()) = p_other_user THEN false
    ELSE EXISTS (
      SELECT 1
      FROM public.user_blocks b
      WHERE (b.blocker_id = (SELECT auth.uid()) AND b.blocked_id = p_other_user)
         OR (b.blocker_id = p_other_user AND b.blocked_id = (SELECT auth.uid()))
    )
  END;
$$;

CREATE OR REPLACE FUNCTION authz.is_conversation_member(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT (SELECT auth.uid()) IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM public.conversation_members cm
       WHERE cm.conversation_id = p_conversation_id
         AND cm.user_id = (SELECT auth.uid())
     );
$$;

CREATE OR REPLACE FUNCTION authz.is_conversation_admin(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT (SELECT auth.uid()) IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM public.conversation_members cm
       WHERE cm.conversation_id = p_conversation_id
         AND cm.user_id = (SELECT auth.uid())
         AND cm.is_admin = true
     );
$$;

REVOKE ALL ON FUNCTION authz.is_user_blocked_with(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION authz.is_conversation_member(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION authz.is_conversation_admin(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION authz.is_user_blocked_with(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION authz.is_conversation_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION authz.is_conversation_admin(UUID) TO authenticated;

-- Rebind authenticated social policies to actor-derived authz helpers.
DROP POLICY IF EXISTS user_profiles_authenticated_select ON public.user_profiles;
CREATE POLICY user_profiles_authenticated_select ON public.user_profiles FOR SELECT TO authenticated
USING (
  (SELECT auth.uid()) = user_id
  OR (
    is_public = true
    AND is_deactivated = false
    AND NOT authz.is_user_blocked_with(user_id)
  )
);

DROP POLICY IF EXISTS posts_authenticated_select ON public.posts;
CREATE POLICY posts_authenticated_select ON public.posts FOR SELECT TO authenticated
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
  AND NOT authz.is_user_blocked_with(user_id)
  AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.user_id = posts.user_id AND up.is_deactivated = true
  )
);

DROP POLICY IF EXISTS follows_authenticated_select ON public.follows;
CREATE POLICY follows_authenticated_select ON public.follows FOR SELECT TO authenticated
USING (
  NOT authz.is_user_blocked_with(follower_id)
  AND NOT authz.is_user_blocked_with(following_id)
);

DROP POLICY IF EXISTS follows_owner_insert ON public.follows;
CREATE POLICY follows_owner_insert ON public.follows FOR INSERT TO authenticated
WITH CHECK (
  (SELECT auth.uid()) = follower_id
  AND follower_id <> following_id
  AND NOT authz.is_user_blocked_with(following_id)
);

DROP POLICY IF EXISTS stories_authenticated_select ON public.stories;
CREATE POLICY stories_authenticated_select ON public.stories FOR SELECT TO authenticated
USING (
  expires_at > NOW()
  AND NOT authz.is_user_blocked_with(user_id)
);

-- Rebind conversation policies to a one-argument helper that always derives the
-- member/admin identity from the authenticated request.
DROP POLICY IF EXISTS conversations_member_select ON public.conversations;
CREATE POLICY conversations_member_select ON public.conversations FOR SELECT TO authenticated
  USING (authz.is_conversation_member(id));

DROP POLICY IF EXISTS conversations_admin_update ON public.conversations;
CREATE POLICY conversations_admin_update ON public.conversations FOR UPDATE TO authenticated
  USING (authz.is_conversation_admin(id))
  WITH CHECK (authz.is_conversation_admin(id));

DROP POLICY IF EXISTS conversation_members_member_select ON public.conversation_members;
CREATE POLICY conversation_members_member_select ON public.conversation_members FOR SELECT TO authenticated
  USING (authz.is_conversation_member(conversation_id));

DROP POLICY IF EXISTS conversation_messages_member_select ON public.conversation_messages;
CREATE POLICY conversation_messages_member_select ON public.conversation_messages FOR SELECT TO authenticated
  USING (
    authz.is_conversation_member(conversation_id)
    AND NOT authz.is_user_blocked_with(sender_id)
  );

DROP POLICY IF EXISTS typing_member_select ON public.typing_indicators;
CREATE POLICY typing_member_select ON public.typing_indicators FOR SELECT TO authenticated
  USING (authz.is_conversation_member(conversation_id));

DROP POLICY IF EXISTS typing_self_insert ON public.typing_indicators;
CREATE POLICY typing_self_insert ON public.typing_indicators FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND authz.is_conversation_member(conversation_id)
  );

-- Rewrite the deliberate browser-facing SECURITY DEFINER RPCs so none depend on
-- arbitrary-identity public helpers.
CREATE OR REPLACE FUNCTION public.get_or_create_direct_conversation(p_other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  actor UUID := (SELECT auth.uid());
  conversation_id UUID;
  pair_key TEXT;
  other_permission TEXT;
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_other_user_id IS NULL OR p_other_user_id = actor THEN RAISE EXCEPTION 'Invalid conversation participant'; END IF;
  IF authz.is_user_blocked_with(p_other_user_id) THEN RAISE EXCEPTION 'Messaging is unavailable between these accounts'; END IF;

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
SET search_path = pg_catalog, public
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
  IF EXISTS (SELECT 1 FROM unnest(clean_members) u WHERE authz.is_user_blocked_with(u)) THEN
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
SET search_path = pg_catalog, public
AS $$
DECLARE
  actor UUID := (SELECT auth.uid());
  message_id UUID;
  is_group_conversation BOOLEAN;
BEGIN
  IF actor IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_conversation_id IS NULL OR NOT authz.is_conversation_member(p_conversation_id) THEN
    RAISE EXCEPTION 'Conversation not found';
  END IF;
  IF NULLIF(BTRIM(p_content), '') IS NULL THEN RAISE EXCEPTION 'Message cannot be empty'; END IF;
  IF char_length(p_content) > 4000 THEN RAISE EXCEPTION 'Message exceeds 4000 characters'; END IF;

  SELECT c.is_group INTO is_group_conversation FROM public.conversations c WHERE c.id = p_conversation_id;
  IF is_group_conversation = false AND EXISTS (
    SELECT 1 FROM public.conversation_members cm
    WHERE cm.conversation_id = p_conversation_id
      AND cm.user_id <> actor
      AND authz.is_user_blocked_with(cm.user_id)
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

CREATE OR REPLACE FUNCTION public.list_my_conversations(p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  name TEXT,
  is_group BOOLEAN,
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ,
  unread_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  WITH actor_memberships AS (
    SELECT cm.conversation_id, cm.last_read_at
    FROM public.conversation_members cm
    WHERE cm.user_id = (SELECT auth.uid())
  )
  SELECT
    c.id,
    c.name,
    c.is_group,
    c.last_message_at,
    c.last_message_preview,
    c.avatar_url,
    c.created_at,
    (
      SELECT COUNT(*)
      FROM public.conversation_messages m
      WHERE m.conversation_id = c.id
        AND m.sender_id <> (SELECT auth.uid())
        AND COALESCE(m.is_deleted, false) = false
        AND (am.last_read_at IS NULL OR m.created_at > am.last_read_at)
        AND NOT authz.is_user_blocked_with(m.sender_id)
    ) AS unread_count
  FROM actor_memberships am
  JOIN public.conversations c ON c.id = am.conversation_id
  WHERE (SELECT auth.uid()) IS NOT NULL
  ORDER BY c.last_message_at DESC, c.id DESC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 100);
$$;

CREATE OR REPLACE FUNCTION public.notify_on_conversation_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
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
    AND NOT EXISTS (
      SELECT 1
      FROM public.user_blocks b
      WHERE (b.blocker_id = cm.user_id AND b.blocked_id = NEW.sender_id)
         OR (b.blocker_id = NEW.sender_id AND b.blocked_id = cm.user_id)
    )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Reassert browser grants only on the intentionally public, actor-derived RPCs.
REVOKE ALL ON FUNCTION public.get_or_create_direct_conversation(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.create_group_conversation(TEXT, UUID[]) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.send_conversation_message(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.list_my_conversations(INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_or_create_direct_conversation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_group_conversation(TEXT, UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.send_conversation_message(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_my_conversations(INTEGER) TO authenticated;
REVOKE ALL ON FUNCTION public.notify_on_conversation_message() FROM PUBLIC, anon, authenticated;

-- The old helpers accepted arbitrary user ids and were browser executable. Remove
-- them only after every policy/RPC above has been rebound; no CASCADE is used, so
-- an unexpected dependency fails the migration rather than being silently dropped.
REVOKE ALL ON FUNCTION public.is_user_blocked_between(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_conversation_member(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_conversation_admin(UUID, UUID) FROM PUBLIC, anon, authenticated;
DROP FUNCTION public.is_user_blocked_between(UUID, UUID);
DROP FUNCTION public.is_conversation_member(UUID, UUID);
DROP FUNCTION public.is_conversation_admin(UUID, UUID);

COMMENT ON FUNCTION authz.is_user_blocked_with(UUID) IS
  'Internal RLS helper. Actor is always auth.uid(); callers cannot inspect arbitrary user pairs.';
COMMENT ON FUNCTION authz.is_conversation_member(UUID) IS
  'Internal RLS helper. Membership identity is always auth.uid().';
COMMENT ON FUNCTION authz.is_conversation_admin(UUID) IS
  'Internal RLS helper. Admin identity is always auth.uid().';

COMMIT;
