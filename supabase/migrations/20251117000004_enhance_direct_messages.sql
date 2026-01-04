-- Enhance direct_messages table with threading, starring, and subject support
-- This adds features from WTPN's private_messages system while keeping existing data

-- =====================================================
-- ENHANCE DIRECT_MESSAGES TABLE
-- =====================================================

-- Add new columns to existing direct_messages table
ALTER TABLE public.direct_messages
ADD COLUMN IF NOT EXISTS subject VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_starred_by_sender BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_starred_by_recipient BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS parent_message_id UUID REFERENCES public.direct_messages(id) ON DELETE SET NULL;

-- Add updated_at column if it doesn't exist
ALTER TABLE public.direct_messages
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =====================================================
-- INDEXES
-- =====================================================

-- Add index for starred messages
CREATE INDEX IF NOT EXISTS idx_direct_messages_starred_sender
  ON public.direct_messages(sender_id, is_starred_by_sender) WHERE is_starred_by_sender = TRUE;

CREATE INDEX IF NOT EXISTS idx_direct_messages_starred_recipient
  ON public.direct_messages(recipient_id, is_starred_by_recipient) WHERE is_starred_by_recipient = TRUE;

-- Add index for message threading
CREATE INDEX IF NOT EXISTS idx_direct_messages_parent
  ON public.direct_messages(parent_message_id);

-- Add index for subject search
CREATE INDEX IF NOT EXISTS idx_direct_messages_subject
  ON public.direct_messages(subject) WHERE subject IS NOT NULL;

-- Full-text search on messages
CREATE INDEX IF NOT EXISTS idx_direct_messages_search ON public.direct_messages USING GIN(
  to_tsvector('english', COALESCE(subject, '') || ' ' || content)
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Add updated_at trigger
DROP TRIGGER IF EXISTS update_direct_messages_updated_at ON public.direct_messages;
CREATE TRIGGER update_direct_messages_updated_at
  BEFORE UPDATE ON public.direct_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Get unread message count (updated version)
CREATE OR REPLACE FUNCTION get_unread_message_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.direct_messages
    WHERE recipient_id = p_user_id
      AND is_read = FALSE
      AND is_deleted_by_recipient = FALSE
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Get starred messages
CREATE OR REPLACE FUNCTION get_starred_messages(p_user_id UUID)
RETURNS SETOF public.direct_messages AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.direct_messages
  WHERE (
      (sender_id = p_user_id AND is_starred_by_sender = TRUE AND is_deleted_by_sender = FALSE)
      OR
      (recipient_id = p_user_id AND is_starred_by_recipient = TRUE AND is_deleted_by_recipient = FALSE)
    )
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get message thread
CREATE OR REPLACE FUNCTION get_message_thread(p_message_id UUID, p_user_id UUID)
RETURNS SETOF public.direct_messages AS $$
DECLARE
  v_root_message_id UUID;
BEGIN
  -- Find the root message (traverse up the parent chain)
  WITH RECURSIVE message_chain AS (
    SELECT id, parent_message_id
    FROM public.direct_messages
    WHERE id = p_message_id
    UNION ALL
    SELECT dm.id, dm.parent_message_id
    FROM public.direct_messages dm
    INNER JOIN message_chain mc ON dm.id = mc.parent_message_id
  )
  SELECT id INTO v_root_message_id
  FROM message_chain
  WHERE parent_message_id IS NULL
  LIMIT 1;

  -- Get all messages in the thread
  RETURN QUERY
  WITH RECURSIVE thread AS (
    SELECT *
    FROM public.direct_messages
    WHERE id = v_root_message_id
    UNION ALL
    SELECT dm.*
    FROM public.direct_messages dm
    INNER JOIN thread t ON dm.parent_message_id = t.id
  )
  SELECT *
  FROM thread
  WHERE (sender_id = p_user_id OR recipient_id = p_user_id)
  ORDER BY created_at ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Toggle star status
CREATE OR REPLACE FUNCTION toggle_message_star(p_message_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_sender BOOLEAN;
  v_new_star_status BOOLEAN;
BEGIN
  -- Check if user is sender or recipient
  SELECT sender_id = p_user_id INTO v_is_sender
  FROM public.direct_messages
  WHERE id = p_message_id;

  IF v_is_sender THEN
    -- Toggle for sender
    UPDATE public.direct_messages
    SET is_starred_by_sender = NOT is_starred_by_sender
    WHERE id = p_message_id AND sender_id = p_user_id
    RETURNING is_starred_by_sender INTO v_new_star_status;
  ELSE
    -- Toggle for recipient
    UPDATE public.direct_messages
    SET is_starred_by_recipient = NOT is_starred_by_recipient
    WHERE id = p_message_id AND recipient_id = p_user_id
    RETURNING is_starred_by_recipient INTO v_new_star_status;
  END IF;

  RETURN v_new_star_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search messages
CREATE OR REPLACE FUNCTION search_messages(p_user_id UUID, p_query TEXT, p_limit INTEGER DEFAULT 20)
RETURNS SETOF public.direct_messages AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.direct_messages
  WHERE (sender_id = p_user_id OR recipient_id = p_user_id)
    AND (
      to_tsvector('english', COALESCE(subject, '') || ' ' || content) @@ plainto_tsquery('english', p_query)
    )
    AND (
      (sender_id = p_user_id AND is_deleted_by_sender = FALSE)
      OR
      (recipient_id = p_user_id AND is_deleted_by_recipient = FALSE)
    )
  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get conversation partners (users you've messaged with)
CREATE OR REPLACE FUNCTION get_conversation_partners(p_user_id UUID)
RETURNS TABLE (
  partner_id UUID,
  partner_username TEXT,
  partner_display_name TEXT,
  partner_avatar_url TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH conversations AS (
    SELECT
      CASE
        WHEN sender_id = p_user_id THEN recipient_id
        ELSE sender_id
      END as partner_id,
      MAX(created_at) as last_message_at
    FROM public.direct_messages
    WHERE (sender_id = p_user_id OR recipient_id = p_user_id)
      AND (
        (sender_id = p_user_id AND is_deleted_by_sender = FALSE)
        OR
        (recipient_id = p_user_id AND is_deleted_by_recipient = FALSE)
      )
    GROUP BY partner_id
  ),
  unread_counts AS (
    SELECT
      sender_id as partner_id,
      COUNT(*) as unread_count
    FROM public.direct_messages
    WHERE recipient_id = p_user_id
      AND is_read = FALSE
      AND is_deleted_by_recipient = FALSE
    GROUP BY sender_id
  )
  SELECT
    c.partner_id,
    up.username,
    up.display_name,
    up.avatar_url,
    c.last_message_at,
    COALESCE(uc.unread_count, 0) as unread_count
  FROM conversations c
  LEFT JOIN public.user_profiles up ON up.user_id = c.partner_id
  LEFT JOIN unread_counts uc ON uc.partner_id = c.partner_id
  ORDER BY c.last_message_at DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =====================================================
-- NOTIFICATION TRIGGER FOR NEW MESSAGES
-- =====================================================

-- Notify recipient on new message
CREATE OR REPLACE FUNCTION notify_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for recipient
  PERFORM create_notification(
    NEW.recipient_id,
    'message',
    NEW.sender_id,
    NULL,
    NULL,
    NEW.id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_notify_new_message ON public.direct_messages;

-- Create new trigger
CREATE TRIGGER trigger_notify_new_message
  AFTER INSERT ON public.direct_messages
  FOR EACH ROW EXECUTE FUNCTION notify_on_new_message();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON COLUMN public.direct_messages.subject IS 'Optional subject line for the message';
COMMENT ON COLUMN public.direct_messages.is_starred_by_sender IS 'Whether the sender has starred this message';
COMMENT ON COLUMN public.direct_messages.is_starred_by_recipient IS 'Whether the recipient has starred this message';
COMMENT ON COLUMN public.direct_messages.parent_message_id IS 'Parent message ID for threading (replies)';
