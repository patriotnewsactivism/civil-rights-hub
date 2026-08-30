-- Read/query helpers for the production messaging client.
-- These keep pagination and unread calculations in PostgreSQL and avoid browser N+1 scans.

BEGIN;

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
SET search_path = public, pg_temp
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
        AND NOT public.is_user_blocked_between((SELECT auth.uid()), m.sender_id)
    ) AS unread_count
  FROM actor_memberships am
  JOIN public.conversations c ON c.id = am.conversation_id
  WHERE (SELECT auth.uid()) IS NOT NULL
  ORDER BY c.last_message_at DESC, c.id DESC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 100);
$$;

CREATE OR REPLACE FUNCTION public.get_conversation_messages(
  p_conversation_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_before_created_at TIMESTAMPTZ DEFAULT NULL,
  p_before_id UUID DEFAULT NULL
)
RETURNS SETOF public.conversation_messages
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
  SELECT m.*
  FROM public.conversation_messages m
  WHERE m.conversation_id = p_conversation_id
    AND COALESCE(m.is_deleted, false) = false
    AND (
      p_before_created_at IS NULL
      OR m.created_at < p_before_created_at
      OR (m.created_at = p_before_created_at AND (p_before_id IS NULL OR m.id < p_before_id))
    )
  ORDER BY m.created_at DESC, m.id DESC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 100);
$$;

CREATE OR REPLACE FUNCTION public.get_my_unread_message_count()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT COALESCE(SUM(unread_count), 0)::integer
  FROM public.list_my_conversations(100);
$$;

REVOKE ALL ON FUNCTION public.list_my_conversations(INTEGER) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_conversation_messages(UUID, INTEGER, TIMESTAMPTZ, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_my_unread_message_count() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_my_conversations(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_conversation_messages(UUID, INTEGER, TIMESTAMPTZ, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_unread_message_count() TO authenticated;

COMMIT;
