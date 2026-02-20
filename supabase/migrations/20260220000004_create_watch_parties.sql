-- Create watch parties and video posts tables
-- Enables collaborative video watching with live chat and attendance tracking

-- =====================================================
-- VIDEO_POSTS TABLE (Extension for video content)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.video_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  video_type TEXT NOT NULL CHECK (video_type IN ('upload', 'youtube', 'vimeo', 'stream')),
  video_id TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  live_status TEXT CHECK (live_status IN ('scheduled', 'live', 'ended')),
  scheduled_start TIMESTAMP WITH TIME ZONE,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  viewer_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WATCH_PARTIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.watch_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_post_id UUID REFERENCES public.video_posts(id) ON DELETE SET NULL,
  external_video_url TEXT,
  external_video_type TEXT CHECK (external_video_type IN ('youtube', 'vimeo', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_live BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
  max_attendees INTEGER,
  attendee_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{"chat_enabled": true, "reactions_enabled": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WATCH_PARTY_ATTENDEES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.watch_party_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watch_party_id UUID NOT NULL REFERENCES public.watch_parties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  is_host BOOLEAN DEFAULT FALSE,

  UNIQUE(watch_party_id, user_id)
);

-- =====================================================
-- WATCH_PARTY_CHAT TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.watch_party_chat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watch_party_id UUID NOT NULL REFERENCES public.watch_parties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'reaction', 'system')),
  reaction_type TEXT,
  video_timestamp DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WATCH_PARTY_INVITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.watch_party_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watch_party_id UUID NOT NULL REFERENCES public.watch_parties(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_video_posts_post ON public.video_posts(post_id);
CREATE INDEX idx_video_posts_video_type ON public.video_posts(video_type);
CREATE INDEX idx_video_posts_live ON public.video_posts(is_live) WHERE is_live = TRUE;

CREATE INDEX idx_watch_parties_scheduled ON public.watch_parties(scheduled_time);
CREATE INDEX idx_watch_parties_host ON public.watch_parties(host_user_id);
CREATE INDEX idx_watch_parties_status ON public.watch_parties(status);
CREATE INDEX idx_watch_parties_public ON public.watch_parties(is_public) WHERE is_public = TRUE;

CREATE INDEX idx_watch_party_attendees_party ON public.watch_party_attendees(watch_party_id);
CREATE INDEX idx_watch_party_attendees_user ON public.watch_party_attendees(user_id);

CREATE INDEX idx_watch_party_chat_party ON public.watch_party_chat(watch_party_id);
CREATE INDEX idx_watch_party_chat_created ON public.watch_party_chat(watch_party_id, created_at);

CREATE INDEX idx_watch_party_invites_party ON public.watch_party_invites(watch_party_id);
CREATE INDEX idx_watch_party_invites_user ON public.watch_party_invites(invited_user_id);
CREATE INDEX idx_watch_party_invites_status ON public.watch_party_invites(status);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.video_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_party_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_party_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_party_invites ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VIDEO_POSTS POLICIES
-- =====================================================
CREATE POLICY "Video posts are viewable based on post visibility"
  ON public.video_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.posts p
      WHERE p.id = video_posts.post_id
      AND (
        p.visibility = 'public'
        OR p.user_id = auth.uid()
        OR (p.visibility = 'followers' AND auth.uid() IN (
          SELECT follower_id FROM public.user_connections WHERE following_id = p.user_id
        ))
      )
    )
  );

CREATE POLICY "Users can create video posts for their own posts"
  ON public.video_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.posts WHERE id = video_posts.post_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their video posts"
  ON public.video_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.posts WHERE id = video_posts.post_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their video posts"
  ON public.video_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.posts WHERE id = video_posts.post_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- WATCH_PARTIES POLICIES
-- =====================================================
CREATE POLICY "Public watch parties are viewable by everyone"
  ON public.watch_parties FOR SELECT
  USING (
    is_public = TRUE
    OR host_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.watch_party_invites
      WHERE watch_party_id = watch_parties.id
      AND invited_user_id = auth.uid()
      AND status = 'accepted'
    )
    OR EXISTS (
      SELECT 1 FROM public.watch_party_attendees
      WHERE watch_party_id = watch_parties.id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create watch parties"
  ON public.watch_parties FOR INSERT
  WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Hosts can update their watch parties"
  ON public.watch_parties FOR UPDATE
  USING (auth.uid() = host_user_id);

CREATE POLICY "Hosts can delete their watch parties"
  ON public.watch_parties FOR DELETE
  USING (auth.uid() = host_user_id);

-- =====================================================
-- WATCH_PARTY_ATTENDEES POLICIES
-- =====================================================
CREATE POLICY "Attendees visible to party participants"
  ON public.watch_party_attendees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.watch_parties wp
      WHERE wp.id = watch_party_attendees.watch_party_id
      AND (
        wp.is_public = TRUE
        OR wp.host_user_id = auth.uid()
        OR user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.watch_party_attendees wpa
          WHERE wpa.watch_party_id = watch_party_attendees.watch_party_id
          AND wpa.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can join public watch parties"
  ON public.watch_party_attendees FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      EXISTS (
        SELECT 1 FROM public.watch_parties
        WHERE id = watch_party_attendees.watch_party_id
        AND (is_public = TRUE OR host_user_id = auth.uid() OR EXISTS (
          SELECT 1 FROM public.watch_party_invites
          WHERE watch_party_id = watch_party_attendees.watch_party_id
          AND invited_user_id = auth.uid()
          AND status = 'accepted'
        ))
      )
    )
  );

CREATE POLICY "Users can update their own attendance"
  ON public.watch_party_attendees FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can leave watch parties"
  ON public.watch_party_attendees FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- WATCH_PARTY_CHAT POLICIES
-- =====================================================
CREATE POLICY "Chat messages visible to party participants"
  ON public.watch_party_chat FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.watch_parties wp
      WHERE wp.id = watch_party_chat.watch_party_id
      AND (
        wp.is_public = TRUE
        OR wp.host_user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.watch_party_attendees
          WHERE watch_party_id = watch_party_chat.watch_party_id
          AND user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Attendees can send chat messages"
  ON public.watch_party_chat FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      EXISTS (
        SELECT 1 FROM public.watch_party_attendees
        WHERE watch_party_id = watch_party_chat.watch_party_id
        AND user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM public.watch_parties
        WHERE id = watch_party_chat.watch_party_id
        AND host_user_id = auth.uid()
      )
    )
    AND (
      SELECT settings->>'chat_enabled' FROM public.watch_parties
      WHERE id = watch_party_chat.watch_party_id
    )::boolean = TRUE
  );

CREATE POLICY "Users can delete their own chat messages"
  ON public.watch_party_chat FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- WATCH_PARTY_INVITES POLICIES
-- =====================================================
CREATE POLICY "Users can view their own invites"
  ON public.watch_party_invites FOR SELECT
  USING (
    auth.uid() = invited_user_id
    OR auth.uid() = invited_by
    OR EXISTS (
      SELECT 1 FROM public.watch_parties
      WHERE id = watch_party_invites.watch_party_id
      AND host_user_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can create invites"
  ON public.watch_party_invites FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.watch_parties
      WHERE id = watch_party_invites.watch_party_id
      AND host_user_id = auth.uid()
    )
    AND auth.uid() = invited_by
  );

CREATE POLICY "Invited users can update invite status"
  ON public.watch_party_invites FOR UPDATE
  USING (auth.uid() = invited_user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamp on watch_parties
CREATE TRIGGER update_watch_parties_timestamp
  BEFORE UPDATE ON public.watch_parties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update attendee_count
CREATE OR REPLACE FUNCTION update_watch_party_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.watch_parties
    SET attendee_count = attendee_count + 1
    WHERE id = NEW.watch_party_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.watch_parties
    SET attendee_count = GREATEST(attendee_count - 1, 0)
    WHERE id = OLD.watch_party_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_attendee_count_trigger
  AFTER INSERT ON public.watch_party_attendees
  FOR EACH ROW EXECUTE FUNCTION update_watch_party_attendee_count();

CREATE TRIGGER decrement_attendee_count_trigger
  AFTER DELETE ON public.watch_party_attendees
  FOR EACH ROW EXECUTE FUNCTION update_watch_party_attendee_count();

-- Auto-add host as attendee with is_host = true
CREATE OR REPLACE FUNCTION add_host_as_attendee()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.watch_party_attendees (watch_party_id, user_id, is_host)
  VALUES (NEW.id, NEW.host_user_id, TRUE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_host_attendee_trigger
  AFTER INSERT ON public.watch_parties
  FOR EACH ROW EXECUTE FUNCTION add_host_as_attendee();

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Get upcoming public watch parties
CREATE OR REPLACE FUNCTION get_upcoming_watch_parties(limit_count INTEGER DEFAULT 20, offset_count INTEGER DEFAULT 0)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  scheduled_time TIMESTAMP WITH TIME ZONE,
  host_user_id UUID,
  attendee_count INTEGER,
  max_attendees INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wp.id,
    wp.title,
    wp.description,
    wp.scheduled_time,
    wp.host_user_id,
    wp.attendee_count,
    wp.max_attendees,
    wp.status
  FROM public.watch_parties wp
  WHERE wp.is_public = TRUE
    AND wp.status IN ('scheduled', 'live')
    AND wp.scheduled_time >= NOW() - INTERVAL '1 hour'
  ORDER BY wp.scheduled_time ASC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get live watch parties
CREATE OR REPLACE FUNCTION get_live_watch_parties(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  host_user_id UUID,
  attendee_count INTEGER,
  video_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    wp.id,
    wp.title,
    wp.description,
    wp.host_user_id,
    wp.attendee_count,
    COALESCE(vp.video_url, wp.external_video_url) as video_url
  FROM public.watch_parties wp
  LEFT JOIN public.video_posts vp ON vp.id = wp.video_post_id
  WHERE wp.is_public = TRUE
    AND wp.status = 'live'
    AND wp.is_live = TRUE
  ORDER BY wp.attendee_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Check if user can join a watch party
CREATE OR REPLACE FUNCTION can_join_watch_party(p_watch_party_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  wp_record RECORD;
  attendee_count INTEGER;
BEGIN
  SELECT * INTO wp_record
  FROM public.watch_parties WHERE id = p_watch_party_id;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Check if party is full
  IF wp_record.max_attendees IS NOT NULL AND wp_record.attendee_count >= wp_record.max_attendees THEN
    RETURN FALSE;
  END IF;

  -- Check access: public or invited
  IF wp_record.is_public THEN
    RETURN TRUE;
  END IF;

  -- Check if invited and accepted
  RETURN EXISTS (
    SELECT 1 FROM public.watch_party_invites
    WHERE watch_party_id = p_watch_party_id
    AND invited_user_id = p_user_id
    AND status = 'accepted'
  );
END;
$$ LANGUAGE plpgsql STABLE;
