import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Search, MapPin, Video, ExternalLink, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Activist {
  id: string;
  name: string;
  alias: string | null;
  primary_platform: string | null;
  channel_url: string | null;
  focus_areas: string[];
  home_state: string | null;
  profile_image_url: string | null;
  bio: string | null;
  verified: boolean;
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

const FOCUS_AREAS = [
  "First Amendment Audits",
  "Police Accountability",
  "Court Filming",
  "Public Records Requests",
  "Constitutional Rights Education",
  "Protest Documentation",
  "Government Transparency",
  "Civil Rights Litigation",
  "Investigative Journalism"
];

export function ActivistDirectory() {
  const { state: userState, loading: locationLoading } = useGeolocation();
  const [activists, setActivists] = useState<Activist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedFocus, setSelectedFocus] = useState<string>("all");

  const fetchActivists = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('activists')
        .select('*')
        .eq('verified', true)
        .order('name');

      if (selectedState !== "all") {
        query = query.eq('home_state', selectedState);
      }

      if (selectedFocus !== "all") {
        query = query.contains('focus_areas', [selectedFocus]);
      }

      const { data, error } = await query;

      if (error) throw error;
      setActivists(data || []);
    } catch (error) {
      console.error('Error fetching activists:', error);
      toast.error("Failed to load activists");
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedFocus]);

  useEffect(() => {
    if (userState && !locationLoading) {
      setSelectedState(userState);
    }
  }, [userState, locationLoading]);

  useEffect(() => {
    void fetchActivists();
  }, [fetchActivists]);

  const filteredActivists = activists.filter((activist) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      activist.name.toLowerCase().includes(searchLower) ||
      activist.alias?.toLowerCase().includes(searchLower) ||
      activist.primary_platform?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <section id="activist-directory" className="py-20 bg-background">
      <div className="container mx-auto px-4 space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Video className="h-8 w-8" />
            Community Watchdogs & Activists
          </h2>
          <p className="text-muted-foreground">
            First Amendment auditors and civil rights activists documenting accountability in real-time
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Name, platform..."
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
                <label className="text-sm font-medium mb-2 block">Focus Area</label>
                <Select value={selectedFocus} onValueChange={setSelectedFocus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Focus Areas</SelectItem>
                    {FOCUS_AREAS.map((area) => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">Loading activists...</div>
        ) : filteredActivists.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No activists found matching your criteria. Try adjusting your filters.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActivists.map((activist) => (
              <Card key={activist.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {activist.profile_image_url ? (
                      <img
                        src={activist.profile_image_url}
                        alt={activist.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Video className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {activist.name}
                        {activist.verified && (
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </CardTitle>
                      {activist.alias && (
                        <p className="text-sm text-muted-foreground">"{activist.alias}"</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activist.home_state && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{activist.home_state}</span>
                    </div>
                  )}

                  {activist.focus_areas && activist.focus_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {activist.focus_areas.map((area, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {activist.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{activist.bio}</p>
                  )}

                  {activist.primary_platform && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Platform: </span>
                      <span className="font-medium">{activist.primary_platform}</span>
                    </div>
                  )}

                  {activist.channel_url && (
                    <a
                      href={activist.channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline pt-2 border-t"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Channel
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
