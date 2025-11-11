-- Create scanner_links table for police scanner frequencies
CREATE TABLE public.scanner_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL,
  state_code TEXT NOT NULL,
  city TEXT,
  county TEXT,
  scanner_name TEXT NOT NULL,
  description TEXT,
  frequency TEXT,
  broadcastify_url TEXT,
  scanner_radio_url TEXT,
  other_url TEXT,
  link_type TEXT CHECK (link_type IN ('broadcastify', 'scanner_radio', 'frequency', 'other')),
  listener_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scanner_links ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view scanner links)
CREATE POLICY "Anyone can view active scanner links"
  ON public.scanner_links
  FOR SELECT
  USING (is_active = true);

-- Create index for faster queries
CREATE INDEX idx_scanner_links_state ON public.scanner_links(state);
CREATE INDEX idx_scanner_links_city ON public.scanner_links(city);
CREATE INDEX idx_scanner_links_active ON public.scanner_links(is_active);

-- Add update trigger
CREATE TRIGGER update_scanner_links_updated_at
  BEFORE UPDATE ON public.scanner_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();