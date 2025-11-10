-- Create scanner_links table for police scanner resources
CREATE TABLE public.scanner_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL,
  state_code TEXT NOT NULL,
  city TEXT,
  county TEXT,

  -- Scanner Information
  scanner_name TEXT NOT NULL,
  description TEXT,
  frequency TEXT, -- Radio frequency if applicable

  -- Links
  broadcastify_url TEXT,
  scanner_radio_url TEXT,
  other_url TEXT,
  link_type TEXT CHECK (link_type IN ('broadcastify', 'scanner_radio', 'other', 'frequency')),

  -- Metadata
  listener_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scanner_links ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view scanner links (public resource)
CREATE POLICY "Anyone can view scanner links"
ON public.scanner_links
FOR SELECT
USING (true);

-- Only admins can create/update scanner links
CREATE POLICY "Service role can manage scanner links"
ON public.scanner_links
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Create updated_at trigger
CREATE TRIGGER update_scanner_links_updated_at
BEFORE UPDATE ON public.scanner_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for location filtering
CREATE INDEX idx_scanner_links_state ON public.scanner_links(state);
CREATE INDEX idx_scanner_links_state_code ON public.scanner_links(state_code);
CREATE INDEX idx_scanner_links_city ON public.scanner_links(city);
CREATE INDEX idx_scanner_links_county ON public.scanner_links(county);
CREATE INDEX idx_scanner_links_active ON public.scanner_links(is_active) WHERE is_active = true;
