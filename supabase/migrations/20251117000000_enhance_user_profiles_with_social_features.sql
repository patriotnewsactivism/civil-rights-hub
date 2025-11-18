-- Enhance user_profiles table with social media features from WTPN
-- This migration adds role system, verification, last seen tracking, and activity counters

-- Add new columns to existing user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'journalist', 'attorney', 'activist', 'moderator', 'admin')),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add activity counter columns (for contributor level calculation)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS violations_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS messages_sent_count INTEGER DEFAULT 0;

-- Note: posts_count already exists as 'posts_created' - we'll use that
-- Note: comments_count already exists as part of the schema
-- Note: threads_created already exists

-- Create index for role filtering
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);

-- Create index for verified users
CREATE INDEX IF NOT EXISTS idx_user_profiles_verified ON public.user_profiles(is_verified) WHERE is_verified = true;

-- Create index for last seen
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_seen ON public.user_profiles(last_seen_at DESC);

-- Function to calculate contributor level based on activity
CREATE OR REPLACE FUNCTION get_contributor_level(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_total_activity INTEGER;
BEGIN
  -- Calculate total activity score
  SELECT
    COALESCE(posts_created, 0) +
    COALESCE(threads_created, 0) +
    COALESCE(helpful_answers, 0) +
    COALESCE(violations_count, 0) +
    COALESCE(messages_sent_count, 0) / 10 -- Messages count less
  INTO v_total_activity
  FROM public.user_profiles
  WHERE user_id = p_user_id;

  -- Return level based on activity thresholds
  IF v_total_activity >= 100 THEN
    RETURN 'Elite Contributor';
  ELSIF v_total_activity >= 50 THEN
    RETURN 'Expert Contributor';
  ELSIF v_total_activity >= 25 THEN
    RETURN 'Active Contributor';
  ELSIF v_total_activity >= 10 THEN
    RETURN 'Regular Contributor';
  ELSE
    RETURN 'New Member';
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get total activity count
CREATE OR REPLACE FUNCTION get_total_activity_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_total INTEGER;
BEGIN
  SELECT
    COALESCE(posts_created, 0) +
    COALESCE(threads_created, 0) +
    COALESCE(helpful_answers, 0) +
    COALESCE(violations_count, 0) +
    COALESCE(messages_sent_count, 0) / 10
  INTO v_total
  FROM public.user_profiles
  WHERE user_id = p_user_id;

  RETURN COALESCE(v_total, 0);
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to update last_seen_at
CREATE OR REPLACE FUNCTION update_user_last_seen(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_profiles
  SET last_seen_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add role badges for existing users with specific roles
-- This will be useful when we migrate the data
COMMENT ON COLUMN public.user_profiles.role IS 'User role: user (default), journalist, attorney, activist, moderator, admin';
COMMENT ON COLUMN public.user_profiles.is_verified IS 'Verified badge for authenticated professionals (attorneys, journalists, etc.)';
COMMENT ON COLUMN public.user_profiles.last_seen_at IS 'Last time the user was active on the platform';
