-- Create representatives table for elected officials
CREATE TABLE IF NOT EXISTS representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  official_id TEXT UNIQUE, -- External ID from API (e.g., Civic Information API)
  name TEXT NOT NULL,
  position TEXT NOT NULL, -- 'Senator', 'Representative', 'State Senator', etc.
  party TEXT,
  state TEXT,
  district TEXT,

  -- Contact information
  phone TEXT,
  email TEXT,
  website TEXT,
  office_address TEXT,

  -- Social media
  twitter TEXT,
  facebook TEXT,

  level TEXT NOT NULL, -- 'federal', 'state', 'local'
  chamber TEXT, -- 'senate', 'house', 'assembly', etc.

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create legislation table for tracking bills
CREATE TABLE IF NOT EXISTS legislation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  full_text_url TEXT,

  -- Classification
  level TEXT NOT NULL, -- 'federal', 'state'
  state TEXT, -- NULL for federal bills
  category TEXT[], -- ['Civil Rights', 'Privacy', 'Police Reform', etc.]

  -- Status
  status TEXT NOT NULL, -- 'introduced', 'in_committee', 'passed_house', 'passed_senate', 'signed', 'vetoed', 'failed'
  introduced_date DATE,
  last_action_date DATE,
  last_action_description TEXT,

  -- Voting
  vote_count_yes INTEGER,
  vote_count_no INTEGER,
  vote_count_abstain INTEGER,

  -- Sponsors
  primary_sponsor_id UUID REFERENCES representatives(id),

  -- User engagement
  support_count INTEGER DEFAULT 0,
  oppose_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(bill_number, state)
);

-- Create bill sponsors junction table (for co-sponsors)
CREATE TABLE IF NOT EXISTS bill_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES legislation(id) ON DELETE CASCADE,
  representative_id UUID REFERENCES representatives(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(bill_id, representative_id)
);

-- Create user actions table for tracking user engagement
CREATE TABLE IF NOT EXISTS legislative_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bill_id UUID REFERENCES legislation(id) ON DELETE CASCADE,
  representative_id UUID REFERENCES representatives(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'email_sent', 'call_made', 'support', 'oppose'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, bill_id, representative_id, action_type)
);

-- Create action templates table for pre-written scripts
CREATE TABLE IF NOT EXISTS action_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES legislation(id) ON DELETE CASCADE,
  template_type TEXT NOT NULL, -- 'email', 'call_script', 'social_media'
  position TEXT NOT NULL, -- 'support', 'oppose'
  subject_line TEXT, -- For emails
  body_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_representatives_state ON representatives(state);
CREATE INDEX IF NOT EXISTS idx_representatives_level ON representatives(level);
CREATE INDEX IF NOT EXISTS idx_representatives_position ON representatives(position);

CREATE INDEX IF NOT EXISTS idx_legislation_status ON legislation(status);
CREATE INDEX IF NOT EXISTS idx_legislation_state ON legislation(state);
CREATE INDEX IF NOT EXISTS idx_legislation_level ON legislation(level);
CREATE INDEX IF NOT EXISTS idx_legislation_category ON legislation USING GIN(category);
CREATE INDEX IF NOT EXISTS idx_legislation_introduced ON legislation(introduced_date DESC);

CREATE INDEX IF NOT EXISTS idx_bill_sponsors_bill ON bill_sponsors(bill_id);
CREATE INDEX IF NOT EXISTS idx_bill_sponsors_rep ON bill_sponsors(representative_id);

CREATE INDEX IF NOT EXISTS idx_legislative_actions_user ON legislative_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_legislative_actions_bill ON legislative_actions(bill_id);
CREATE INDEX IF NOT EXISTS idx_legislative_actions_rep ON legislative_actions(representative_id);

CREATE INDEX IF NOT EXISTS idx_action_templates_bill ON action_templates(bill_id);

-- Enable Row Level Security
ALTER TABLE representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislation ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislative_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_templates ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can view representatives and legislation (public data)
DROP POLICY IF EXISTS "Anyone can view representatives" ON representatives;
CREATE POLICY "Anyone can view representatives"
  ON representatives FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view legislation" ON legislation;
CREATE POLICY "Anyone can view legislation"
  ON legislation FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view bill sponsors" ON bill_sponsors;
CREATE POLICY "Anyone can view bill sponsors"
  ON bill_sponsors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view action templates" ON action_templates;
CREATE POLICY "Anyone can view action templates"
  ON action_templates FOR SELECT USING (true);

-- Policies: Users can manage their own actions
DROP POLICY IF EXISTS "Users can view their own actions" ON legislative_actions;
CREATE POLICY "Users can view their own actions"
  ON legislative_actions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own actions" ON legislative_actions;
CREATE POLICY "Users can create their own actions"
  ON legislative_actions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own actions" ON legislative_actions;
CREATE POLICY "Users can update their own actions"
  ON legislative_actions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own actions" ON legislative_actions;
CREATE POLICY "Users can delete their own actions"
  ON legislative_actions FOR DELETE
  USING (auth.uid() = user_id);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_representatives_updated_at ON representatives;
CREATE TRIGGER update_representatives_updated_at
  BEFORE UPDATE ON representatives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_legislation_updated_at ON legislation;
CREATE TRIGGER update_legislation_updated_at
  BEFORE UPDATE ON legislation
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_action_templates_updated_at ON action_templates;
CREATE TRIGGER update_action_templates_updated_at
  BEFORE UPDATE ON action_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update support/oppose counts on legislation
CREATE OR REPLACE FUNCTION update_legislation_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.action_type = 'support' THEN
      UPDATE legislation SET support_count = support_count + 1 WHERE id = NEW.bill_id;
    ELSIF NEW.action_type = 'oppose' THEN
      UPDATE legislation SET oppose_count = oppose_count + 1 WHERE id = NEW.bill_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.action_type = 'support' THEN
      UPDATE legislation SET support_count = support_count - 1 WHERE id = OLD.bill_id;
    ELSIF OLD.action_type = 'oppose' THEN
      UPDATE legislation SET oppose_count = oppose_count - 1 WHERE id = OLD.bill_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_legislation_counts_insert ON legislative_actions;
CREATE TRIGGER trigger_update_legislation_counts_insert
  AFTER INSERT ON legislative_actions
  FOR EACH ROW
  WHEN (NEW.action_type IN ('support', 'oppose'))
  EXECUTE FUNCTION update_legislation_counts();

DROP TRIGGER IF EXISTS trigger_update_legislation_counts_delete ON legislative_actions;
CREATE TRIGGER trigger_update_legislation_counts_delete
  AFTER DELETE ON legislative_actions
  FOR EACH ROW
  WHEN (OLD.action_type IN ('support', 'oppose'))
  EXECUTE FUNCTION update_legislation_counts();
