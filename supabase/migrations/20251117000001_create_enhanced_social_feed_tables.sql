-- Create enhanced social feed tables from WTPN
-- Posts with hashtags, mentions, sharing, and visibility controls

-- =====================================================
-- POSTS TABLE (Enhanced Social Feed)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_type VARCHAR(20) DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'link', 'article', 'violation')),
  content TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  link_title TEXT,
  hashtags TEXT[],
  mentioned_users UUID[],
  reference_type VARCHAR(50),  -- 'violation', 'news', 'case', 'legislation', 'thread'
  reference_id VARCHAR(255),
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- POST LIKES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, post_id)
);

-- =====================================================
-- POST SHARES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.post_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  share_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER CONNECTIONS TABLE (Follower/Following system)
-- =====================================================
-- Note: This is similar to user_follows but with different naming convention
-- We'll keep both for compatibility but may consolidate later
CREATE TABLE IF NOT EXISTS public.user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate follows and self-following
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_following CHECK (follower_id != following_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_posts_user ON public.posts(user_id);
CREATE INDEX idx_posts_created ON public.posts(created_at DESC);
CREATE INDEX idx_posts_hashtags ON public.posts USING GIN(hashtags);
CREATE INDEX idx_posts_type ON public.posts(post_type);
CREATE INDEX idx_posts_visibility ON public.posts(visibility);
CREATE INDEX idx_posts_reference ON public.posts(reference_type, reference_id);

CREATE INDEX idx_post_likes_post ON public.post_likes(post_id);
CREATE INDEX idx_post_likes_user ON public.post_likes(user_id);

CREATE INDEX idx_post_shares_post ON public.post_shares(post_id);
CREATE INDEX idx_post_shares_user ON public.post_shares(user_id);

CREATE INDEX idx_user_connections_follower ON public.user_connections(follower_id);
CREATE INDEX idx_user_connections_following ON public.user_connections(following_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;

-- Posts: Public posts viewable by all, private posts only by author and followers
CREATE POLICY "Public posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (
    visibility = 'public'
    OR auth.uid() = user_id
    OR (visibility = 'followers' AND auth.uid() IN (
      SELECT follower_id FROM public.user_connections WHERE following_id = user_id
    ))
  );

CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Post Likes
CREATE POLICY "Everyone can view post likes"
  ON public.post_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Post Shares
CREATE POLICY "Everyone can view shares"
  ON public.post_shares FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can share posts"
  ON public.post_shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Connections
CREATE POLICY "Connections are viewable by everyone"
  ON public.user_connections FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON public.user_connections FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.user_connections FOR DELETE
  USING (auth.uid() = follower_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamp on posts
CREATE TRIGGER update_posts_timestamp
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Increment likes count
CREATE OR REPLACE FUNCTION increment_post_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_likes_trigger
  AFTER INSERT ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION increment_post_likes();

-- Decrement likes count
CREATE OR REPLACE FUNCTION decrement_post_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_likes_trigger
  AFTER DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION decrement_post_likes();

-- Increment shares count
CREATE OR REPLACE FUNCTION increment_post_shares()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.posts SET shares_count = shares_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_shares_trigger
  AFTER INSERT ON public.post_shares
  FOR EACH ROW EXECUTE FUNCTION increment_post_shares();

-- Update user post count
CREATE OR REPLACE FUNCTION update_user_post_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_profiles
    SET posts_created = posts_created + 1
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_count_trigger
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_user_post_count();

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Get feed posts (including followed users)
CREATE OR REPLACE FUNCTION get_feed_posts(p_user_id UUID, limit_count INTEGER DEFAULT 20, offset_count INTEGER DEFAULT 0)
RETURNS TABLE (
  post_id UUID,
  user_id UUID,
  post_type VARCHAR,
  content TEXT,
  image_url TEXT,
  hashtags TEXT[],
  likes_count INTEGER,
  shares_count INTEGER,
  comments_count INTEGER,
  visibility VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.user_id,
    p.post_type,
    p.content,
    p.image_url,
    p.hashtags,
    p.likes_count,
    p.shares_count,
    p.comments_count,
    p.visibility,
    p.created_at
  FROM public.posts p
  WHERE p.visibility = 'public'
    OR p.user_id = p_user_id
    OR (p.visibility = 'followers' AND p.user_id IN (
      SELECT following_id FROM public.user_connections WHERE follower_id = p_user_id
    ))
  ORDER BY p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get trending hashtags (last 7 days)
CREATE OR REPLACE FUNCTION get_trending_hashtags(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  hashtag TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT unnest(p.hashtags) as hashtag, COUNT(*) as count
  FROM public.posts p
  WHERE p.created_at > NOW() - INTERVAL '7 days'
    AND p.hashtags IS NOT NULL
  GROUP BY hashtag
  ORDER BY count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Get user's follower count
CREATE OR REPLACE FUNCTION get_follower_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.user_connections WHERE following_id = p_user_id);
END;
$$ LANGUAGE plpgsql STABLE;

-- Get user's following count
CREATE OR REPLACE FUNCTION get_following_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.user_connections WHERE follower_id = p_user_id);
END;
$$ LANGUAGE plpgsql STABLE;

-- Check if user is following another user
CREATE OR REPLACE FUNCTION is_following(p_follower_id UUID, p_following_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.user_connections
    WHERE follower_id = p_follower_id AND following_id = p_following_id
  );
END;
$$ LANGUAGE plpgsql STABLE;
