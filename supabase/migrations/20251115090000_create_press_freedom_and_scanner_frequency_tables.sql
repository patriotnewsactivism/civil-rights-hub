-- Add high-fidelity tables for offline scanner frequency data and press-freedom incidents

-- Physical/offline scanner resources to complement Broadcastify feeds
CREATE TABLE IF NOT EXISTS public.scanner_frequencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  state TEXT NOT NULL,
  state_code TEXT NOT NULL,
  city TEXT,
  county TEXT,
  service_description TEXT,
  frequency_mhz NUMERIC(9,4),
  modulation TEXT NOT NULL,
  nac_code TEXT,
  ctcss_dcs_code TEXT,
  trunked_system TEXT,
  talkgroup_id TEXT,
  system_type TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('broadcastify', 'scanner_radio', 'official', 'fcc', 'community', 'other')),
  source_url TEXT NOT NULL,
  verified_at TIMESTAMPTZ,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (agency_name, channel_name)
);

CREATE INDEX IF NOT EXISTS idx_scanner_frequencies_state_code ON public.scanner_frequencies(state_code);
CREATE INDEX IF NOT EXISTS idx_scanner_frequencies_agency ON public.scanner_frequencies(agency_name);
CREATE INDEX IF NOT EXISTS idx_scanner_frequencies_frequency ON public.scanner_frequencies(frequency_mhz);
CREATE INDEX IF NOT EXISTS idx_scanner_frequencies_active ON public.scanner_frequencies(is_active) WHERE is_active = true;

ALTER TABLE public.scanner_frequencies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view scanner frequencies" ON public.scanner_frequencies;
CREATE POLICY "Anyone can view scanner frequencies"
  ON public.scanner_frequencies
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role manages scanner frequencies" ON public.scanner_frequencies;
CREATE POLICY "Service role manages scanner frequencies"
  ON public.scanner_frequencies
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

DROP TRIGGER IF EXISTS update_scanner_frequencies_updated_at ON public.scanner_frequencies;
CREATE TRIGGER update_scanner_frequencies_updated_at
  BEFORE UPDATE ON public.scanner_frequencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Structured press-freedom incident tracking
CREATE TABLE IF NOT EXISTS public.press_freedom_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_date DATE NOT NULL,
  location_state TEXT NOT NULL,
  location_city TEXT,
  location_county TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  target_type TEXT NOT NULL CHECK (target_type IN ('journalist', 'newsroom', 'activist', 'legal_observer', 'legal_team', 'other')),
  violation_type TEXT NOT NULL CHECK (violation_type IN ('arrest', 'detention', 'assault', 'equipment_seized', 'credential_revoked', 'charges_filed', 'tear_gas_or_pepper_spray', 'threat', 'other')),
  agency_involved TEXT,
  description TEXT NOT NULL,
  external_case_id TEXT,
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('us_press_freedom_tracker', 'freedom_of_the_press_foundation', 'nppa', 'aclu', 'newsroom', 'other')),
  verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'unverified', 'disputed')),
  verified_at TIMESTAMPTZ,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (incident_date, target_type, source_url)
);

CREATE INDEX IF NOT EXISTS idx_press_freedom_incidents_date ON public.press_freedom_incidents(incident_date DESC);
CREATE INDEX IF NOT EXISTS idx_press_freedom_incidents_state ON public.press_freedom_incidents(location_state);
CREATE INDEX IF NOT EXISTS idx_press_freedom_incidents_violation ON public.press_freedom_incidents(violation_type);
CREATE INDEX IF NOT EXISTS idx_press_freedom_incidents_target ON public.press_freedom_incidents(target_type);

ALTER TABLE public.press_freedom_incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view press freedom incidents" ON public.press_freedom_incidents;
CREATE POLICY "Anyone can view press freedom incidents"
  ON public.press_freedom_incidents
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role manages press freedom incidents" ON public.press_freedom_incidents;
CREATE POLICY "Service role manages press freedom incidents"
  ON public.press_freedom_incidents
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

DROP TRIGGER IF EXISTS update_press_freedom_incidents_updated_at ON public.press_freedom_incidents;
CREATE TRIGGER update_press_freedom_incidents_updated_at
  BEFORE UPDATE ON public.press_freedom_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
