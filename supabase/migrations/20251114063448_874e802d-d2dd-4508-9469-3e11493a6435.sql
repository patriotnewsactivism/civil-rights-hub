-- Community Features Migration
-- This creates all tables for forum, messaging, events, and resources

-- Forum Threads
CREATE TABLE IF NOT EXISTS public.forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- 'general', 'legal', 'organizing', 'resources'
  is_pinned BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  last_post_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Thread Upvotes
CREATE TABLE IF NOT EXISTS public.thread_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(thread_id, user_id)
);

-- Thread Bookmarks
CREATE TABLE IF NOT EXISTS public.thread_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(thread_id, user_id)
);

-- Thread Subscriptions
CREATE TABLE IF NOT EXISTS public.thread_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(thread_id, user_id)
);

-- Thread Tags
CREATE TABLE IF NOT EXISTS public.thread_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content Reports
CREATE TABLE IF NOT EXISTS public.content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL, -- 'thread', 'post', 'comment'
  content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'actioned', 'dismissed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Community Events
CREATE TABLE IF NOT EXISTS public.community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'protest', 'rally', 'workshop', 'training', 'meeting', 'court_watch', 'other'
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  is_virtual BOOLEAN DEFAULT false,
  virtual_link TEXT,
  location_name TEXT,
  city TEXT,
  state TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Event RSVPs
CREATE TABLE IF NOT EXISTS public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.community_events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'going', -- 'going', 'interested', 'not_going'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Resource Library
CREATE TABLE IF NOT EXISTS public.resource_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- 'article', 'video', 'document', 'guide', 'template', 'tool'
  url TEXT NOT NULL,
  category TEXT[], -- array of categories
  avg_rating DECIMAL(2,1),
  total_ratings INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Resource Ratings
CREATE TABLE IF NOT EXISTS public.resource_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resource_library(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(resource_id, user_id)
);

-- Success Stories
CREATE TABLE IF NOT EXISTS public.success_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  outcome TEXT,
  state TEXT,
  case_type TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forum_threads
CREATE POLICY "Anyone can view non-deleted threads"
  ON public.forum_threads FOR SELECT
  USING (is_deleted = false);

CREATE POLICY "Authenticated users can create threads"
  ON public.forum_threads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads"
  ON public.forum_threads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own threads"
  ON public.forum_threads FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for thread_upvotes
CREATE POLICY "Anyone can view upvotes"
  ON public.thread_upvotes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upvote"
  ON public.thread_upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their upvotes"
  ON public.thread_upvotes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for thread_bookmarks
CREATE POLICY "Users can view their bookmarks"
  ON public.thread_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can bookmark threads"
  ON public.thread_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove bookmarks"
  ON public.thread_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for thread_subscriptions
CREATE POLICY "Users can view their subscriptions"
  ON public.thread_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can subscribe to threads"
  ON public.thread_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsubscribe"
  ON public.thread_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for thread_tags
CREATE POLICY "Anyone can view tags"
  ON public.thread_tags FOR SELECT
  USING (true);

CREATE POLICY "Thread owners can add tags"
  ON public.thread_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forum_threads
      WHERE id = thread_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for content_reports
CREATE POLICY "Users can view their own reports"
  ON public.content_reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Authenticated users can report content"
  ON public.content_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- RLS Policies for community_events
CREATE POLICY "Anyone can view published events"
  ON public.community_events FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can create events"
  ON public.community_events FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their events"
  ON public.community_events FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their events"
  ON public.community_events FOR DELETE
  USING (auth.uid() = organizer_id);

-- RLS Policies for event_rsvps
CREATE POLICY "Anyone can view RSVPs"
  ON public.event_rsvps FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can RSVP"
  ON public.event_rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their RSVPs"
  ON public.event_rsvps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their RSVPs"
  ON public.event_rsvps FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for resource_library
CREATE POLICY "Anyone can view resources"
  ON public.resource_library FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can submit resources"
  ON public.resource_library FOR INSERT
  WITH CHECK (auth.uid() = submitter_id);

-- RLS Policies for resource_ratings
CREATE POLICY "Anyone can view ratings"
  ON public.resource_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate resources"
  ON public.resource_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their ratings"
  ON public.resource_ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for success_stories
CREATE POLICY "Anyone can view verified stories"
  ON public.success_stories FOR SELECT
  USING (is_verified = true OR auth.uid() = submitter_id);

CREATE POLICY "Authenticated users can submit stories"
  ON public.success_stories FOR INSERT
  WITH CHECK (auth.uid() = submitter_id);

-- Create indexes for performance
CREATE INDEX idx_forum_threads_user ON public.forum_threads(user_id);
CREATE INDEX idx_forum_threads_category ON public.forum_threads(category);
CREATE INDEX idx_forum_threads_created ON public.forum_threads(created_at DESC);
CREATE INDEX idx_thread_upvotes_thread ON public.thread_upvotes(thread_id);
CREATE INDEX idx_thread_bookmarks_user ON public.thread_bookmarks(user_id);
CREATE INDEX idx_community_events_dates ON public.community_events(start_date);
CREATE INDEX idx_community_events_state ON public.community_events(state);
CREATE INDEX idx_resource_library_type ON public.resource_library(resource_type);

-- Add updated_at triggers
CREATE TRIGGER update_forum_threads_updated_at
  BEFORE UPDATE ON public.forum_threads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_events_updated_at
  BEFORE UPDATE ON public.community_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resource_library_updated_at
  BEFORE UPDATE ON public.resource_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_success_stories_updated_at
  BEFORE UPDATE ON public.success_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();