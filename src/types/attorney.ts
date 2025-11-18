export interface AttorneyRecord {
  id: string;
  name: string;
  firm_name: string | null;
  state: string;
  city: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  specialties: string[];
  accepts_pro_bono: boolean;
  bar_number: string | null;
  years_experience: number | null;
  bio: string | null;
}
