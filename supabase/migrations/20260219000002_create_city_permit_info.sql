-- Create city permit information table for protest and assembly rights
-- Part of Phase 5: State Laws & Legal Resources

CREATE TABLE IF NOT EXISTS public.city_permit_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  state_code TEXT NOT NULL,
  
  -- Permit Office
  permit_office_name TEXT,
  permit_office_address TEXT,
  permit_office_phone TEXT,
  permit_office_email TEXT,
  permit_office_website TEXT,
  
  -- Requirements
  permit_required BOOLEAN DEFAULT true,
  permit_fee_min DECIMAL(10, 2),
  permit_fee_max DECIMAL(10, 2),
  permit_fee_notes TEXT,
  permit_timeline_days INTEGER,
  permit_deadline_days INTEGER,
  
  -- Restrictions
  designated_protest_areas TEXT[],
  restricted_areas TEXT[],
  amplification_allowed BOOLEAN DEFAULT true,
  amplification_permit_required BOOLEAN DEFAULT false,
  signage_restrictions TEXT,
  
  -- Appeal Process
  appeal_process TEXT,
  appeal_contact TEXT,
  appeal_timeline_days INTEGER,
  
  -- Legal Resources
  local_aclu_chapter TEXT,
  local_aclu_phone TEXT,
  local_aclu_website TEXT,
  legal_observer_program TEXT,
  legal_observer_contact TEXT,
  bail_fund_name TEXT,
  bail_fund_phone TEXT,
  bail_fund_website TEXT,
  kyr_hotline TEXT,
  
  -- Additional
  notes TEXT,
  last_verified DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(city, state)
);

CREATE INDEX idx_city_permit_state ON public.city_permit_info(state);
CREATE INDEX idx_city_permit_city ON public.city_permit_info(city);
CREATE INDEX idx_city_permit_state_code ON public.city_permit_info(state_code);

ALTER TABLE public.city_permit_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view city permit info"
  ON public.city_permit_info FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage city permit info"
  ON public.city_permit_info FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE TRIGGER update_city_permit_info_updated_at
  BEFORE UPDATE ON public.city_permit_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.city_permit_info IS 'City-specific protest permit information including requirements, fees, legal resources, and contact information';
