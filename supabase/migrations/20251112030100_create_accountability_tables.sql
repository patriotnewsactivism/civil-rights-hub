-- Create agencies table for tracking police departments, sheriff's offices, etc.
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  agency_type TEXT NOT NULL, -- 'Police Department', 'Sheriff''s Office', 'Federal Agency', etc.
  state TEXT NOT NULL,
  city TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  total_complaints INTEGER DEFAULT 0,
  total_settlements_paid DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create officers table for tracking individual law enforcement officers
CREATE TABLE IF NOT EXISTS officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
  badge_number TEXT,
  first_name TEXT,
  last_name TEXT,
  rank TEXT,
  total_complaints INTEGER DEFAULT 0,
  total_violations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Prevent duplicate officers within same agency
  UNIQUE(agency_id, badge_number)
);

-- Create violation_officers junction table to link violations to officers
CREATE TABLE IF NOT EXISTS violation_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_id UUID REFERENCES violations(id) ON DELETE CASCADE,
  officer_id UUID REFERENCES officers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(violation_id, officer_id)
);

-- Create violation_agencies junction table to link violations to agencies
CREATE TABLE IF NOT EXISTS violation_agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  violation_id UUID REFERENCES violations(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(violation_id, agency_id)
);

-- Create indexes for efficient querying
CREATE INDEX idx_agencies_state ON agencies(state);
CREATE INDEX idx_agencies_city ON agencies(city);
CREATE INDEX idx_agencies_type ON agencies(agency_type);
CREATE INDEX idx_agencies_complaints ON agencies(total_complaints DESC);

CREATE INDEX idx_officers_agency ON officers(agency_id);
CREATE INDEX idx_officers_badge ON officers(badge_number);
CREATE INDEX idx_officers_last_name ON officers(last_name);
CREATE INDEX idx_officers_complaints ON officers(total_complaints DESC);

CREATE INDEX idx_violation_officers_violation ON violation_officers(violation_id);
CREATE INDEX idx_violation_officers_officer ON violation_officers(officer_id);

CREATE INDEX idx_violation_agencies_violation ON violation_agencies(violation_id);
CREATE INDEX idx_violation_agencies_agency ON violation_agencies(agency_id);

-- Enable Row Level Security
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE violation_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE violation_agencies ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can view all accountability data (public transparency)
CREATE POLICY "Anyone can view agencies"
  ON agencies FOR SELECT USING (true);

CREATE POLICY "Anyone can view officers"
  ON officers FOR SELECT USING (true);

CREATE POLICY "Anyone can view violation_officers links"
  ON violation_officers FOR SELECT USING (true);

CREATE POLICY "Anyone can view violation_agencies links"
  ON violation_agencies FOR SELECT USING (true);

-- Policies: Authenticated users can add officer/agency links to their own violations
CREATE POLICY "Users can link officers to violations"
  ON violation_officers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM violations
      WHERE id = violation_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can link agencies to violations"
  ON violation_agencies
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM violations
      WHERE id = violation_id
      AND user_id = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_agencies_updated_at
  BEFORE UPDATE ON agencies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_officers_updated_at
  BEFORE UPDATE ON officers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update complaint counts
CREATE OR REPLACE FUNCTION update_officer_complaint_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE officers
    SET total_violations = (
      SELECT COUNT(*) FROM violation_officers WHERE officer_id = NEW.officer_id
    )
    WHERE id = NEW.officer_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE officers
    SET total_violations = (
      SELECT COUNT(*) FROM violation_officers WHERE officer_id = OLD.officer_id
    )
    WHERE id = OLD.officer_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_agency_complaint_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE agencies
    SET total_complaints = (
      SELECT COUNT(*) FROM violation_agencies WHERE agency_id = NEW.agency_id
    )
    WHERE id = NEW.agency_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE agencies
    SET total_complaints = (
      SELECT COUNT(*) FROM violation_agencies WHERE agency_id = OLD.agency_id
    )
    WHERE id = OLD.agency_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update counts
CREATE TRIGGER trigger_update_officer_count
  AFTER INSERT OR DELETE ON violation_officers
  FOR EACH ROW
  EXECUTE FUNCTION update_officer_complaint_count();

CREATE TRIGGER trigger_update_agency_count
  AFTER INSERT OR DELETE ON violation_agencies
  FOR EACH ROW
  EXECUTE FUNCTION update_agency_complaint_count();
