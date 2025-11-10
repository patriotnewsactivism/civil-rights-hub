-- Create federal_laws table for federal civil rights statutes
CREATE TABLE public.federal_laws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_name TEXT, -- e.g., "Title VII", "ADA", "Fair Housing Act"
  category TEXT NOT NULL, -- e.g., "Employment", "Housing", "Education", "Voting", "Accessibility"
  statute_citation TEXT NOT NULL, -- e.g., "42 U.S.C. § 2000e"
  year_enacted INTEGER,

  summary TEXT NOT NULL,
  full_text TEXT,
  key_provisions TEXT[],

  -- Who does it protect?
  protected_classes TEXT[], -- e.g., ["race", "color", "religion", "sex", "national origin"]

  -- Enforcement
  enforcing_agency TEXT, -- e.g., "EEOC", "DOJ", "HUD"
  enforcement_details TEXT,

  -- Additional Info
  amendments TEXT,
  related_laws TEXT[],
  external_links JSONB, -- URLs to full text, DOJ pages, etc.

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.federal_laws ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view federal laws (public resource)
CREATE POLICY "Anyone can view federal laws"
ON public.federal_laws
FOR SELECT
USING (true);

-- Only admins can create/update federal laws
CREATE POLICY "Service role can manage federal laws"
ON public.federal_laws
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Create updated_at trigger
CREATE TRIGGER update_federal_laws_updated_at
BEFORE UPDATE ON public.federal_laws
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for filtering and search
CREATE INDEX idx_federal_laws_category ON public.federal_laws(category);
CREATE INDEX idx_federal_laws_short_name ON public.federal_laws(short_name);
CREATE INDEX idx_federal_laws_protected_classes ON public.federal_laws USING GIN(protected_classes);
CREATE INDEX idx_federal_laws_year ON public.federal_laws(year_enacted);

-- Create full text search index
CREATE INDEX idx_federal_laws_search ON public.federal_laws USING GIN(
  to_tsvector('english',
    title || ' ' ||
    COALESCE(short_name, '') || ' ' ||
    summary || ' ' ||
    COALESCE(full_text, '')
  )
);
