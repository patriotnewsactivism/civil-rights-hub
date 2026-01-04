-- Create comprehensive FOIA agencies directory
-- This table stores all federal, state, and local agencies that accept FOIA/public records requests

CREATE TABLE IF NOT EXISTS public.foia_agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Agency identification
  name TEXT NOT NULL,
  acronym TEXT,
  agency_type TEXT NOT NULL, -- 'Federal', 'State', 'County', 'Municipal'

  -- Location
  state TEXT, -- NULL for federal agencies
  county TEXT,
  city TEXT,

  -- Contact information
  mailing_address TEXT,
  street_address TEXT,
  city_address TEXT,
  state_address TEXT,
  zip_code TEXT,

  -- FOIA contact details
  foia_email TEXT,
  foia_phone TEXT,
  foia_fax TEXT,
  foia_online_portal_url TEXT,
  foia_contact_name TEXT,
  foia_office_name TEXT,

  -- Response times (in business days)
  standard_response_days INTEGER DEFAULT 20, -- Federal default is 20
  expedited_response_days INTEGER DEFAULT 10,
  appeal_response_days INTEGER DEFAULT 20,

  -- Fees
  has_fees BOOLEAN DEFAULT true,
  fee_structure TEXT, -- Description of fee structure
  fee_waiver_available BOOLEAN DEFAULT true,

  -- Submission methods
  accepts_email BOOLEAN DEFAULT true,
  accepts_online BOOLEAN DEFAULT false,
  accepts_mail BOOLEAN DEFAULT true,
  accepts_fax BOOLEAN DEFAULT false,
  accepts_in_person BOOLEAN DEFAULT false,

  -- Additional information
  website_url TEXT,
  foia_guide_url TEXT,
  notes TEXT,
  parent_agency_id UUID REFERENCES public.foia_agencies(id),

  -- Metadata
  is_active BOOLEAN DEFAULT true,
  verified_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_foia_agencies_type ON public.foia_agencies(agency_type);
CREATE INDEX idx_foia_agencies_state ON public.foia_agencies(state);
CREATE INDEX idx_foia_agencies_name ON public.foia_agencies(name);
CREATE INDEX idx_foia_agencies_acronym ON public.foia_agencies(acronym);
CREATE INDEX idx_foia_agencies_parent ON public.foia_agencies(parent_agency_id);

-- Full-text search
CREATE INDEX idx_foia_agencies_search ON public.foia_agencies USING GIN(
  to_tsvector('english',
    name || ' ' ||
    COALESCE(acronym, '') || ' ' ||
    COALESCE(foia_office_name, '') || ' ' ||
    COALESCE(notes, '')
  )
);

-- Enable Row Level Security
ALTER TABLE public.foia_agencies ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view agencies (public directory)
CREATE POLICY "Anyone can view FOIA agencies"
  ON public.foia_agencies FOR SELECT
  USING (true);

-- Only service role can manage agencies
CREATE POLICY "Service role can manage FOIA agencies"
  ON public.foia_agencies FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Create trigger for updated_at
CREATE TRIGGER update_foia_agencies_updated_at
  BEFORE UPDATE ON public.foia_agencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add agency_id to foia_requests table
ALTER TABLE public.foia_requests
  ADD COLUMN IF NOT EXISTS agency_id UUID REFERENCES public.foia_agencies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_foia_requests_agency ON public.foia_requests(agency_id);

-- Create function to check overdue requests
CREATE OR REPLACE FUNCTION get_overdue_foia_requests(p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  request_id UUID,
  agency_name TEXT,
  request_subject TEXT,
  submitted_date TIMESTAMPTZ,
  response_deadline TIMESTAMPTZ,
  days_overdue INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fr.id,
    fr.agency_name,
    fr.request_subject,
    fr.submitted_date,
    fr.response_deadline,
    EXTRACT(DAY FROM (NOW() - fr.response_deadline))::INTEGER as days_overdue,
    fr.status
  FROM public.foia_requests fr
  WHERE fr.response_deadline < NOW()
    AND fr.status NOT IN ('completed', 'denied')
    AND (p_user_id IS NULL OR fr.user_id = p_user_id)
  ORDER BY days_overdue DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Create function to check requests approaching deadline
CREATE OR REPLACE FUNCTION get_approaching_deadline_foia_requests(
  p_user_id UUID DEFAULT NULL,
  p_days_threshold INTEGER DEFAULT 5
)
RETURNS TABLE (
  request_id UUID,
  agency_name TEXT,
  request_subject TEXT,
  submitted_date TIMESTAMPTZ,
  response_deadline TIMESTAMPTZ,
  days_until_deadline INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    fr.id,
    fr.agency_name,
    fr.request_subject,
    fr.submitted_date,
    fr.response_deadline,
    EXTRACT(DAY FROM (fr.response_deadline - NOW()))::INTEGER as days_until_deadline,
    fr.status
  FROM public.foia_requests fr
  WHERE fr.response_deadline > NOW()
    AND fr.response_deadline < (NOW() + (p_days_threshold || ' days')::INTERVAL)
    AND fr.status NOT IN ('completed', 'denied')
    AND (p_user_id IS NULL OR fr.user_id = p_user_id)
  ORDER BY days_until_deadline ASC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON TABLE public.foia_agencies IS 'Comprehensive directory of federal, state, and local agencies accepting FOIA/public records requests';
COMMENT ON FUNCTION get_overdue_foia_requests IS 'Returns all FOIA requests past their response deadline';
COMMENT ON FUNCTION get_approaching_deadline_foia_requests IS 'Returns FOIA requests approaching their deadline within specified days';
