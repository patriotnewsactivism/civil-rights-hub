-- Create foia_templates table for FOIA/open records request templates
CREATE TABLE public.foia_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Template Info
  title TEXT NOT NULL,
  state TEXT, -- NULL for federal templates
  state_code TEXT, -- Two-letter abbreviation
  template_type TEXT CHECK (template_type IN ('federal', 'state', 'local')),

  -- Request Details
  agency_name TEXT, -- Suggested agency name if specific
  agency_type TEXT, -- e.g., "Police Department", "State Agency", "Federal Agency"

  -- Template Content
  template_body TEXT NOT NULL, -- Letter template with placeholders like {{YOUR_NAME}}, {{SPECIFIC_RECORDS}}
  subject_line TEXT NOT NULL,
  instructions TEXT NOT NULL, -- How to fill out and submit

  -- Submission Info
  submission_method TEXT[], -- e.g., ["email", "mail", "online portal"]
  submission_email TEXT,
  submission_address TEXT,
  submission_url TEXT,
  fee_information TEXT,

  -- Legal Info
  statute_citation TEXT, -- e.g., "5 U.S.C. § 552" for federal FOIA
  response_deadline_days INTEGER, -- e.g., 20 days for federal
  appeal_process TEXT,
  notes TEXT,

  -- Metadata
  use_count INTEGER DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.foia_templates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view FOIA templates (public resource)
CREATE POLICY "Anyone can view foia templates"
ON public.foia_templates
FOR SELECT
USING (true);

-- Anyone can increment use_count
CREATE POLICY "Anyone can update use_count"
ON public.foia_templates
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Only admins can create/delete FOIA templates
CREATE POLICY "Service role can manage foia templates"
ON public.foia_templates
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Create updated_at trigger
CREATE TRIGGER update_foia_templates_updated_at
BEFORE UPDATE ON public.foia_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for filtering
CREATE INDEX idx_foia_templates_state ON public.foia_templates(state);
CREATE INDEX idx_foia_templates_type ON public.foia_templates(template_type);
CREATE INDEX idx_foia_templates_popular ON public.foia_templates(is_popular) WHERE is_popular = true;
CREATE INDEX idx_foia_templates_use_count ON public.foia_templates(use_count DESC);

-- Create full text search index
CREATE INDEX idx_foia_templates_search ON public.foia_templates USING GIN(
  to_tsvector('english',
    title || ' ' ||
    COALESCE(agency_name, '') || ' ' ||
    instructions
  )
);
