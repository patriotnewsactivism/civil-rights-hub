import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Search, Shield, Building2, AlertTriangle, TrendingUp, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Agency {
  id: string;
  name: string;
  agency_type: string;
  state: string;
  city: string | null;
  total_complaints: number;
  total_settlements_paid: number;
}

interface Officer {
  id: string;
  badge_number: string | null;
  first_name: string | null;
  last_name: string | null;
  rank: string | null;
  total_violations: number;
  agency: {
    name: string;
    state: string;
  } | null;
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

export function OfficerAccountability() {
  const { state: userState, loading: locationLoading } = useGeolocation();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("agencies");

  useEffect(() => {
    if (userState && !locationLoading) {
      setSelectedState(userState);
    }
  }, [userState, locationLoading]);

  useEffect(() => {
    fetchData();
  }, [selectedState, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "agencies") {
        await fetchAgencies();
      } else {
        await fetchOfficers();
      }
    } catch (error) {
      console.error('Error fetching accountability data:', error);
      toast.error("Failed to load accountability data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencies = async () => {
    let query = supabase
      .from('agencies')
      .select('*')
      .order('total_complaints', { ascending: false });

    if (selectedState !== "all") {
      query = query.eq('state', selectedState);
    }

    const { data, error } = await query;
    if (error) throw error;
    setAgencies(data || []);
  };

  const fetchOfficers = async () => {
    let query = supabase
      .from('officers')
      .select(`
        *,
        agency:agencies(name, state)
      `)
      .order('total_violations', { ascending: false })
      .limit(100);

    if (selectedState !== "all") {
      query = query.eq('agencies.state', selectedState);
    }

    const { data, error } = await query;
    if (error) throw error;
    setOfficers(data || []);
  };

  const filteredAgencies = agencies.filter((agency) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      agency.name.toLowerCase().includes(searchLower) ||
      agency.city?.toLowerCase().includes(searchLower) ||
      agency.agency_type.toLowerCase().includes(searchLower)
    );
  });

  const filteredOfficers = officers.filter((officer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      officer.first_name?.toLowerCase().includes(searchLower) ||
      officer.last_name?.toLowerCase().includes(searchLower) ||
      officer.badge_number?.toLowerCase().includes(searchLower) ||
      officer.rank?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <section id="accountability" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            Officer & Agency Accountability
          </h2>
          <p className="text-muted-foreground text-lg">
            Track patterns of misconduct across law enforcement agencies and individual officers
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, badge, location..."
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
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="agencies">
              <Building2 className="h-4 w-4 mr-2" />
              Agencies
            </TabsTrigger>
            <TabsTrigger value="officers">
              <Shield className="h-4 w-4 mr-2" />
              Officers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agencies" className="mt-6">
            {loading ? (
              <div className="text-center py-12">Loading agencies...</div>
            ) : filteredAgencies.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No agencies found. Try adjusting your filters.
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgencies.map((agency) => (
                  <Card key={agency.id} className={agency.total_complaints > 10 ? "border-red-500" : ""}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base leading-tight">{agency.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {agency.city && `${agency.city}, `}{agency.state}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Badge variant="outline">{agency.agency_type}</Badge>

                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Complaints:</span>
                          <span className="font-bold flex items-center gap-1">
                            {agency.total_complaints}
                            {agency.total_complaints > 10 && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </span>
                        </div>

                        {agency.total_settlements_paid > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Settlements Paid:</span>
                            <span className="font-bold text-red-600">
                              ${agency.total_settlements_paid.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {agency.total_complaints > 5 && (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-red-600 mt-0.5" />
                            <div className="text-xs text-red-900 dark:text-red-200">
                              <strong>Pattern Alert:</strong> This agency has multiple complaints on record.
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="officers" className="mt-6">
            {loading ? (
              <div className="text-center py-12">Loading officers...</div>
            ) : filteredOfficers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No officers found. Officers will appear here when linked to violation reports.
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOfficers.map((officer) => (
                  <Card key={officer.id} className={officer.total_violations > 3 ? "border-red-500" : ""}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base">
                            {officer.first_name && officer.last_name
                              ? `${officer.first_name} ${officer.last_name}`
                              : 'Officer'}
                          </CardTitle>
                          {officer.badge_number && (
                            <CardDescription>Badge #{officer.badge_number}</CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {officer.rank && (
                        <Badge variant="outline">{officer.rank}</Badge>
                      )}

                      {officer.agency && (
                        <div className="text-sm text-muted-foreground">
                          {officer.agency.name}
                        </div>
                      )}

                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Linked Violations:</span>
                          <span className="font-bold flex items-center gap-1">
                            {officer.total_violations}
                            {officer.total_violations > 3 && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </span>
                        </div>
                      </div>

                      {officer.total_violations > 2 && (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-red-600 mt-0.5" />
                            <div className="text-xs text-red-900 dark:text-red-200">
                              <strong>Pattern Alert:</strong> This officer has multiple violation reports on record.
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>About This Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              This accountability database tracks patterns of misconduct by linking violation reports
              to specific officers and agencies. Data is sourced from user-submitted reports.
            </p>
            <p className="text-muted-foreground">
              <strong>Note:</strong> The presence of an officer or agency in this database does not
              constitute proof of wrongdoing. This is a community resource for documenting patterns
              and should be used in conjunction with official records and legal advice.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
