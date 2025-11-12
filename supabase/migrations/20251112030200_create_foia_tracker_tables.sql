-- Create FOIA requests table for tracking lifecycle of requests
CREATE TABLE IF NOT EXISTS foia_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES foia_templates(id) ON DELETE SET NULL,
  agency_name TEXT NOT NULL,
  agency_type TEXT, -- 'Federal', 'State', 'Local'
  state TEXT,
  request_subject TEXT NOT NULL,
  request_body TEXT NOT NULL,

  -- Request lifecycle
  status TEXT DEFAULT 'draft', -- 'draft', 'submitted', 'acknowledged', 'processing', 'completed', 'denied', 'appealed'
  submitted_date TIMESTAMPTZ,
  response_deadline TIMESTAMPTZ,
  acknowledgment_received_date TIMESTAMPTZ,
  response_received_date TIMESTAMPTZ,

  -- Tracking information
  tracking_number TEXT,
  confirmation_email TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,

  -- Follow-up and appeals
  follow_up_count INTEGER DEFAULT 0,
  appeal_filed BOOLEAN DEFAULT false,
  appeal_date TIMESTAMPTZ,

  -- Notes
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create FOIA request documents table for storing received files
CREATE TABLE IF NOT EXISTS foia_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES foia_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT
);

-- Create FOIA request updates table for timeline/activity log
CREATE TABLE IF NOT EXISTS foia_request_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES foia_requests(id) ON DELETE CASCADE,
  update_type TEXT NOT NULL, -- 'status_change', 'note', 'document_received', 'deadline_reminder'
  old_status TEXT,
  new_status TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_foia_requests_user ON foia_requests(user_id);
CREATE INDEX idx_foia_requests_status ON foia_requests(status);
CREATE INDEX idx_foia_requests_deadline ON foia_requests(response_deadline);
CREATE INDEX idx_foia_requests_submitted ON foia_requests(submitted_date);

CREATE INDEX idx_foia_documents_request ON foia_documents(request_id);
CREATE INDEX idx_foia_request_updates_request ON foia_request_updates(request_id);

-- Enable Row Level Security
ALTER TABLE foia_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE foia_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE foia_request_updates ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own FOIA requests
CREATE POLICY "Users can view their own FOIA requests"
  ON foia_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own FOIA requests"
  ON foia_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own FOIA requests"
  ON foia_requests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own FOIA requests"
  ON foia_requests FOR DELETE
  USING (auth.uid() = user_id);

-- Policies: Users can access documents for their own requests
CREATE POLICY "Users can view documents for their own requests"
  ON foia_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM foia_requests
      WHERE id = request_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload documents to their own requests"
  ON foia_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM foia_requests
      WHERE id = request_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents from their own requests"
  ON foia_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM foia_requests
      WHERE id = request_id
      AND user_id = auth.uid()
    )
  );

-- Policies: Users can view updates for their own requests
CREATE POLICY "Users can view updates for their own requests"
  ON foia_request_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM foia_requests
      WHERE id = request_id
      AND user_id = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_foia_requests_updated_at
  BEFORE UPDATE ON foia_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically log status changes
CREATE OR REPLACE FUNCTION log_foia_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO foia_request_updates (request_id, update_type, old_status, new_status, message)
    VALUES (
      NEW.id,
      'status_change',
      OLD.status,
      NEW.status,
      'Status changed from ' || COALESCE(OLD.status, 'none') || ' to ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_foia_status_change
  AFTER UPDATE ON foia_requests
  FOR EACH ROW
  EXECUTE FUNCTION log_foia_status_change();

-- Create function to calculate response deadline based on agency type
CREATE OR REPLACE FUNCTION calculate_foia_deadline(
  submitted_date TIMESTAMPTZ,
  agency_type TEXT
)
RETURNS TIMESTAMPTZ AS $$
BEGIN
  -- Federal agencies: 20 business days (approximately 28 calendar days)
  -- State agencies: varies, but we'll use 10 business days (14 calendar days) as default
  IF agency_type = 'Federal' THEN
    RETURN submitted_date + INTERVAL '28 days';
  ELSE
    RETURN submitted_date + INTERVAL '14 days';
  END IF;
END;
$$ LANGUAGE plpgsql;
