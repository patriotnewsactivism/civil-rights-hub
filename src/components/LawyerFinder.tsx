import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Search, MapPin, Mail, Phone, Globe, Scale, Database } from "lucide-react";
import { toast } from "sonner";
import { ATTORNEY_FALLBACK_DATA } from "@/lib/attorneyFallback";
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
  const { state: userState, loading: locationLoading } = useGeolocation();
  const [attorneys, setAttorneys] = useState<AttorneyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [proBonoOnly, setProBonoOnly] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchAttorneys = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("attorneys")
        .select("*")
        .order("name");

      if (error) throw error;

      if (data && data.length > 0) {
        setAttorneys(data as AttorneyRecord[]);
        setUsingFallback(false);
      } else {
        setAttorneys(ATTORNEY_FALLBACK_DATA);
        setUsingFallback(true);
      }
    } catch (error) {
      console.error("Error fetching attorneys:", error);
      setAttorneys(ATTORNEY_FALLBACK_DATA);
      setUsingFallback(true);
      toast.error("Failed to load attorneys", {
        description: "Showing verified fallback directory.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userState && !locationLoading) {
      setSelectedState(userState);
    }
  }, [userState, locationLoading]);

  useEffect(() => {
    void fetchAttorneys();
  }, [fetchAttorneys]);

  const filteredAttorneys = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return attorneys.filter((attorney) => {
      if (selectedState !== "all" && attorney.state !== selectedState) {
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

      const firmMatch = attorney.firm_name?.toLowerCase().includes(searchLower);
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
          Find experienced civil rights attorneys in your state, with emphasis on pro bono constitutional work
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

      {usingFallback && (
        <Alert className="border-dashed">
          <Database className="h-4 w-4" />
          <AlertTitle>Offline directory loaded</AlertTitle>
          <AlertDescription>
            Supabase data is unavailable, so we&rsquo;re showing the verified national and state
            attorney roster to keep search results available.
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-12">Loading attorneys...</div>
      ) : filteredAttorneys.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No attorneys found matching your criteria. Try adjusting your filters.
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
                    {attorney.firm_name && (
                      <p className="text-sm text-muted-foreground mt-1">{attorney.firm_name}</p>
                    )}
                  </div>
                  {attorney.accepts_pro_bono && (
                    <Badge variant="secondary">Pro Bono</Badge>
                  )}
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
