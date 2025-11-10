import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Search, Briefcase, MapPin, Phone, Mail, Globe, Loader2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";

interface Attorney {
  id: string;
  name: string;
  firm: string | null;
  state: string;
  city: string | null;
  practice_areas: string[];
  specialties: string[] | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  bio: string | null;
  rating: number | null;
  review_count: number;
  accepts_pro_bono: boolean;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "National"
];

const PRACTICE_AREAS = [
  "Civil Rights",
  "Police Accountability",
  "First Amendment",
  "Press Freedom",
  "Protest Rights",
  "Voting Rights",
  "FOIA",
  "Police Misconduct",
  "Class Action",
  "Employment Discrimination",
  "Housing Discrimination"
];

export const LawyerFinder = () => {
  const { toast } = useToast();
  const location = useGeolocation();
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<string>("");
  const [showProBonoOnly, setShowProBonoOnly] = useState(false);

  useEffect(() => {
    if (location.state && !selectedState) {
      setSelectedState(location.state);
    }
  }, [location.state]);

  useEffect(() => {
    fetchAttorneys();
  }, [selectedState, selectedPracticeArea, showProBonoOnly]);

  const fetchAttorneys = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("attorneys")
        .select("*")
        .order("rating", { ascending: false, nullsFirst: false })
        .order("name");

      if (selectedState) {
        query = query.or(`state.eq.${selectedState},state.eq.National`);
      }

      if (selectedPracticeArea) {
        query = query.contains("practice_areas", [selectedPracticeArea]);
      }

      if (showProBonoOnly) {
        query = query.eq("accepts_pro_bono", true);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter by search query if present
      let filteredData = data || [];
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (att) =>
            att.name.toLowerCase().includes(lowerQuery) ||
            att.firm?.toLowerCase().includes(lowerQuery) ||
            att.bio?.toLowerCase().includes(lowerQuery)
        );
      }

      setAttorneys(filteredData);
    } catch (error) {
      console.error("Error fetching attorneys:", error);
      toast({
        title: "Failed to load attorneys",
        description: "Unable to fetch attorney directory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAttorneys();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedPracticeArea("");
    setShowProBonoOnly(false);
  };

  return (
    <section id="lawyer-finder" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find a Civil Rights Attorney
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search our directory of civil rights attorneys and legal organizations specializing
            in police accountability, First Amendment rights, and civil liberties.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search and Filters */}
          <Card className="shadow-strong">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Search & Filter
              </CardTitle>
              <CardDescription>
                Find attorneys by name, location, or practice area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-full md:col-span-2">
                  <Input
                    placeholder="Search by name, firm, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full"
                  />
                </div>

                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All States</SelectItem>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedPracticeArea} onValueChange={setSelectedPracticeArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Practice Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Practice Areas</SelectItem>
                    {PRACTICE_AREAS.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="proBono"
                    checked={showProBonoOnly}
                    onChange={(e) => setShowProBonoOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="proBono" className="text-sm text-muted-foreground cursor-pointer">
                    Pro Bono Available
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button size="sm" onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : attorneys.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No attorneys found matching your criteria. Try adjusting your filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground">
                Found {attorneys.length} {attorneys.length === 1 ? "attorney" : "attorneys"}
              </p>

              {attorneys.map((attorney) => (
                <Card key={attorney.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Main Info */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {attorney.name}
                          </h3>
                          {attorney.firm && (
                            <p className="text-muted-foreground flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              {attorney.firm}
                            </p>
                          )}
                        </div>

                        {attorney.bio && (
                          <p className="text-sm text-muted-foreground">{attorney.bio}</p>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {attorney.practice_areas.map((area) => (
                            <Badge key={area} variant="secondary">
                              {area}
                            </Badge>
                          ))}
                          {attorney.specialties?.map((specialty) => (
                            <Badge key={specialty} variant="outline">
                              {specialty}
                            </Badge>
                          ))}
                          {attorney.accepts_pro_bono && (
                            <Badge variant="default" className="bg-green-600">
                              Pro Bono Available
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{attorney.city ? `${attorney.city}, ${attorney.state}` : attorney.state}</span>
                        </div>

                        {attorney.rating && (
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span>
                              {attorney.rating.toFixed(1)} ({attorney.review_count} reviews)
                            </span>
                          </div>
                        )}

                        {attorney.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-primary" />
                            <a href={`tel:${attorney.phone}`} className="text-primary hover:underline">
                              {attorney.phone}
                            </a>
                          </div>
                        )}

                        {attorney.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-primary" />
                            <a href={`mailto:${attorney.email}`} className="text-primary hover:underline">
                              {attorney.email}
                            </a>
                          </div>
                        )}

                        {attorney.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-primary" />
                            <a
                              href={attorney.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
