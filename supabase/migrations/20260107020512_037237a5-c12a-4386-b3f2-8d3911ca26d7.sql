-- Create foia_agencies table for storing agency contact information
CREATE TABLE public.foia_agencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  agency_type TEXT NOT NULL, -- 'Federal', 'State', 'County', 'City'
  state TEXT, -- NULL for federal agencies
  city TEXT,
  foia_email TEXT,
  foia_phone TEXT,
  foia_address TEXT,
  foia_url TEXT,
  response_days INTEGER DEFAULT 20, -- Default response time in business days
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create foia_templates table for reusable request templates
CREATE TABLE public.foia_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'Police Records', 'Body Camera', 'Arrest Records', etc.
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  description TEXT,
  applicable_agency_types TEXT[] DEFAULT ARRAY['Federal', 'State', 'County', 'City']::TEXT[],
  is_featured BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create foia_request_updates table for tracking status changes and communications
CREATE TABLE public.foia_request_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.foia_requests(id) ON DELETE CASCADE,
  update_type TEXT NOT NULL, -- 'status_change', 'agency_response', 'user_note', 'deadline_extended', 'appeal_filed'
  previous_status TEXT,
  new_status TEXT,
  notes TEXT,
  attachment_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.foia_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foia_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foia_request_updates ENABLE ROW LEVEL SECURITY;

-- RLS policies for foia_agencies (public read, admin write)
CREATE POLICY "Anyone can view active agencies"
  ON public.foia_agencies
  FOR SELECT
  USING (is_active = true);

-- RLS policies for foia_templates (public read)
CREATE POLICY "Anyone can view templates"
  ON public.foia_templates
  FOR SELECT
  USING (true);

-- RLS policies for foia_request_updates (user can view/create their own)
CREATE POLICY "Users can view updates for their requests"
  ON public.foia_request_updates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.foia_requests
      WHERE foia_requests.id = foia_request_updates.request_id
      AND foia_requests.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create updates for their requests"
  ON public.foia_request_updates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.foia_requests
      WHERE foia_requests.id = request_id
      AND foia_requests.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_foia_agencies_state ON public.foia_agencies(state);
CREATE INDEX idx_foia_agencies_type ON public.foia_agencies(agency_type);
CREATE INDEX idx_foia_templates_category ON public.foia_templates(category);
CREATE INDEX idx_foia_request_updates_request ON public.foia_request_updates(request_id);

-- Add trigger for updated_at on foia_agencies
CREATE TRIGGER update_foia_agencies_updated_at
  BEFORE UPDATE ON public.foia_agencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on foia_templates
CREATE TRIGGER update_foia_templates_updated_at
  BEFORE UPDATE ON public.foia_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();