-- Seed social platform infrastructure: achievements, reputation events, groups, tags, and events

-- =====================================================
-- SEED ADDITIONAL ACHIEVEMENT DEFINITIONS
-- =====================================================

INSERT INTO public.achievement_definitions (name, display_name, description, icon, category, points, requirement_type, requirement_value) VALUES
  ('first_comment', 'First Comment!', 'Leave your first comment on a post', 'message-circle', 'engagement', 5, 'count', '{"type": "comments", "count": 1}'),
  ('first_violation_report', 'Watchdog', 'Submit your first violation report', 'eye', 'contribution', 25, 'count', '{"type": "violation_reports", "count": 1}'),
  ('first_foia_request', 'Transparency Advocate', 'Submit your first FOIA request', 'file-text', 'contribution', 50, 'count', '{"type": "foia_requests", "count": 1}'),
  ('streak_90', 'Quarterly Champion', 'Maintain a 90-day activity streak', 'calendar', 'streak', 250, 'streak', '{"days": 90}'),
  ('streak_365', 'Yearly Legend', 'Maintain a 365-day activity streak', 'crown', 'streak', 1000, 'streak', '{"days": 365}'),
  ('verified_activist', 'Verified Activist', 'Get verified as a community activist', 'shield-check', 'special', 150, 'special', '{"type": "verification", "verification_type": "activist"}'),
  ('verified_organization', 'Verified Organization', 'Get verified as an organization', 'building', 'special', 200, 'special', '{"type": "verification", "verification_type": "organization"}'),
  ('helpful_5', 'Helpful Voice', 'Receive 5 upvotes on your content', 'thumbs-up', 'engagement', 15, 'count', '{"type": "upvotes_received", "count": 5}'),
  ('helpful_25', 'Trusted Voice', 'Receive 25 upvotes on your content', 'award', 'engagement', 50, 'count', '{"type": "upvotes_received", "count": 25}'),
  ('helpful_100', 'Community Expert', 'Receive 100 upvotes on your content', 'star', 'engagement', 150, 'count', '{"type": "upvotes_received", "count": 100}'),
  ('foia_master', 'FOIA Master', 'Submit 10 FOIA requests', 'folder-open', 'contribution', 200, 'count', '{"type": "foia_requests", "count": 10}'),
  ('community_builder_group', 'Group Creator', 'Create a group that reaches 10+ members', 'users', 'special', 100, 'special', '{"type": "group_members", "count": 10}')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- CREATE REPUTATION EVENT TYPES CONFIGURATION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.reputation_event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  daily_limit INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.reputation_event_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reputation event types are viewable by everyone"
  ON public.reputation_event_types FOR SELECT
  USING (true);

CREATE POLICY "Only service role can manage event types"
  ON public.reputation_event_types FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- SEED REPUTATION EVENT TYPES
-- =====================================================

INSERT INTO public.reputation_event_types (event_type, display_name, description, points, daily_limit) VALUES
  ('post_created', 'Post Created', 'Create a new post in the community feed', 10, 50),
  ('comment_created', 'Comment Created', 'Leave a comment on a post', 5, 25),
  ('post_liked', 'Post Liked', 'Your post received a like/reaction', 2, NULL),
  ('comment_upvoted', 'Comment Upvoted', 'Your comment received an upvote', 2, NULL),
  ('daily_login', 'Daily Login', 'Log in to the platform each day', 5, 5),
  ('violation_reported', 'Violation Reported', 'Submit a violation report', 15, 100),
  ('violation_verified', 'Violation Verified', 'Your violation report was verified', 50, NULL),
  ('foia_submitted', 'FOIA Request Submitted', 'Submit a FOIA request', 25, 100),
  ('foia_completed', 'FOIA Request Completed', 'A FOIA request you submitted was completed', 100, NULL),
  ('group_joined', 'Group Joined', 'Join a community group', 5, 20),
  ('share', 'Content Shared', 'Share content to external platforms', 3, 15)
ON CONFLICT (event_type) DO NOTHING;

-- Alter reputation_events to add new event types to constraint
ALTER TABLE public.reputation_events
  DROP CONSTRAINT IF EXISTS reputation_events_event_type_check;

ALTER TABLE public.reputation_events
  ADD CONSTRAINT reputation_events_event_type_check
  CHECK (event_type IN (
    'post_created', 'comment_created', 'post_liked', 'comment_upvoted',
    'daily_login', 'violation_reported', 'violation_verified',
    'foia_submitted', 'foia_completed', 'group_joined', 'share',
    'reaction_received', 'achievement_earned'
  ));

-- =====================================================
-- SEED GROUPS
-- =====================================================

INSERT INTO public.groups (id, name, slug, description, type, settings, member_count, is_active) VALUES
  (gen_random_uuid(), 'Civil Rights Discussion', 'civil-rights-discussion', 'A community for discussing civil rights issues, news, and developments across the United States. Share articles, ask questions, and engage with fellow advocates.', 'public', '{"allow_posts": true, "require_approval": false, "topics": ["civil-rights", "news", "discussion"]}', 0, true),
  (gen_random_uuid(), 'FOIA Tips & Strategies', 'foia-tips-strategies', 'Learn and share best practices for filing Freedom of Information Act requests. Get help with your requests, share success stories, and discover new strategies.', 'public', '{"allow_posts": true, "require_approval": false, "topics": ["foia", "transparency", "public-records"]}', 0, true),
  (gen_random_uuid(), 'Know Your Rights', 'know-your-rights', 'Educational community focused on understanding your constitutional rights. Learn about interactions with law enforcement, protest rights, and legal protections.', 'public', '{"allow_posts": true, "require_approval": false, "topics": ["know-your-rights", "education", "legal"]}', 0, true),
  (gen_random_uuid(), 'Cop Watch Organizers', 'cop-watch-organizers', 'Connect with other police accountability activists. Coordinate monitoring efforts, share resources, and organize community oversight initiatives.', 'public', '{"allow_posts": true, "require_approval": false, "topics": ["police-accountability", "activism", "community-oversight"]}', 0, true),
  (gen_random_uuid(), 'Legal Observers', 'legal-observers', 'A group for trained legal observers and those interested in becoming one. Coordinate observation efforts at protests and document potential rights violations.', 'public', '{"allow_posts": true, "require_approval": false, "topics": ["legal-observers", "protest-support", "documentation"]}', 0, true)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED POPULAR TAGS
-- =====================================================

INSERT INTO public.popular_tags (tag, use_count, last_used) VALUES
  ('first-amendment', 150, NOW()),
  ('police-misconduct', 125, NOW()),
  ('foia', 200, NOW()),
  ('recording-rights', 85, NOW()),
  ('protest-rights', 110, NOW()),
  ('qualified-immunity', 75, NOW()),
  ('excessive-force', 95, NOW()),
  ('false-arrest', 60, NOW())
ON CONFLICT (tag) DO UPDATE SET
  use_count = GREATEST(popular_tags.use_count, EXCLUDED.use_count),
  last_used = NOW();

-- =====================================================
-- SEED COMMUNITY EVENTS
-- =====================================================

INSERT INTO public.community_events (id, title, description, event_type, start_date, end_date, location, is_public, is_cancelled, rsvp_count) VALUES
  (gen_random_uuid(), 'Virtual Know Your Rights Workshop', 'Join us for an interactive online workshop covering your constitutional rights during police encounters, at protests, and in everyday situations. Learn from experienced civil rights attorneys and activists.', 'workshop', '2026-03-15 18:00:00+00', '2026-03-15 20:00:00+00', 'Virtual (Zoom link sent upon RSVP)', true, false, 0),
  (gen_random_uuid(), 'FOIA Filing Webinar', 'Learn how to effectively file Freedom of Information Act requests. This webinar covers the basics of FOIA, tips for writing effective requests, and how to appeal denials. Perfect for beginners and experienced requesters alike.', 'webinar', '2026-03-08 14:00:00+00', '2026-03-08 16:00:00+00', 'Virtual (YouTube Live)', true, false, 0),
  (gen_random_uuid(), 'Community Meetup: Chicago', 'Meet fellow civil rights advocates in the Chicago area. Network, share experiences, and learn about local opportunities to get involved in police accountability and transparency efforts.', 'meeting', '2026-03-22 11:00:00+00', '2026-03-22 14:00:00+00', 'Chicago Community Center - 123 Main St, Chicago, IL', true, false, 0),
  (gen_random_uuid(), 'Legal Observer Training', 'Become a trained legal observer! This in-person training will prepare you to document police activity at protests and protect demonstrators'' constitutional rights.', 'training', '2026-04-05 09:00:00+00', '2026-04-05 17:00:00+00', 'Civil Rights Center - 456 Oak Ave, New York, NY', true, false, 0),
  (gen_random_uuid(), 'Cop Watch Coordination Meeting', 'Monthly meeting for Cop Watch organizers to coordinate monitoring schedules, share resources, and discuss community oversight strategies.', 'meeting', '2026-02-28 19:00:00+00', '2026-02-28 21:00:00+00', 'Virtual (Discord)', true, false, 0)
ON CONFLICT DO NOTHING;

-- =====================================================
-- CREATE INDEX FOR REPUTATION EVENT TYPES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_reputation_event_types_type ON public.reputation_event_types(event_type);
CREATE INDEX IF NOT EXISTS idx_reputation_event_types_active ON public.reputation_event_types(is_active);
