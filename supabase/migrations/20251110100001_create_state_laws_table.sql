-- Create state_laws table for legal information database
CREATE TABLE public.state_laws (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL UNIQUE,
  state_code TEXT NOT NULL, -- Two-letter abbreviation (e.g., "CA", "NY")

  -- Recording Laws
  recording_consent_type TEXT NOT NULL CHECK (recording_consent_type IN ('one-party', 'two-party', 'all-party')),
  recording_law_details TEXT NOT NULL,
  recording_law_citation TEXT,

  -- Police Recording Rights
  can_record_police BOOLEAN NOT NULL DEFAULT true,
  police_recording_details TEXT NOT NULL,
  police_recording_restrictions TEXT,

  -- Journalist Protections
  has_shield_law BOOLEAN DEFAULT false,
  shield_law_details TEXT,
  journalist_protections TEXT,

  -- Activist/Assembly Rights
  assembly_rights_details TEXT,
  protest_permit_required BOOLEAN DEFAULT false,
  activist_protections TEXT,

  -- Additional Resources
  state_aclu_url TEXT,
  state_legal_aid_url TEXT,
  state_resources JSONB, -- Flexible field for additional resources

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.state_laws ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view state laws (public resource)
CREATE POLICY "Anyone can view state laws"
ON public.state_laws
FOR SELECT
USING (true);

-- Only admins can create/update state laws
CREATE POLICY "Service role can manage state laws"
ON public.state_laws
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Create updated_at trigger
CREATE TRIGGER update_state_laws_updated_at
BEFORE UPDATE ON public.state_laws
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for faster lookups
CREATE INDEX idx_state_laws_state ON public.state_laws(state);
CREATE INDEX idx_state_laws_state_code ON public.state_laws(state_code);
CREATE INDEX idx_state_laws_consent_type ON public.state_laws(recording_consent_type);

-- Create full text search index
CREATE INDEX idx_state_laws_search ON public.state_laws USING GIN(
  to_tsvector('english',
    state || ' ' ||
    recording_law_details || ' ' ||
    police_recording_details || ' ' ||
    COALESCE(shield_law_details, '') || ' ' ||
    COALESCE(assembly_rights_details, '')
  )
);
