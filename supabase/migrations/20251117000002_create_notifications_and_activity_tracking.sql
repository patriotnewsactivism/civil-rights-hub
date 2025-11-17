-- Create notifications and user activity tracking tables from WTPN
-- Real-time notification system and comprehensive activity logging

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('like', 'comment', 'share', 'follow', 'mention', 'reply', 'message', 'violation_comment', 'thread_reply', 'badge_earned')),
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.direct_messages(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  violation_id UUID REFERENCES public.violations(id) ON DELETE CASCADE,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER ACTIVITY LOG (for contributor stats)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('post', 'comment', 'message', 'violation', 'like', 'share', 'thread', 'forum_post', 'follow')),
  reference_id UUID,
  reference_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_from_user ON public.notifications(from_user_id);

CREATE INDEX idx_user_activity_user ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX idx_user_activity_created ON public.user_activity(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Notifications: Users can only view their own notifications
-- NOTE: Notifications should be created by database triggers or Edge Functions with service role
-- to prevent notification spoofing. Client-side inserts are disabled for security.
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can insert notifications (for triggers/functions)
CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.jwt()->>'role' = 'admin');

-- User Activity: Public read, users can log their own activity
CREATE POLICY "Users can view activity"
  ON public.user_activity FOR SELECT
  USING (true);

CREATE POLICY "Users can log activity"
  ON public.user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Get unread notifications count
CREATE OR REPLACE FUNCTION get_unread_notifications_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.notifications
          WHERE user_id = p_user_id AND is_read = FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.notifications
  SET is_read = TRUE
  WHERE id = p_notification_id AND user_id = p_user_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE public.notifications
  SET is_read = TRUE
  WHERE user_id = p_user_id AND is_read = FALSE;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create notification helper function (secure - for internal use only)
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR,
  p_from_user_id UUID DEFAULT NULL,
  p_post_id UUID DEFAULT NULL,
  p_comment_id UUID DEFAULT NULL,
  p_message_id UUID DEFAULT NULL,
  p_thread_id UUID DEFAULT NULL,
  p_violation_id UUID DEFAULT NULL,
  p_content TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  -- Don't notify users about their own actions
  IF p_user_id = p_from_user_id THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.notifications (
    user_id,
    type,
    from_user_id,
    post_id,
    comment_id,
    message_id,
    thread_id,
    violation_id,
    content
  ) VALUES (
    p_user_id,
    p_type,
    p_from_user_id,
    p_post_id,
    p_comment_id,
    p_message_id,
    p_thread_id,
    p_violation_id,
    p_content
  ) RETURNING id INTO v_notification_id;

  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS FOR AUTO-NOTIFICATIONS
-- =====================================================

-- Notify on post like
CREATE OR REPLACE FUNCTION notify_on_post_like()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id UUID;
BEGIN
  -- Get the post author
  SELECT user_id INTO v_post_author_id FROM public.posts WHERE id = NEW.post_id;

  -- Create notification
  PERFORM create_notification(
    v_post_author_id,
    'like',
    NEW.user_id,
    NEW.post_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_post_like
  AFTER INSERT ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION notify_on_post_like();

-- Notify on post share
CREATE OR REPLACE FUNCTION notify_on_post_share()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id UUID;
BEGIN
  -- Get the post author
  SELECT user_id INTO v_post_author_id FROM public.posts WHERE id = NEW.post_id;

  -- Create notification
  PERFORM create_notification(
    v_post_author_id,
    'share',
    NEW.user_id,
    NEW.post_id,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NEW.share_comment
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_post_share
  AFTER INSERT ON public.post_shares
  FOR EACH ROW EXECUTE FUNCTION notify_on_post_share();

-- Notify on new follower
CREATE OR REPLACE FUNCTION notify_on_new_follower()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification
  PERFORM create_notification(
    NEW.following_id,  -- User being followed gets notified
    'follow',
    NEW.follower_id    -- User who followed
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_new_follower
  AFTER INSERT ON public.user_connections
  FOR EACH ROW EXECUTE FUNCTION notify_on_new_follower();

-- Notify on violation comment
CREATE OR REPLACE FUNCTION notify_on_violation_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_violation_author_id UUID;
BEGIN
  -- Get the violation author
  SELECT user_id INTO v_violation_author_id FROM public.violations WHERE id = NEW.violation_id;

  -- Only notify if the violation has an author
  IF v_violation_author_id IS NOT NULL THEN
    PERFORM create_notification(
      v_violation_author_id,
      'violation_comment',
      NEW.user_id,
      NULL,
      NULL,
      NULL,
      NULL,
      NEW.violation_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_violation_comment
  AFTER INSERT ON public.violation_comments
  FOR EACH ROW EXECUTE FUNCTION notify_on_violation_comment();

-- Notify on forum thread reply
CREATE OR REPLACE FUNCTION notify_on_thread_reply()
RETURNS TRIGGER AS $$
DECLARE
  v_thread_author_id UUID;
BEGIN
  -- Get the thread author
  SELECT user_id INTO v_thread_author_id FROM public.forum_threads WHERE id = NEW.thread_id;

  -- Only notify if the thread has an author and they're not the one replying
  IF v_thread_author_id IS NOT NULL AND v_thread_author_id != NEW.user_id THEN
    PERFORM create_notification(
      v_thread_author_id,
      'thread_reply',
      NEW.user_id,
      NULL,
      NULL,
      NULL,
      NEW.thread_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_thread_reply
  AFTER INSERT ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION notify_on_thread_reply();

-- =====================================================
-- USER ACTIVITY TRACKING TRIGGERS
-- =====================================================

-- Track post creation
CREATE OR REPLACE FUNCTION track_post_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_activity (user_id, activity_type, reference_id, reference_type)
  VALUES (NEW.user_id, 'post', NEW.id, 'post');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_post
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION track_post_activity();

-- Track forum thread creation
CREATE OR REPLACE FUNCTION track_thread_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO public.user_activity (user_id, activity_type, reference_id, reference_type)
    VALUES (NEW.user_id, 'thread', NEW.id, 'forum_thread');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_thread
  AFTER INSERT ON public.forum_threads
  FOR EACH ROW EXECUTE FUNCTION track_thread_activity();

-- Track violation report
CREATE OR REPLACE FUNCTION track_violation_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO public.user_activity (user_id, activity_type, reference_id, reference_type)
    VALUES (NEW.user_id, 'violation', NEW.id, 'violation');

    -- Update violation count
    UPDATE public.user_profiles
    SET violations_count = violations_count + 1
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_violation
  AFTER INSERT ON public.violations
  FOR EACH ROW EXECUTE FUNCTION track_violation_activity();

-- Track direct message sending
CREATE OR REPLACE FUNCTION track_message_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_activity (user_id, activity_type, reference_id, reference_type)
  VALUES (NEW.sender_id, 'message', NEW.id, 'direct_message');

  -- Update message count
  UPDATE public.user_profiles
  SET messages_sent_count = messages_sent_count + 1
  WHERE user_id = NEW.sender_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_message
  AFTER INSERT ON public.direct_messages
  FOR EACH ROW EXECUTE FUNCTION track_message_activity();

-- Track follow activity
CREATE OR REPLACE FUNCTION track_follow_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_activity (user_id, activity_type, reference_id, reference_type)
  VALUES (NEW.follower_id, 'follow', NEW.id, 'user_connection');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_track_follow
  AFTER INSERT ON public.user_connections
  FOR EACH ROW EXECUTE FUNCTION track_follow_activity();
