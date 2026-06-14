import rawData from "@/data/attorneyFallbackData.json";
import { AttorneyRecord } from "@/types/attorney";

// The fallback JSON uses firm_name; AttorneyRecord expects firm.
export const ATTORNEY_FALLBACK_DATA: AttorneyRecord[] = (rawData as Record<string, unknown>[]).map((item) => ({
  id: item.id as string,
  name: item.name as string,
  firm: (item.firm ?? item.firm_name ?? null) as string | null,
  state: item.state as string,
  city: (item.city ?? null) as string | null,
  email: (item.email ?? null) as string | null,
  phone: (item.phone ?? null) as string | null,
  website: (item.website ?? null) as string | null,
  specialties: (item.specialties ?? null) as string[] | null,
  practice_areas: (item.practice_areas ?? []) as string[],
  accepts_pro_bono: (item.accepts_pro_bono ?? null) as boolean | null,
  bar_number: (item.bar_number ?? null) as string | null,
  years_experience: (item.years_experience ?? null) as number | null,
  bio: (item.bio ?? null) as string | null,
  rating: (item.rating ?? null) as number | null,
  review_count: (item.review_count ?? null) as number | null,
  languages: (item.languages ?? null) as string[] | null,
  is_verified: (item.is_verified ?? null) as boolean | null,
  notable_cases: (item.notable_cases ?? null) as string[] | null,
  professional_bio: (item.professional_bio ?? null) as string | null,
}));
