-- Create forum_threads table for community discussions
CREATE TABLE public.forum_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  username TEXT, -- Display name (nullable for anonymous)

  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., "General Discussion", "Legal Questions", "Know Your Rights", "Organizing"

  -- Engagement
  view_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  last_post_at TIMESTAMP WITH TIME ZONE,

  -- Moderation
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forum_posts table for thread replies
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  username TEXT, -- Display name (nullable for anonymous)
  parent_post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE, -- For nested replies

  content TEXT NOT NULL,

  -- Engagement
  like_count INTEGER DEFAULT 0,

  -- Moderation
  is_deleted BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create violation_comments table for comments on violation reports
CREATE TABLE public.violation_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  violation_id UUID NOT NULL REFERENCES public.violations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  username TEXT, -- Display name (nullable for anonymous)

  content TEXT NOT NULL,

  -- Engagement
  like_count INTEGER DEFAULT 0,

  -- Moderation
  is_deleted BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all forum tables
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violation_comments ENABLE ROW LEVEL SECURITY;

-- Forum Threads Policies
CREATE POLICY "Anyone can view threads"
ON public.forum_threads
FOR SELECT
USING (NOT is_deleted);

CREATE POLICY "Authenticated users can create threads"
ON public.forum_threads
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL OR auth.uid() IS NULL); -- Allow both auth and anonymous

CREATE POLICY "Users can update their own threads"
ON public.forum_threads
FOR UPDATE
USING (auth.uid() = user_id);

-- Forum Posts Policies
CREATE POLICY "Anyone can view posts"
ON public.forum_posts
FOR SELECT
USING (NOT is_deleted);

CREATE POLICY "Authenticated users can create posts"
ON public.forum_posts
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL OR auth.uid() IS NULL); -- Allow both auth and anonymous

CREATE POLICY "Users can update their own posts"
ON public.forum_posts
FOR UPDATE
USING (auth.uid() = user_id);

-- Violation Comments Policies
CREATE POLICY "Anyone can view violation comments"
ON public.violation_comments
FOR SELECT
USING (NOT is_deleted);

CREATE POLICY "Anyone can create comments"
ON public.violation_comments
FOR INSERT
WITH CHECK (true); -- Anonymous commenting allowed

CREATE POLICY "Users can update their own comments"
ON public.violation_comments
FOR UPDATE
USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER update_forum_threads_updated_at
BEFORE UPDATE ON public.forum_threads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
BEFORE UPDATE ON public.forum_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_violation_comments_updated_at
BEFORE UPDATE ON public.violation_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for forum_threads
CREATE INDEX idx_forum_threads_category ON public.forum_threads(category);
CREATE INDEX idx_forum_threads_created ON public.forum_threads(created_at DESC);
CREATE INDEX idx_forum_threads_last_post ON public.forum_threads(last_post_at DESC NULLS LAST);
CREATE INDEX idx_forum_threads_pinned ON public.forum_threads(is_pinned) WHERE is_pinned = true;
CREATE INDEX idx_forum_threads_user ON public.forum_threads(user_id);

-- Create indexes for forum_posts
CREATE INDEX idx_forum_posts_thread ON public.forum_posts(thread_id, created_at);
CREATE INDEX idx_forum_posts_user ON public.forum_posts(user_id);
CREATE INDEX idx_forum_posts_parent ON public.forum_posts(parent_post_id);

-- Create indexes for violation_comments
CREATE INDEX idx_violation_comments_violation ON public.violation_comments(violation_id, created_at);
CREATE INDEX idx_violation_comments_user ON public.violation_comments(user_id);

-- Create full text search for threads
CREATE INDEX idx_forum_threads_search ON public.forum_threads USING GIN(
  to_tsvector('english', title || ' ' || content)
);

-- Create full text search for posts
CREATE INDEX idx_forum_posts_search ON public.forum_posts USING GIN(
  to_tsvector('english', content)
);

-- Function to update thread post count and last_post_at
CREATE OR REPLACE FUNCTION update_thread_post_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_threads
    SET
      post_count = post_count + 1,
      last_post_at = NEW.created_at
    WHERE id = NEW.thread_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_thread_stats_on_post
AFTER INSERT ON public.forum_posts
FOR EACH ROW
EXECUTE FUNCTION update_thread_post_stats();
