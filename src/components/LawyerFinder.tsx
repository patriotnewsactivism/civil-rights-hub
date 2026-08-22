import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION } from "@/data/usStates";
import { Search, MapPin, Mail, Phone, Globe, Scale, Database } from "lucide-react";
import { toast } from "sonner";
import { AttorneyRecord } from "@/types/attorney";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const SPECIALTIES = [
  "Constitutional Law",
  "Police Misconduct",
  "First Amendment",
  "FOIA/Public Records",
  "Civil Rights Litigation",
  "Criminal Defense",
  "Excessive Force",
  "Wrongful Arrest",
  "Prison Rights",
  "Voting Rights"
];

export function LawyerFinder() {
  const { state: jurisdictionState } = useJurisdiction();
  const [attorneys, setAttorneys] = useState<AttorneyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [proBonoOnly, setProBonoOnly] = useState(false);
  const [directoryStatus, setDirectoryStatus] = useState<"none" | "empty" | "error">("none");

  const fetchAttorneys = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("attorneys")
        .select("id, name, firm, state, city, email, phone, website, specialties, practice_areas, accepts_pro_bono, bar_number, years_experience, bio, rating, is_verified")
        .eq("is_verified", true)
        .order("name");

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: AttorneyRecord[] = data.map((row) => ({
          id: row.id,
          name: row.name,
          firm: row.firm,
          state: row.state,
          city: row.city,
          email: row.email,
          phone: row.phone,
          website: row.website,
          specialties: row.specialties ?? [],
          practice_areas: row.practice_areas ?? [],
          accepts_pro_bono: row.accepts_pro_bono ?? false,
          bar_number: row.bar_number,
          years_experience: row.years_experience,
          bio: row.bio,
          rating: row.rating ?? null,
          review_count: null,
          languages: null,
          is_verified: row.is_verified ?? null,
          notable_cases: null,
          professional_bio: null,
        }));
        setAttorneys(mapped);
        setDirectoryStatus("none");
      } else {
        setAttorneys([]);
        setDirectoryStatus("empty");
      }
    } catch (error) {
      console.error("Error fetching source-verified attorneys:", error);
      setAttorneys([]);
      setDirectoryStatus("error");
      toast.error("Verified attorney directory unavailable", {
        description: "Unverified fallback records are intentionally not being shown.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (jurisdictionState && jurisdictionState !== DEFAULT_JURISDICTION) {
      setSelectedState(jurisdictionState);
    } else {
      setSelectedState("all");
    }
  }, [jurisdictionState]);

  useEffect(() => {
    void fetchAttorneys();
  }, [fetchAttorneys]);

  const filteredAttorneys = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    const NATIONAL_STATES = ["National", "Nationwide", "national", "nationwide"];

    return attorneys.filter((attorney) => {
      if (selectedState !== "all" && attorney.state !== selectedState && !NATIONAL_STATES.includes(attorney.state)) {
        return false;
      }

      if (proBonoOnly && !attorney.accepts_pro_bono) {
        return false;
      }

      if (
        selectedSpecialty !== "all" &&
        !attorney.specialties?.some(
          (specialty) => specialty.toLowerCase() === selectedSpecialty.toLowerCase(),
        )
      ) {
        return false;
      }

      if (!searchLower) {
        return true;
      }

      const firmMatch = attorney.firm?.toLowerCase().includes(searchLower);
      const cityMatch = attorney.city?.toLowerCase().includes(searchLower);
      const stateMatch = attorney.state.toLowerCase().includes(searchLower);

      return (
        attorney.name.toLowerCase().includes(searchLower) ||
        firmMatch ||
        cityMatch ||
        stateMatch
      );
    });
  }, [attorneys, proBonoOnly, searchTerm, selectedSpecialty, selectedState]);

  return (
    <section id="find-attorney" className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Scale className="h-8 w-8" />
          Civil Rights Attorney Directory
        </h2>
        <p className="text-muted-foreground">
          Find civil rights attorneys whose directory records have current source evidence. Always confirm representation, licensing, and availability directly before relying on a listing.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Name, firm, city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {SPECIALTIES.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Pro Bono</label>
              <Button
                variant={proBonoOnly ? "default" : "outline"}
                className="w-full"
                onClick={() => setProBonoOnly(!proBonoOnly)}
              >
                {proBonoOnly ? "Pro Bono Only" : "All Attorneys"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {directoryStatus !== "none" && (
        <Alert className="border-dashed">
          <Database className="h-4 w-4" />
          <AlertTitle>
            {directoryStatus === "error"
              ? "Verified attorney directory temporarily unavailable"
              : "Verified attorney directory is being rebuilt"}
          </AlertTitle>
          <AlertDescription>
            Civil Rights Hub is re-verifying attorney records against durable source evidence. Legacy seed records without that evidence are intentionally hidden rather than presented as verified.
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-12">Loading source-verified attorneys...</div>
      ) : filteredAttorneys.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Scale className="h-10 w-10 text-muted-foreground/40 mx-auto" />
            <div>
              <p className="font-semibold text-foreground">No source-verified attorneys match your current filters</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try broadening your search, or use an official legal-organization intake page while this directory is re-verified.
              </p>
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              {selectedState !== "all" && (
                <Button variant="outline" size="sm" onClick={() => setSelectedState("all")}>
                  Clear state filter
                </Button>
              )}
              {selectedSpecialty !== "all" && (
                <Button variant="outline" size="sm" onClick={() => setSelectedSpecialty("all")}>
                  Clear specialty filter
                </Button>
              )}
              {proBonoOnly && (
                <Button variant="outline" size="sm" onClick={() => setProBonoOnly(false)}>
                  Show all (not just pro bono)
                </Button>
              )}
              {searchTerm && (
                <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              You can also use the official{" "}
              <a href="https://www.aclu.org/about/contact-us" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                ACLU contact page
              </a>{" "}
              or{" "}
              <a href="https://www.nlg.org/contact/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                National Lawyers Guild contact page
              </a>.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredAttorneys.map((attorney) => (
            <Card key={attorney.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{attorney.name}</CardTitle>
                    {attorney.firm && (
                      <p className="text-sm text-muted-foreground mt-1">{attorney.firm}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">Source Verified</Badge>
                    {attorney.accepts_pro_bono && (
                      <Badge variant="secondary">Pro Bono</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {attorney.city && attorney.state && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{attorney.city}, {attorney.state}</span>
                  </div>
                )}

                {attorney.specialties && attorney.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {attorney.specialties.map((specialty, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                )}

                {attorney.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{attorney.bio}</p>
                )}

                {attorney.years_experience && (
                  <p className="text-sm text-muted-foreground">
                    {attorney.years_experience} years experience
                  </p>
                )}

                <div className="space-y-2 pt-2 border-t">
                  {attorney.email && (
                    <a
                      href={`mailto:${attorney.email}`}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {attorney.email}
                    </a>
                  )}
                  {attorney.phone && (
                    <a
                      href={`tel:${attorney.phone}`}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      {attorney.phone}
                    </a>
                  )}
                  {attorney.website && (
                    <a
                      href={attorney.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
