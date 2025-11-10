-- Create updated_at function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create violations table for community reporting
CREATE TABLE public.violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_state TEXT NOT NULL,
  location_city TEXT,
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  media_urls TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view violations (public feed)
CREATE POLICY "Anyone can view violations" 
ON public.violations 
FOR SELECT 
USING (true);

-- Allow anyone to create violations (anonymous reporting)
CREATE POLICY "Anyone can create violations" 
ON public.violations 
FOR INSERT 
WITH CHECK (true);

-- Only allow users to update their own violations
CREATE POLICY "Users can update their own violations" 
ON public.violations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_violations_updated_at
BEFORE UPDATE ON public.violations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster location queries
CREATE INDEX idx_violations_location ON public.violations(location_state, location_city);
CREATE INDEX idx_violations_date ON public.violations(incident_date DESC);
CREATE INDEX idx_violations_created ON public.violations(created_at DESC);