-- Create activists table for First Amendment auditors and civil rights activists
CREATE TABLE IF NOT EXISTS activists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  alias TEXT,
  primary_platform TEXT,
  channel_url TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  home_state TEXT,
  profile_image_url TEXT,
  bio TEXT,
  user_submitted BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on verified status for faster queries
CREATE INDEX idx_activists_verified ON activists(verified);

-- Create index on home_state for location filtering
CREATE INDEX idx_activists_home_state ON activists(home_state);

-- Create GIN index on focus_areas for array queries
CREATE INDEX idx_activists_focus_areas ON activists USING GIN(focus_areas);

-- Enable Row Level Security
ALTER TABLE activists ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view verified activists
CREATE POLICY "Anyone can view verified activists"
  ON activists
  FOR SELECT
  USING (verified = true);

-- Policy: Authenticated users can submit activists (pending verification)
CREATE POLICY "Authenticated users can submit activists"
  ON activists
  FOR INSERT
  TO authenticated
  WITH CHECK (user_submitted = true AND verified = false);

-- Create trigger for updated_at
CREATE TRIGGER update_activists_updated_at
  BEFORE UPDATE ON activists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
