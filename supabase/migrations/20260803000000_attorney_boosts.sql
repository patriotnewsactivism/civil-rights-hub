CREATE TABLE IF NOT EXISTS attorney_boosts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID REFERENCES attorneys(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  payment_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attorney_boosts_active
  ON attorney_boosts (end_date, payment_status)
  WHERE payment_status = 'paid';

ALTER TABLE attorney_boosts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active boosts"
  ON attorney_boosts FOR SELECT
  USING (payment_status = 'paid' AND end_date >= NOW());

CREATE POLICY "Admins can manage boosts"
  ON attorney_boosts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );
