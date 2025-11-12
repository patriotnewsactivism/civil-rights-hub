-- Create attorneys table
CREATE TABLE public.attorneys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  firm_name TEXT,
  state TEXT NOT NULL,
  city TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  accepts_pro_bono BOOLEAN DEFAULT false,
  bar_number TEXT,
  years_experience INTEGER,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.attorneys ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view attorneys
CREATE POLICY "Anyone can view attorneys"
ON public.attorneys
FOR SELECT
USING (true);

-- Indexes for performance
CREATE INDEX idx_attorneys_state ON public.attorneys(state);
CREATE INDEX idx_attorneys_pro_bono ON public.attorneys(accepts_pro_bono);
CREATE INDEX idx_attorneys_specialties ON public.attorneys USING GIN(specialties);

-- Trigger for updated_at
CREATE TRIGGER update_attorneys_updated_at
BEFORE UPDATE ON public.attorneys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create FOIA requests table
CREATE TABLE public.foia_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  state TEXT NOT NULL,
  agency_name TEXT NOT NULL,
  request_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  details TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_address TEXT,
  status TEXT DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE,
  response_due_date TIMESTAMP WITH TIME ZONE,
  response_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.foia_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own requests
CREATE POLICY "Users can view their own FOIA requests"
ON public.foia_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can create their own requests
CREATE POLICY "Users can create FOIA requests"
ON public.foia_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own requests
CREATE POLICY "Users can update their own FOIA requests"
ON public.foia_requests
FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_foia_requests_user_id ON public.foia_requests(user_id);
CREATE INDEX idx_foia_requests_state ON public.foia_requests(state);
CREATE INDEX idx_foia_requests_status ON public.foia_requests(status);

-- Trigger for updated_at
CREATE TRIGGER update_foia_requests_updated_at
BEFORE UPDATE ON public.foia_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();