-- Create user profiles and reputation system

-- User Profiles
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location_state TEXT,
  location_city TEXT,

  -- Privacy settings
  is_public BOOLEAN DEFAULT true,
  show_location BOOLEAN DEFAULT false,
  show_email BOOLEAN DEFAULT false,

  -- Reputation
  reputation_points INTEGER DEFAULT 0,
  helper_score INTEGER DEFAULT 0,

  -- Statistics
  threads_created INTEGER DEFAULT 0,
  posts_created INTEGER DEFAULT 0,
  helpful_answers INTEGER DEFAULT 0,

  -- Social
  website_url TEXT,
  twitter_handle TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Badges
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN (
    'new_member', 'active_member', 'veteran_member',
    'helpful', 'super_helper', 'community_champion',
    'verified_attorney', 'legal_observer', 'organizer',
    'first_post', 'first_thread', '10_threads', '100_posts',
    'popular_thread', 'viral_thread'
  )),
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- User Follows (for following other users)
CREATE TABLE public.user_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Thread Subscriptions (email notifications)
CREATE TABLE public.thread_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, thread_id)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_subscriptions ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.user_profiles FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Badges Policies
CREATE POLICY "Everyone can view badges"
ON public.user_badges FOR SELECT
USING (true);

CREATE POLICY "System can award badges"
ON public.user_badges FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.jwt()->>'role' = 'admin');

-- Follows Policies
CREATE POLICY "Users can view follows"
ON public.user_follows FOR SELECT
USING (true);

CREATE POLICY "Users can follow others"
ON public.user_follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
ON public.user_follows FOR DELETE
USING (auth.uid() = follower_id);

-- Subscriptions Policies
CREATE POLICY "Users can view their subscriptions"
ON public.thread_subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can subscribe to threads"
ON public.thread_subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their subscriptions"
ON public.thread_subscriptions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can unsubscribe"
ON public.thread_subscriptions FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_profiles_user ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_profiles_reputation ON public.user_profiles(reputation_points DESC);
CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX idx_user_follows_follower ON public.user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON public.user_follows(following_id);
CREATE INDEX idx_thread_subscriptions_user ON public.thread_subscriptions(user_id);
CREATE INDEX idx_thread_subscriptions_thread ON public.thread_subscriptions(thread_id);

-- Create updated_at trigger
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );

  -- Award "New Member" badge
  INSERT INTO public.user_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
  VALUES (
    NEW.id,
    'new_member',
    'New Member',
    'Joined the community',
    '🎉'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-profile creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_user_profile();

-- Function to award badges based on activity
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_threads_count INTEGER;
  v_posts_count INTEGER;
  v_helpful_count INTEGER;
BEGIN
  -- Get user stats
  SELECT threads_created, posts_created, helpful_answers
  INTO v_threads_count, v_posts_count, v_helpful_count
  FROM public.user_profiles
  WHERE user_id = p_user_id;

  -- First Thread badge
  IF v_threads_count >= 1 THEN
    INSERT INTO public.user_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (p_user_id, 'first_thread', 'First Thread', 'Created your first discussion', '📝')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;

  -- 10 Threads badge
  IF v_threads_count >= 10 THEN
    INSERT INTO public.user_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (p_user_id, '10_threads', 'Discussion Starter', 'Created 10 discussions', '🔥')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;

  -- 100 Posts badge
  IF v_posts_count >= 100 THEN
    INSERT INTO public.user_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (p_user_id, '100_posts', 'Active Contributor', 'Posted 100 replies', '⭐')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;

  -- Helpful badge
  IF v_helpful_count >= 10 THEN
    INSERT INTO public.user_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (p_user_id, 'helpful', 'Helpful', 'Received 10 helpful votes', '🙌')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;

  -- Super Helper badge
  IF v_helpful_count >= 50 THEN
    INSERT INTO public.user_badges (user_id, badge_type, badge_name, badge_description, badge_icon)
    VALUES (p_user_id, 'super_helper', 'Super Helper', 'Received 50 helpful votes', '🌟')
    ON CONFLICT (user_id, badge_type) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
