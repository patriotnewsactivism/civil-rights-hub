-- Create events, resources, success stories, and messaging tables

-- Events Calendar
CREATE TABLE public.community_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Event Info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('protest', 'rally', 'workshop', 'training', 'meeting', 'court_watch', 'other')),

  -- Location
  location_name TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_virtual BOOLEAN DEFAULT false,
  virtual_link TEXT,

  -- Date/Time
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,

  -- Details
  organizer_name TEXT,
  organizer_contact TEXT,
  registration_required BOOLEAN DEFAULT false,
  registration_link TEXT,
  capacity INTEGER,

  -- Engagement
  rsvp_count INTEGER DEFAULT 0,
  attendee_count INTEGER,

  -- Status
  is_published BOOLEAN DEFAULT true,
  is_cancelled BOOLEAN DEFAULT false,
  cancellation_reason TEXT,

  -- Tags
  tags TEXT[],

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event RSVPs
CREATE TABLE public.event_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  status TEXT DEFAULT 'going' CHECK (status IN ('going', 'interested', 'not_going')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Resource Library
CREATE TABLE public.resource_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Resource Info
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'video', 'link', 'image', 'audio', 'document')),
  category TEXT NOT NULL, -- e.g., "Legal Guides", "Training Materials", "Forms", "Educational"

  -- File/Link
  file_url TEXT,
  file_size BIGINT, -- in bytes
  external_url TEXT,

  -- Metadata
  author TEXT,
  source TEXT,
  language TEXT DEFAULT 'en',
  tags TEXT[],

  -- Engagement
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2),
  rating_count INTEGER DEFAULT 0,

  -- Moderation
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Resource Ratings
CREATE TABLE public.resource_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES public.resource_library(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(resource_id, user_id)
);

-- Success Stories
CREATE TABLE public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Story Info
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  outcome TEXT NOT NULL, -- e.g., "Charges Dropped", "Settlement Reached", "Policy Changed"

  -- Details
  state TEXT,
  city TEXT,
  incident_type TEXT,
  resolution_date DATE,
  organizations_involved TEXT[],

  -- Privacy
  is_anonymous BOOLEAN DEFAULT false,
  submitter_name TEXT,

  -- Engagement
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,

  -- Moderation
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Direct Messages
CREATE TABLE public.direct_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Message
  content TEXT NOT NULL,

  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  is_deleted_by_sender BOOLEAN DEFAULT false,
  is_deleted_by_recipient BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Emergency Contacts
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Contact Info
  name TEXT NOT NULL,
  relationship TEXT,
  phone TEXT NOT NULL,
  email TEXT,

  -- Priority
  is_primary BOOLEAN DEFAULT false,
  priority_order INTEGER DEFAULT 0,

  -- Notes
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Panic Button Alerts (for "I'm Being Detained" feature)
CREATE TABLE public.panic_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,

  -- Alert Info
  alert_type TEXT NOT NULL CHECK (alert_type IN ('detained', 'arrested', 'emergency', 'test')),
  message TEXT,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_alarm')),
  resolved_at TIMESTAMP WITH TIME ZONE,

  -- Recipients notified
  contacts_notified TEXT[],

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panic_alerts ENABLE ROW LEVEL SECURITY;

-- Events Policies
CREATE POLICY "Anyone can view published events"
ON public.community_events FOR SELECT
USING (is_published = true);

CREATE POLICY "Authenticated users can create events"
ON public.community_events FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Event creators can update their events"
ON public.community_events FOR UPDATE
USING (auth.uid() = created_by);

-- RSVPs Policies
CREATE POLICY "Anyone can view RSVP counts"
ON public.event_rsvps FOR SELECT
USING (true);

CREATE POLICY "Users can RSVP to events"
ON public.event_rsvps FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their RSVPs"
ON public.event_rsvps FOR UPDATE
USING (auth.uid() = user_id);

-- Resource Library Policies
CREATE POLICY "Anyone can view approved resources"
ON public.resource_library FOR SELECT
USING (is_approved = true);

CREATE POLICY "Authenticated users can upload resources"
ON public.resource_library FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

-- Success Stories Policies
CREATE POLICY "Anyone can view approved stories"
ON public.success_stories FOR SELECT
USING (is_approved = true);

CREATE POLICY "Anyone can submit stories"
ON public.success_stories FOR INSERT
WITH CHECK (true);

-- Direct Messages Policies
CREATE POLICY "Users can view their messages"
ON public.direct_messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
ON public.direct_messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their messages"
ON public.direct_messages FOR UPDATE
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Emergency Contacts Policies
CREATE POLICY "Users can view their own contacts"
ON public.emergency_contacts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their contacts"
ON public.emergency_contacts FOR ALL
USING (auth.uid() = user_id);

-- Panic Alerts Policies
CREATE POLICY "Users can view their own alerts"
ON public.panic_alerts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create panic alerts"
ON public.panic_alerts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_community_events_date ON public.community_events(start_date);
CREATE INDEX idx_community_events_state ON public.community_events(state);
CREATE INDEX idx_community_events_type ON public.community_events(event_type);
CREATE INDEX idx_event_rsvps_event ON public.event_rsvps(event_id);
CREATE INDEX idx_resource_library_category ON public.resource_library(category);
CREATE INDEX idx_resource_library_type ON public.resource_library(resource_type);
CREATE INDEX idx_success_stories_state ON public.success_stories(state);
CREATE INDEX idx_direct_messages_recipient ON public.direct_messages(recipient_id, is_read);
CREATE INDEX idx_emergency_contacts_user ON public.emergency_contacts(user_id, priority_order);
CREATE INDEX idx_panic_alerts_user ON public.panic_alerts(user_id);
CREATE INDEX idx_panic_alerts_status ON public.panic_alerts(status, created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_community_events_search ON public.community_events USING GIN(
  to_tsvector('english', title || ' ' || description)
);

CREATE INDEX idx_resource_library_search ON public.resource_library USING GIN(
  to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

CREATE INDEX idx_success_stories_search ON public.success_stories USING GIN(
  to_tsvector('english', title || ' ' || story)
);

-- Create updated_at triggers
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

CREATE TRIGGER update_emergency_contacts_updated_at
BEFORE UPDATE ON public.emergency_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update event RSVP count
CREATE OR REPLACE FUNCTION update_event_rsvp_count()
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
      SET rsvp_count = rsvp_count - 1
      WHERE id = NEW.event_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'going' THEN
    UPDATE public.community_events
    SET rsvp_count = rsvp_count - 1
    WHERE id = OLD.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_event_rsvps_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.event_rsvps
FOR EACH ROW
EXECUTE FUNCTION update_event_rsvp_count();
