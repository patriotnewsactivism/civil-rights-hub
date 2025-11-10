-- Create court_calendars table for civil rights hearings
CREATE TABLE public.court_calendars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Case Information
  case_name TEXT NOT NULL,
  case_number TEXT,
  case_type TEXT, -- e.g., "Civil Rights", "Police Misconduct", "Voting Rights"
  description TEXT NOT NULL,

  -- Location
  court_name TEXT NOT NULL,
  court_type TEXT, -- e.g., "Federal District", "State Superior", "Appeals"
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,

  -- Hearing Details
  hearing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  hearing_type TEXT, -- e.g., "Oral Arguments", "Trial", "Preliminary Hearing"
  judge_name TEXT,

  -- Parties
  plaintiff TEXT,
  defendant TEXT,

  -- Public Access
  is_public BOOLEAN DEFAULT true,
  zoom_link TEXT,
  phone_number TEXT,
  courtroom TEXT,

  -- Additional Info
  organizations_involved TEXT[], -- e.g., ["ACLU", "NLG"]
  issues TEXT[], -- e.g., ["First Amendment", "Qualified Immunity"]
  external_url TEXT,
  notes TEXT,

  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'postponed', 'completed', 'cancelled')),

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.court_calendars ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view court calendars (public resource)
CREATE POLICY "Anyone can view court calendars"
ON public.court_calendars
FOR SELECT
USING (true);

-- Only admins can create/update court calendars
CREATE POLICY "Service role can manage court calendars"
ON public.court_calendars
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Create updated_at trigger
CREATE TRIGGER update_court_calendars_updated_at
BEFORE UPDATE ON public.court_calendars
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for filtering and sorting
CREATE INDEX idx_court_calendars_date ON public.court_calendars(hearing_date);
CREATE INDEX idx_court_calendars_state ON public.court_calendars(state);
CREATE INDEX idx_court_calendars_city ON public.court_calendars(city);
CREATE INDEX idx_court_calendars_status ON public.court_calendars(status);
CREATE INDEX idx_court_calendars_type ON public.court_calendars(case_type);
CREATE INDEX idx_court_calendars_issues ON public.court_calendars USING GIN(issues);
CREATE INDEX idx_court_calendars_organizations ON public.court_calendars USING GIN(organizations_involved);

-- Create full text search index
CREATE INDEX idx_court_calendars_search ON public.court_calendars USING GIN(
  to_tsvector('english',
    case_name || ' ' ||
    description || ' ' ||
    COALESCE(plaintiff, '') || ' ' ||
    COALESCE(defendant, '')
  )
);
