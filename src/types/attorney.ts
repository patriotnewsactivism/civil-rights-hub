export interface AttorneyRecord {
  id: string;
  name: string;
  firm: string | null;
  state: string;
  city: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  specialties: string[] | null;
  practice_areas: string[] | null;
  accepts_pro_bono: boolean | null;
  bar_number: string | null;
  years_experience: number | null;
  bio: string | null;
  rating: number | null;
  review_count: number | null;
  languages: string[] | null;
}
