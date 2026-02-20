-- Create gamification features: verification, achievements, and reputation system

-- =====================================================
-- USER VERIFICATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('journalist', 'attorney', 'activist', 'organization', 'official')),
  badge_type TEXT NOT NULL CHECK (badge_type IN ('verified', 'trusted', 'expert')),
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verification_document_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

-- =====================================================
-- ACHIEVEMENT DEFINITIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('engagement', 'contribution', 'streak', 'special')),
  points INTEGER NOT NULL DEFAULT 0,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('count', 'streak', 'special')),
  requirement_value JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress JSONB,

  UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- USER REPUTATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_reputation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_posts INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_reactions_received INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

-- =====================================================
-- REPUTATION EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reputation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('post_created', 'comment_created', 'reaction_received', 'achievement_earned', 'daily_login', 'share')),
  points INTEGER NOT NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_user_verification_user ON public.user_verification(user_id);
CREATE INDEX idx_user_verification_type ON public.user_verification(verification_type);
CREATE INDEX idx_user_verification_active ON public.user_verification(is_active);

CREATE INDEX idx_achievement_definitions_name ON public.achievement_definitions(name);
CREATE INDEX idx_achievement_definitions_category ON public.achievement_definitions(category);
CREATE INDEX idx_achievement_definitions_active ON public.achievement_definitions(is_active);

CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON public.user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_earned_at ON public.user_achievements(earned_at DESC);

CREATE INDEX idx_user_reputation_user ON public.user_reputation(user_id);
CREATE INDEX idx_user_reputation_points ON public.user_reputation(points DESC);
CREATE INDEX idx_user_reputation_level ON public.user_reputation(level);

CREATE INDEX idx_reputation_events_user ON public.reputation_events(user_id);
CREATE INDEX idx_reputation_events_type ON public.reputation_events(event_type);
CREATE INDEX idx_reputation_events_created ON public.reputation_events(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.user_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reputation_events ENABLE ROW LEVEL SECURITY;

-- User Verification Policies
CREATE POLICY "User verifications are viewable by everyone"
  ON public.user_verification FOR SELECT
  USING (true);

CREATE POLICY "Users can view own verification"
  ON public.user_verification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only service role can insert verifications"
  ON public.user_verification FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() = user_id);

CREATE POLICY "Only service role can update verifications"
  ON public.user_verification FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Achievement Definitions Policies
CREATE POLICY "Achievement definitions are viewable by everyone"
  ON public.achievement_definitions FOR SELECT
  USING (true);

CREATE POLICY "Only service role can manage achievement definitions"
  ON public.achievement_definitions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- User Achievements Policies
CREATE POLICY "User achievements are viewable by everyone"
  ON public.user_achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only service role can insert achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() = user_id);

-- User Reputation Policies
CREATE POLICY "User reputation is viewable by everyone"
  ON public.user_reputation FOR SELECT
  USING (true);

CREATE POLICY "Users can view own reputation"
  ON public.user_reputation FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only service role can insert reputation"
  ON public.user_reputation FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() = user_id);

CREATE POLICY "Only service role can update reputation"
  ON public.user_reputation FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Reputation Events Policies
CREATE POLICY "Users can view own reputation events"
  ON public.reputation_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only service role can insert reputation events"
  ON public.reputation_events FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() = user_id);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Update timestamp function (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_verification updated_at
CREATE TRIGGER update_user_verification_timestamp
  BEFORE UPDATE ON public.user_verification
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for user_reputation updated_at
CREATE TRIGGER update_user_reputation_timestamp
  BEFORE UPDATE ON public.user_reputation
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update user_reputation on reputation_events insert
CREATE OR REPLACE FUNCTION update_reputation_on_event()
RETURNS TRIGGER AS $$
DECLARE
  v_current_date DATE := CURRENT_DATE;
  v_streak_increment INTEGER := 0;
BEGIN
    -- Insert or update user_reputation
    INSERT INTO public.user_reputation (user_id, points, last_activity_date)
    VALUES (NEW.user_id, NEW.points, v_current_date)
    ON CONFLICT (user_id) DO UPDATE SET
      points = public.user_reputation.points + NEW.points,
      last_activity_date = v_current_date,
      updated_at = NOW();

    -- Update streak if this is a daily login event
    IF NEW.event_type = 'daily_login' THEN
        UPDATE public.user_reputation
        SET streak_days = CASE
            WHEN last_activity_date = v_current_date - 1 THEN streak_days + 1
            WHEN last_activity_date = v_current_date THEN streak_days
            ELSE 1
        END
        WHERE user_id = NEW.user_id;
    END IF;

    -- Update counters based on event type
    IF NEW.event_type = 'post_created' THEN
        UPDATE public.user_reputation SET total_posts = total_posts + 1 WHERE user_id = NEW.user_id;
    ELSIF NEW.event_type = 'comment_created' THEN
        UPDATE public.user_reputation SET total_comments = total_comments + 1 WHERE user_id = NEW.user_id;
    ELSIF NEW.event_type = 'reaction_received' THEN
        UPDATE public.user_reputation SET total_reactions_received = total_reactions_received + 1 WHERE user_id = NEW.user_id;
    END IF;

    -- Update level based on points (every 100 points = 1 level)
    UPDATE public.user_reputation
    SET level = FLOOR(points / 100) + 1
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for reputation events
CREATE TRIGGER update_reputation_trigger
  AFTER INSERT ON public.reputation_events
  FOR EACH ROW EXECUTE FUNCTION update_reputation_on_event();

-- =====================================================
-- SEED ACHIEVEMENT DEFINITIONS
-- =====================================================
INSERT INTO public.achievement_definitions (name, display_name, description, icon, category, points, requirement_type, requirement_value) VALUES
  ('first_post', 'First Post!', 'Create your first post on the platform', '📝', 'engagement', 10, 'count', '{"type": "posts", "count": 1}'),
  ('prolific_poster', 'Prolific Poster', 'Create 100 posts on the platform', '📚', 'contribution', 50, 'count', '{"type": "posts", "count": 100}'),
  ('community_builder', 'Community Builder', 'Leave 500 comments on posts', '🏗️', 'contribution', 100, 'count', '{"type": "comments", "count": 500}'),
  ('streak_7', 'Week Warrior', 'Maintain a 7-day activity streak', '🔥', 'streak', 25, 'streak', '{"days": 7}'),
  ('streak_30', 'Month Master', 'Maintain a 30-day activity streak', '⚡', 'streak', 100, 'streak', '{"days": 30}'),
  ('popular', 'Popular Post', 'Receive 50 reactions on a single post', '⭐', 'engagement', 50, 'count', '{"type": "reactions_single_post", "count": 50}'),
  ('verified_journalist', 'Verified Journalist', 'Get verified as a journalist', '📰', 'special', 200, 'special', '{"type": "verification", "verification_type": "journalist"}'),
  ('verified_attorney', 'Verified Attorney', 'Get verified as an attorney', '⚖️', 'special', 200, 'special', '{"type": "verification", "verification_type": "attorney"}'),
  ('helper', 'Community Helper', 'Receive 100 helpful reactions on your content', '🤝', 'engagement', 75, 'count', '{"type": "helpful_reactions", "count": 100}'),
  ('early_adopter', 'Early Adopter', 'Join the platform in its early days', '🚀', 'special', 150, 'special', '{"type": "early_adopter"}')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievement(p_user_id UUID, p_achievement_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_achievement_id UUID;
  v_already_earned BOOLEAN;
BEGIN
    -- Get achievement ID
    SELECT id INTO v_achievement_id
    FROM public.achievement_definitions
    WHERE name = p_achievement_name AND is_active = TRUE;

    IF v_achievement_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Check if already earned
    SELECT EXISTS(
        SELECT 1 FROM public.user_achievements
        WHERE user_id = p_user_id AND achievement_id = v_achievement_id
    ) INTO v_already_earned;

    IF v_already_earned THEN
        RETURN FALSE;
    END IF;

    -- Award achievement
    INSERT INTO public.user_achievements (user_id, achievement_id)
    VALUES (p_user_id, v_achievement_id);

    -- Add reputation event for achievement
    INSERT INTO public.reputation_events (user_id, event_type, points, related_entity_type, related_entity_id)
    SELECT p_user_id, 'achievement_earned', points, 'achievement', v_achievement_id
    FROM public.achievement_definitions WHERE id = v_achievement_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's reputation summary
CREATE OR REPLACE FUNCTION get_user_reputation_summary(p_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  points INTEGER,
  level INTEGER,
  streak_days INTEGER,
  total_posts INTEGER,
  total_comments INTEGER,
  total_reactions_received INTEGER,
  achievements_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ur.user_id,
        ur.points,
        ur.level,
        ur.streak_days,
        ur.total_posts,
        ur.total_comments,
        ur.total_reactions_received,
        (SELECT COUNT(*) FROM public.user_achievements ua WHERE ua.user_id = ur.user_id) as achievements_count
    FROM public.user_reputation ur
    WHERE ur.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to get leaderboard
CREATE OR REPLACE FUNCTION get_reputation_leaderboard(p_limit INTEGER DEFAULT 10, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (
  user_id UUID,
  points INTEGER,
  level INTEGER,
  streak_days INTEGER,
  rank BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ur.user_id,
        ur.points,
        ur.level,
        ur.streak_days,
        ROW_NUMBER() OVER (ORDER BY ur.points DESC) as rank
    FROM public.user_reputation ur
    ORDER BY ur.points DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to record daily login and check streak achievements
CREATE OR REPLACE FUNCTION record_daily_login(p_user_id UUID)
RETURNS void AS $$
BEGIN
    -- Insert reputation event for daily login
    INSERT INTO public.reputation_events (user_id, event_type, points)
    VALUES (p_user_id, 'daily_login', 5);

    -- Check streak achievements
    PERFORM check_and_award_achievement(p_user_id, 'streak_7');
    PERFORM check_and_award_achievement(p_user_id, 'streak_30');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
