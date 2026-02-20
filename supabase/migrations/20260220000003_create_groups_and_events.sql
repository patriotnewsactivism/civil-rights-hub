-- Create groups and enhanced events tables
-- This migration adds community groups with events integration

-- =====================================================
-- GROUPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  avatar_url TEXT,
  type TEXT NOT NULL DEFAULT 'public' CHECK (type IN ('public', 'private', 'secret')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{"allow_posts": true, "require_approval": false, "topics": []}'::jsonb,
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GROUP MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notifications_enabled BOOLEAN DEFAULT true,

  UNIQUE(group_id, user_id)
);

-- =====================================================
-- GROUP POSTS TABLE (junction between posts and groups)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.group_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(post_id, group_id)
);

-- =====================================================
-- ALTER EXISTING COMMUNITY_EVENTS TABLE
-- =====================================================
ALTER TABLE public.community_events
  ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS location_url TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS rsvp_limit INTEGER,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Rename created_by to organizer_id for consistency
ALTER TABLE public.community_events
  RENAME COLUMN created_by TO organizer_id;

-- Add organizer_id if rename didn't apply (column didn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'community_events' AND column_name = 'organizer_id'
  ) THEN
    ALTER TABLE public.community_events ADD COLUMN organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Update event_type constraint to include new types
ALTER TABLE public.community_events
  DROP CONSTRAINT IF EXISTS community_events_event_type_check;

ALTER TABLE public.community_events
  ADD CONSTRAINT community_events_event_type_check
  CHECK (event_type IN ('watch_party', 'meeting', 'protest', 'workshop', 'webinar', 'rally', 'training', 'court_watch', 'other'));

-- =====================================================
-- ALTER EXISTING EVENT_RSVPS TABLE
-- =====================================================
ALTER TABLE public.event_rsvps
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update status constraint to include 'maybe'
ALTER TABLE public.event_rsvps
  DROP CONSTRAINT IF EXISTS event_rsvps_status_check;

ALTER TABLE public.event_rsvps
  ADD CONSTRAINT event_rsvps_status_check
  CHECK (status IN ('going', 'maybe', 'not_going', 'interested'));

-- =====================================================
-- EVENT INVITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.event_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(event_id, invited_user_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_groups_slug ON public.groups(slug);
CREATE INDEX IF NOT EXISTS idx_groups_type ON public.groups(type);
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON public.groups(created_by);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_group ON public.group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_post ON public.group_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_community_events_date ON public.community_events(start_date);
CREATE INDEX IF NOT EXISTS idx_community_events_group ON public.community_events(group_id);
CREATE INDEX IF NOT EXISTS idx_community_events_organizer ON public.community_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_event ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_rsvps_user ON public.event_rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_event_invites_event ON public.event_invites(event_id);
CREATE INDEX IF NOT EXISTS idx_event_invites_user ON public.event_invites(invited_user_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_invites ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- GROUPS POLICIES
-- =====================================================

-- Public groups visible to all, private/secret only to members
CREATE POLICY "Public groups are viewable by everyone"
  ON public.groups FOR SELECT
  USING (
    type = 'public'
    OR auth.uid() IN (SELECT user_id FROM public.group_members WHERE group_id = id)
  );

-- Authenticated users can create groups
CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Group admins can update groups
CREATE POLICY "Group admins can update groups"
  ON public.groups FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.group_members
      WHERE group_id = id AND role = 'admin'
    )
  );

-- Group admins can delete groups
CREATE POLICY "Group admins can delete groups"
  ON public.groups FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.group_members
      WHERE group_id = id AND role = 'admin'
    )
  );

-- =====================================================
-- GROUP MEMBERS POLICIES
-- =====================================================

-- Members visible based on group type
CREATE POLICY "Group members visible based on group visibility"
  ON public.group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE id = group_id AND type = 'public'
    )
    OR auth.uid() IN (
      SELECT user_id FROM public.group_members WHERE group_id = group_id
    )
  );

-- Users can join public groups
CREATE POLICY "Users can join public groups"
  ON public.group_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.groups
      WHERE id = group_id AND type = 'public'
    )
  );

-- Group admins can manage members
CREATE POLICY "Group admins can manage members"
  ON public.group_members FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.group_members
      WHERE group_id = group_id AND role = 'admin'
    )
  );

-- Users can update their own membership settings
CREATE POLICY "Users can update own membership"
  ON public.group_members FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can leave groups
CREATE POLICY "Users can leave groups"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- GROUP POSTS POLICIES
-- =====================================================

-- Group posts visible based on group visibility
CREATE POLICY "Group posts visible based on group membership"
  ON public.group_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_id AND g.type = 'public'
    )
    OR auth.uid() IN (
      SELECT user_id FROM public.group_members WHERE group_id = group_id
    )
  );

-- Group members can create posts
CREATE POLICY "Group members can create posts"
  ON public.group_posts FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.group_members WHERE group_id = group_id
    )
  );

-- Group admins and moderators can pin posts
CREATE POLICY "Group admins and moderators can manage posts"
  ON public.group_posts FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.group_members
      WHERE group_id = group_id AND role IN ('admin', 'moderator')
    )
  );

-- =====================================================
-- EVENT INVITES POLICIES
-- =====================================================

-- Users can view their own invites
CREATE POLICY "Users can view their own invites"
  ON public.event_invites FOR SELECT
  USING (auth.uid() = invited_user_id OR auth.uid() = invited_by);

-- Users can create invites for events they organize
CREATE POLICY "Event organizers can create invites"
  ON public.event_invites FOR INSERT
  WITH CHECK (
    auth.uid() = invited_by
    AND EXISTS (
      SELECT 1 FROM public.community_events
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  );

-- Users can respond to their invites
CREATE POLICY "Users can respond to their invites"
  ON public.event_invites FOR UPDATE
  USING (auth.uid() = invited_user_id);

-- =====================================================
-- UPDATE COMMUNITY_EVENTS POLICIES FOR GROUP VISIBILITY
-- =====================================================

-- Drop existing select policy to replace with enhanced one
DROP POLICY IF EXISTS "Anyone can view published events" ON public.community_events;

-- Events visible based on is_public and group membership
CREATE POLICY "Events visible based on public status and group membership"
  ON public.community_events FOR SELECT
  USING (
    is_public = true
    OR organizer_id = auth.uid()
    OR (group_id IS NOT NULL AND auth.uid() IN (
      SELECT user_id FROM public.group_members WHERE group_id = group_id
    ))
  );

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update group timestamp
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups
    SET member_count = member_count + 1
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups
    SET member_count = GREATEST(member_count - 1, 0)
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_group_member_count_trigger
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW
  EXECUTE FUNCTION update_group_member_count();

-- Function to update group post count
CREATE OR REPLACE FUNCTION update_group_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups
    SET post_count = post_count + 1
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups
    SET post_count = GREATEST(post_count - 1, 0)
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_group_post_count_trigger
  AFTER INSERT OR DELETE ON public.group_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_group_post_count();

-- Function to update event RSVP count (enhanced for new status values)
CREATE OR REPLACE FUNCTION update_event_rsvp_count_enhanced()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'going' THEN
    UPDATE public.community_events
    SET rsvp_count = rsvp_count + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'going' AND NEW.status = 'going' THEN
      UPDATE public.community_events
      SET rsvp_count = rsvp_count + 1
      WHERE id = NEW.event_id;
    ELSIF OLD.status = 'going' AND NEW.status != 'going' THEN
      UPDATE public.community_events
      SET rsvp_count = GREATEST(rsvp_count - 1, 0)
      WHERE id = NEW.event_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'going' THEN
    UPDATE public.community_events
    SET rsvp_count = GREATEST(rsvp_count - 1, 0)
    WHERE id = OLD.event_id;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop old trigger and create new one
DROP TRIGGER IF EXISTS update_event_rsvps_trigger ON public.event_rsvps;

CREATE TRIGGER update_event_rsvps_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.event_rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_event_rsvp_count_enhanced();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Check if user is group member
CREATE OR REPLACE FUNCTION is_group_member(p_group_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Check if user is group admin
CREATE OR REPLACE FUNCTION is_group_admin(p_group_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = p_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Get user's role in group
CREATE OR REPLACE FUNCTION get_user_group_role(p_group_id UUID, p_user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.group_members
    WHERE group_id = p_group_id AND user_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Get groups user is member of
CREATE OR REPLACE FUNCTION get_user_groups(p_user_id UUID)
RETURNS TABLE (
  group_id UUID,
  name TEXT,
  slug TEXT,
  role TEXT,
  member_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.name,
    g.slug,
    gm.role,
    g.member_count
  FROM public.groups g
  JOIN public.group_members gm ON g.id = gm.group_id
  WHERE gm.user_id = p_user_id AND g.is_active = true
  ORDER BY g.name;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Get upcoming events for a group
CREATE OR REPLACE FUNCTION get_group_events(p_group_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  event_id UUID,
  title TEXT,
  event_type TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  rsvp_count INTEGER,
  is_public BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.id,
    ce.title,
    ce.event_type,
    ce.start_date,
    ce.rsvp_count,
    ce.is_public
  FROM public.community_events ce
  WHERE ce.group_id = p_group_id
    AND ce.start_date >= NOW()
    AND ce.is_cancelled = false
  ORDER BY ce.start_date ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Auto-create admin membership when group is created
CREATE OR REPLACE FUNCTION create_group_admin_membership()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER create_group_admin_trigger
  AFTER INSERT ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION create_group_admin_membership();
