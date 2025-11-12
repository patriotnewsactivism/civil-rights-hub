import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Search, MapPin, Mail, Phone, Globe, Scale } from "lucide-react";
import { toast } from "sonner";

interface Attorney {
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
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [proBonoOnly, setProBonoOnly] = useState(false);

  useEffect(() => {
    if (userState && !locationLoading) {
      setSelectedState(userState);
    }
  }, [userState, locationLoading]);

  useEffect(() => {
    fetchAttorneys();
  }, [selectedState, selectedSpecialty, proBonoOnly]);

  const fetchAttorneys = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('attorneys')
        .select('*')
        .order('name');

      if (selectedState !== "all") {
        query = query.eq('state', selectedState);
      }

      if (proBonoOnly) {
        query = query.eq('accepts_pro_bono', true);
      }

      if (selectedSpecialty !== "all") {
        query = query.contains('specialties', [selectedSpecialty]);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAttorneys(data || []);
    } catch (error) {
      console.error('Error fetching attorneys:', error);
      toast.error("Failed to load attorneys");
    } finally {
      setLoading(false);
    }
  };

  const filteredAttorneys = attorneys.filter((attorney) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      attorney.name.toLowerCase().includes(searchLower) ||
      attorney.firm_name?.toLowerCase().includes(searchLower) ||
      attorney.city?.toLowerCase().includes(searchLower)
    );
  });

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
