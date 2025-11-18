-- Create structured tables for press-freedom incidents and physical scanner frequency references

CREATE TABLE public.press_freedom_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_date DATE NOT NULL,
  state TEXT NOT NULL,
  city TEXT,
  location_description TEXT,
  target_name TEXT,
  outlet_name TEXT,
  target_type TEXT NOT NULL CHECK (target_type IN ('journalist', 'activist', 'legal_observer', 'media_outlet', 'other')),
  violation_type TEXT NOT NULL CHECK (
    violation_type IN ('arrest', 'detention', 'injury', 'equipment_seized', 'credential_revoked', 'threat', 'other')
  ),
  agency_involved TEXT,
  charges TEXT,
  description TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_org TEXT,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_press_freedom_incidents_date ON public.press_freedom_incidents(incident_date DESC);
CREATE INDEX idx_press_freedom_incidents_state ON public.press_freedom_incidents(state, city);

ALTER TABLE public.press_freedom_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view press freedom incidents"
  ON public.press_freedom_incidents
  FOR SELECT
  USING (true);

CREATE TRIGGER update_press_freedom_incidents_updated_at
  BEFORE UPDATE ON public.press_freedom_incidents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


CREATE TABLE public.scanner_frequencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  agency_name TEXT NOT NULL,
  agency_type TEXT,
  state TEXT NOT NULL,
  city TEXT,
  county TEXT,
  jurisdiction TEXT,
  frequency_mhz NUMERIC(8, 4) NOT NULL,
  modulation TEXT,
  nac_or_ctcss TEXT,
  trunked_system TEXT,
  talkgroup_id TEXT,
  encryption TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('broadcastify', 'scanner_radio', 'official', 'radio_reference', 'fcc_license')),
  source_url TEXT NOT NULL,
  notes TEXT,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scanner_frequencies_state ON public.scanner_frequencies(state, county, city);
CREATE INDEX idx_scanner_frequencies_agency ON public.scanner_frequencies(agency_name);
CREATE INDEX idx_scanner_frequencies_frequency ON public.scanner_frequencies(frequency_mhz);

ALTER TABLE public.scanner_frequencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view scanner frequencies"
  ON public.scanner_frequencies
  FOR SELECT
  USING (true);

CREATE TRIGGER update_scanner_frequencies_updated_at
  BEFORE UPDATE ON public.scanner_frequencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
