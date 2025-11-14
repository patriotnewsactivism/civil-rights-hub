-- Additional Community Features: Direct Messages and Panic Alerts

-- Direct Messages (Supabase already has "messages" table, renaming to direct_messages for clarity)
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_deleted_by_sender BOOLEAN DEFAULT false,
  is_deleted_by_recipient BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Panic Alerts
CREATE TABLE IF NOT EXISTS public.panic_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'resolved', 'false_alarm'
  alert_type TEXT DEFAULT 'general', -- 'general', 'police_stop', 'arrest', 'harassment', 'other'
  notes TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- User Profiles (enhanced for community features)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  reputation_score INTEGER DEFAULT 0,
  badges TEXT[], -- array of badge names
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panic_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for direct_messages
CREATE POLICY "Users can view their own messages"
  ON public.direct_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can send messages"
  ON public.direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON public.direct_messages FOR UPDATE
  USING (auth.uid() = recipient_id);

-- RLS Policies for panic_alerts
CREATE POLICY "Users can view their own alerts"
  ON public.panic_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create alerts"
  ON public.panic_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON public.panic_alerts FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Anyone can view profiles"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create indexes
CREATE INDEX idx_direct_messages_sender ON public.direct_messages(sender_id);
CREATE INDEX idx_direct_messages_recipient ON public.direct_messages(recipient_id);
CREATE INDEX idx_direct_messages_created ON public.direct_messages(created_at DESC);
CREATE INDEX idx_panic_alerts_user ON public.panic_alerts(user_id);
CREATE INDEX idx_panic_alerts_status ON public.panic_alerts(status);
CREATE INDEX idx_panic_alerts_created ON public.panic_alerts(created_at DESC);

-- Add updated_at trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();