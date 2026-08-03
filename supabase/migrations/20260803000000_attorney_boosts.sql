-- Attorney Homepage Boost System
-- Allows attorneys to pay for prominent homepage placement ($700/week, $350 in August)
-- Falls back gracefully — FeaturedAttorney component shows promo CTA when no active boost exists

CREATE TABLE IF NOT EXISTS attorney_boosts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID REFERENCES attorneys(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  payment_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup of active boosts
CREATE INDEX IF NOT EXISTS idx_attorney_boosts_active
  ON attorney_boosts (end_date, payment_status)
  WHERE payment_status = 'paid';

-- RLS: Anyone can view active (paid, non-expired) boosts
ALTER TABLE attorney_boosts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active boosts"
  ON attorney_boosts FOR SELECT
  USING (payment_status = 'paid' AND end_date >= NOW());

-- Admins can manage all boosts
CREATE POLICY "Admins can manage boosts"
  ON attorney_boosts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Attorneys can view their own boosts
CREATE POLICY "Attorneys can view own boosts"
  ON attorney_boosts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM attorneys
      WHERE id = attorney_id AND user_id = auth.uid()
    )
  );
