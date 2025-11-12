-- Create activists directory table
CREATE TABLE public.activists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  alias TEXT,
  primary_platform TEXT,
  channel_url TEXT,
  focus_areas TEXT[] DEFAULT ARRAY[]::text[],
  home_state TEXT,
  profile_image_url TEXT,
  bio TEXT,
  user_submitted BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activists ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view verified activists
CREATE POLICY "Anyone can view verified activists"
  ON public.activists
  FOR SELECT
  USING (verified = true);

-- Allow authenticated users to submit activists for review
CREATE POLICY "Authenticated users can submit activists"
  ON public.activists
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_submitted = true AND verified = false);

-- Create index for common queries
CREATE INDEX idx_activists_state ON public.activists(home_state);
CREATE INDEX idx_activists_focus_areas ON public.activists USING GIN(focus_areas);
CREATE INDEX idx_activists_verified ON public.activists(verified);

-- Add updated_at trigger
CREATE TRIGGER update_activists_updated_at
  BEFORE UPDATE ON public.activists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();