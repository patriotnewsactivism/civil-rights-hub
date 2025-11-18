export interface ScannerLinkRecord {
  id: string;
  state: string;
  state_code: string;
  city: string | null;
  county: string | null;
  scanner_name: string;
  description: string | null;
  frequency: string | null;
  broadcastify_url: string | null;
  scanner_radio_url: string | null;
  other_url: string | null;
  link_type: string;
  listener_count: number | null;
  is_active: boolean;
  notes: string | null;
}
