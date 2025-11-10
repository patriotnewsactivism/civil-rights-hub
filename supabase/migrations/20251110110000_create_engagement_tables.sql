-- Create tables for thread bookmarks, upvotes, tags, and reports

-- Thread Bookmarks
CREATE TABLE public.thread_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, thread_id)
);

-- Thread Upvotes
CREATE TABLE public.thread_upvotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, thread_id)
);

-- Post Upvotes
CREATE TABLE public.post_upvotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Comment Upvotes (for violation comments)
CREATE TABLE public.comment_upvotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.violation_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- Thread Tags
CREATE TABLE public.thread_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Popular Tags (for autocomplete)
CREATE TABLE public.popular_tags (
  tag TEXT NOT NULL PRIMARY KEY,
  use_count INTEGER DEFAULT 1,
  last_used TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Content Reports
CREATE TABLE public.content_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('thread', 'post', 'comment', 'violation')),
  content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.thread_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

-- Bookmarks Policies
CREATE POLICY "Users can view their own bookmarks"
ON public.thread_bookmarks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
ON public.thread_bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their bookmarks"
ON public.thread_bookmarks FOR DELETE
USING (auth.uid() = user_id);

-- Upvotes Policies (threads)
CREATE POLICY "Anyone can view thread upvote counts"
ON public.thread_upvotes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can upvote threads"
ON public.thread_upvotes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their upvotes"
ON public.thread_upvotes FOR DELETE
USING (auth.uid() = user_id);

-- Upvotes Policies (posts)
CREATE POLICY "Anyone can view post upvote counts"
ON public.post_upvotes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can upvote posts"
ON public.post_upvotes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their post upvotes"
ON public.post_upvotes FOR DELETE
USING (auth.uid() = user_id);

-- Upvotes Policies (comments)
CREATE POLICY "Anyone can view comment upvote counts"
ON public.comment_upvotes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can upvote comments"
ON public.comment_upvotes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their comment upvotes"
ON public.comment_upvotes FOR DELETE
USING (auth.uid() = user_id);

-- Tags Policies
CREATE POLICY "Anyone can view tags"
ON public.thread_tags FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can add tags"
ON public.thread_tags FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view popular tags"
ON public.popular_tags FOR SELECT
USING (true);

-- Reports Policies
CREATE POLICY "Users can view their own reports"
ON public.content_reports FOR SELECT
USING (auth.uid() = reporter_id);

CREATE POLICY "Anyone can create reports"
ON public.content_reports FOR INSERT
WITH CHECK (true);

CREATE POLICY "Moderators can view all reports"
ON public.content_reports FOR SELECT
USING (auth.jwt()->>'role' = 'moderator' OR auth.jwt()->>'role' = 'admin');

CREATE POLICY "Moderators can update reports"
ON public.content_reports FOR UPDATE
USING (auth.jwt()->>'role' = 'moderator' OR auth.jwt()->>'role' = 'admin');

-- Create indexes
CREATE INDEX idx_thread_bookmarks_user ON public.thread_bookmarks(user_id);
CREATE INDEX idx_thread_bookmarks_thread ON public.thread_bookmarks(thread_id);
CREATE INDEX idx_thread_upvotes_thread ON public.thread_upvotes(thread_id);
CREATE INDEX idx_post_upvotes_post ON public.post_upvotes(post_id);
CREATE INDEX idx_comment_upvotes_comment ON public.comment_upvotes(comment_id);
CREATE INDEX idx_thread_tags_thread ON public.thread_tags(thread_id);
CREATE INDEX idx_thread_tags_tag ON public.thread_tags(tag);
CREATE INDEX idx_popular_tags_count ON public.popular_tags(use_count DESC);
CREATE INDEX idx_content_reports_status ON public.content_reports(status);
CREATE INDEX idx_content_reports_type ON public.content_reports(content_type, content_id);

-- Function to update thread upvote count
CREATE OR REPLACE FUNCTION update_thread_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_threads
    SET like_count = like_count + 1
    WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_threads
    SET like_count = like_count - 1
    WHERE id = OLD.thread_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add like_count to forum_threads if not exists
ALTER TABLE public.forum_threads ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE public.forum_posts ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Create trigger for thread upvotes
CREATE TRIGGER update_thread_upvotes_trigger
AFTER INSERT OR DELETE ON public.thread_upvotes
FOR EACH ROW
EXECUTE FUNCTION update_thread_upvote_count();

-- Function to increment popular tag count
CREATE OR REPLACE FUNCTION increment_tag_count()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.popular_tags (tag, use_count, last_used)
  VALUES (NEW.tag, 1, NOW())
  ON CONFLICT (tag)
  DO UPDATE SET
    use_count = popular_tags.use_count + 1,
    last_used = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER increment_tag_trigger
AFTER INSERT ON public.thread_tags
FOR EACH ROW
EXECUTE FUNCTION increment_tag_count();
