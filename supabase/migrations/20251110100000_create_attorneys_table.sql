-- Create attorneys table for searchable lawyer directory
CREATE TABLE public.attorneys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  firm TEXT,
  state TEXT NOT NULL,
  city TEXT,
  practice_areas TEXT[] NOT NULL,
  specialties TEXT[],
  phone TEXT,
  email TEXT,
  website TEXT,
  bio TEXT,
  bar_number TEXT,
  years_experience INTEGER,
  rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  accepts_pro_bono BOOLEAN DEFAULT false,
  languages TEXT[] DEFAULT ARRAY['English'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.attorneys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view attorneys (public directory)
CREATE POLICY "Anyone can view attorneys"
ON public.attorneys
FOR SELECT
USING (true);

-- Only admins can create/update attorneys (will be enforced via service role)
CREATE POLICY "Service role can manage attorneys"
ON public.attorneys
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Create updated_at trigger
CREATE TRIGGER update_attorneys_updated_at
BEFORE UPDATE ON public.attorneys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for faster searches
CREATE INDEX idx_attorneys_state ON public.attorneys(state);
CREATE INDEX idx_attorneys_city ON public.attorneys(city);
CREATE INDEX idx_attorneys_practice_areas ON public.attorneys USING GIN(practice_areas);
CREATE INDEX idx_attorneys_rating ON public.attorneys(rating DESC NULLS LAST);
CREATE INDEX idx_attorneys_name ON public.attorneys(name);

-- Create full text search index for attorney search
CREATE INDEX idx_attorneys_search ON public.attorneys USING GIN(
  to_tsvector('english', name || ' ' || COALESCE(firm, '') || ' ' || COALESCE(bio, ''))
);
