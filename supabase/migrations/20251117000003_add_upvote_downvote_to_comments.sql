-- Add upvote/downvote functionality to violation_comments and forum_posts
-- This enhances the existing comment system with voting capabilities from WTPN

-- =====================================================
-- ENHANCE VIOLATION_COMMENTS TABLE
-- =====================================================

-- Add upvote/downvote columns to violation_comments
ALTER TABLE public.violation_comments
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- =====================================================
-- ENHANCE FORUM_POSTS TABLE
-- =====================================================

-- Add upvote/downvote columns to forum_posts (they only have like_count currently)
ALTER TABLE public.forum_posts
ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0;

-- =====================================================
-- CREATE VOTING TABLES
-- =====================================================

-- Violation comment votes
CREATE TABLE IF NOT EXISTS public.violation_comment_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.violation_comments(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one vote per user per comment
  UNIQUE(user_id, comment_id)
);

-- Forum post votes
CREATE TABLE IF NOT EXISTS public.forum_post_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one vote per user per post
  UNIQUE(user_id, post_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_violation_comment_votes_comment ON public.violation_comment_votes(comment_id);
CREATE INDEX idx_violation_comment_votes_user ON public.violation_comment_votes(user_id);

CREATE INDEX idx_forum_post_votes_post ON public.forum_post_votes(post_id);
CREATE INDEX idx_forum_post_votes_user ON public.forum_post_votes(user_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.violation_comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_post_votes ENABLE ROW LEVEL SECURITY;

-- Violation Comment Votes
CREATE POLICY "Everyone can view votes"
  ON public.violation_comment_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.violation_comment_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their votes"
  ON public.violation_comment_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their votes"
  ON public.violation_comment_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Forum Post Votes
CREATE POLICY "Everyone can view forum post votes"
  ON public.forum_post_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote on forum posts"
  ON public.forum_post_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their forum post votes"
  ON public.forum_post_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their forum post votes"
  ON public.forum_post_votes FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS FOR VOTE COUNTING
-- =====================================================

-- Violation comment upvote increment
CREATE OR REPLACE FUNCTION increment_violation_comment_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vote_type = 'upvote' THEN
    UPDATE public.violation_comments
    SET upvotes = upvotes + 1
    WHERE id = NEW.comment_id;
  ELSIF NEW.vote_type = 'downvote' THEN
    UPDATE public.violation_comments
    SET downvotes = downvotes + 1
    WHERE id = NEW.comment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_violation_comment_votes
  AFTER INSERT ON public.violation_comment_votes
  FOR EACH ROW EXECUTE FUNCTION increment_violation_comment_upvotes();

-- Violation comment vote decrement (when deleted)
CREATE OR REPLACE FUNCTION decrement_violation_comment_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.vote_type = 'upvote' THEN
    UPDATE public.violation_comments
    SET upvotes = upvotes - 1
    WHERE id = OLD.comment_id;
  ELSIF OLD.vote_type = 'downvote' THEN
    UPDATE public.violation_comments
    SET downvotes = downvotes - 1
    WHERE id = OLD.comment_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_violation_comment_votes
  AFTER DELETE ON public.violation_comment_votes
  FOR EACH ROW EXECUTE FUNCTION decrement_violation_comment_votes();

-- Violation comment vote update (when changed)
CREATE OR REPLACE FUNCTION update_violation_comment_votes()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrement old vote type
  IF OLD.vote_type = 'upvote' THEN
    UPDATE public.violation_comments
    SET upvotes = upvotes - 1
    WHERE id = OLD.comment_id;
  ELSIF OLD.vote_type = 'downvote' THEN
    UPDATE public.violation_comments
    SET downvotes = downvotes - 1
    WHERE id = OLD.comment_id;
  END IF;

  -- Increment new vote type
  IF NEW.vote_type = 'upvote' THEN
    UPDATE public.violation_comments
    SET upvotes = upvotes + 1
    WHERE id = NEW.comment_id;
  ELSIF NEW.vote_type = 'downvote' THEN
    UPDATE public.violation_comments
    SET downvotes = downvotes + 1
    WHERE id = NEW.comment_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_violation_comment_votes
  AFTER UPDATE ON public.violation_comment_votes
  FOR EACH ROW EXECUTE FUNCTION update_violation_comment_votes();

-- Forum post vote increment
CREATE OR REPLACE FUNCTION increment_forum_post_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.vote_type = 'upvote' THEN
    UPDATE public.forum_posts
    SET upvotes = upvotes + 1, like_count = like_count + 1
    WHERE id = NEW.post_id;
  ELSIF NEW.vote_type = 'downvote' THEN
    UPDATE public.forum_posts
    SET downvotes = downvotes + 1
    WHERE id = NEW.post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_forum_post_votes
  AFTER INSERT ON public.forum_post_votes
  FOR EACH ROW EXECUTE FUNCTION increment_forum_post_upvotes();

-- Forum post vote decrement
CREATE OR REPLACE FUNCTION decrement_forum_post_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.vote_type = 'upvote' THEN
    UPDATE public.forum_posts
    SET upvotes = upvotes - 1, like_count = like_count - 1
    WHERE id = OLD.post_id;
  ELSIF OLD.vote_type = 'downvote' THEN
    UPDATE public.forum_posts
    SET downvotes = downvotes - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_forum_post_votes
  AFTER DELETE ON public.forum_post_votes
  FOR EACH ROW EXECUTE FUNCTION decrement_forum_post_votes();

-- Forum post vote update
CREATE OR REPLACE FUNCTION update_forum_post_votes()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrement old vote type
  IF OLD.vote_type = 'upvote' THEN
    UPDATE public.forum_posts
    SET upvotes = upvotes - 1, like_count = like_count - 1
    WHERE id = OLD.post_id;
  ELSIF OLD.vote_type = 'downvote' THEN
    UPDATE public.forum_posts
    SET downvotes = downvotes - 1
    WHERE id = OLD.post_id;
  END IF;

  -- Increment new vote type
  IF NEW.vote_type = 'upvote' THEN
    UPDATE public.forum_posts
    SET upvotes = upvotes + 1, like_count = like_count + 1
    WHERE id = NEW.post_id;
  ELSIF NEW.vote_type = 'downvote' THEN
    UPDATE public.forum_posts
    SET downvotes = downvotes + 1
    WHERE id = NEW.post_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_forum_post_votes
  AFTER UPDATE ON public.forum_post_votes
  FOR EACH ROW EXECUTE FUNCTION update_forum_post_votes();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get user's vote on a violation comment
CREATE OR REPLACE FUNCTION get_user_violation_comment_vote(p_user_id UUID, p_comment_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  v_vote_type VARCHAR;
BEGIN
  SELECT vote_type INTO v_vote_type
  FROM public.violation_comment_votes
  WHERE user_id = p_user_id AND comment_id = p_comment_id;

  RETURN v_vote_type;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get user's vote on a forum post
CREATE OR REPLACE FUNCTION get_user_forum_post_vote(p_user_id UUID, p_post_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  v_vote_type VARCHAR;
BEGIN
  SELECT vote_type INTO v_vote_type
  FROM public.forum_post_votes
  WHERE user_id = p_user_id AND post_id = p_post_id;

  RETURN v_vote_type;
END;
$$ LANGUAGE plpgsql STABLE;
