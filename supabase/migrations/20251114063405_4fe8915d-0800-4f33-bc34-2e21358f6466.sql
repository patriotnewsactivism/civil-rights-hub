-- Create agencies table for tracking police departments and government entities
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  agency_type TEXT NOT NULL, -- 'police', 'sheriff', 'state_police', 'federal', 'government'
  state TEXT NOT NULL,
  city TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  total_complaints INTEGER DEFAULT 0,
  total_violations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create officers table for tracking individual officers
CREATE TABLE IF NOT EXISTS public.officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
  badge_number TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  rank TEXT,
  total_violations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agency_id, badge_number)
);

-- Create junction table for violations and agencies
CREATE TABLE IF NOT EXISTS public.violation_agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_id UUID REFERENCES public.violations(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(violation_id, agency_id)
);

-- Create junction table for violations and officers
CREATE TABLE IF NOT EXISTS public.violation_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_id UUID REFERENCES public.violations(id) ON DELETE CASCADE,
  officer_id UUID REFERENCES public.officers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(violation_id, officer_id)
);

-- Enable RLS
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violation_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violation_officers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agencies (public read)
CREATE POLICY "Anyone can view agencies"
  ON public.agencies FOR SELECT
  USING (true);

-- RLS Policies for officers (public read)
CREATE POLICY "Anyone can view officers"
  ON public.officers FOR SELECT
  USING (true);

-- RLS Policies for violation_agencies (public read)
CREATE POLICY "Anyone can view violation agencies"
  ON public.violation_agencies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can link violations to agencies"
  ON public.violation_agencies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for violation_officers (public read)
CREATE POLICY "Anyone can view violation officers"
  ON public.violation_officers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can link violations to officers"
  ON public.violation_officers FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes
CREATE INDEX idx_agencies_state ON public.agencies(state);
CREATE INDEX idx_agencies_type ON public.agencies(agency_type);
CREATE INDEX idx_officers_agency ON public.officers(agency_id);
CREATE INDEX idx_officers_badge ON public.officers(badge_number);
CREATE INDEX idx_violation_agencies_violation ON public.violation_agencies(violation_id);
CREATE INDEX idx_violation_agencies_agency ON public.violation_agencies(agency_id);
CREATE INDEX idx_violation_officers_violation ON public.violation_officers(violation_id);
CREATE INDEX idx_violation_officers_officer ON public.violation_officers(officer_id);

-- Add updated_at triggers
CREATE TRIGGER update_agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_officers_updated_at
  BEFORE UPDATE ON public.officers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();