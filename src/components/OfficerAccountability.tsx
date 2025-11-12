import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Search, Shield, Building2, AlertTriangle, TrendingUp, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  ACCOUNTABILITY_DATA,
  type AccountabilityAgency,
  type AccountabilityOfficer,
} from "@/lib/referenceData";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

type AccountabilityDataSource = "supabase" | "reference";

export function OfficerAccountability() {
  const { state: userState, loading: locationLoading } = useGeolocation();
  const [agencies, setAgencies] = useState<AccountabilityAgency[]>([]);
  const [officers, setOfficers] = useState<AccountabilityOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("agencies");
  const [dataSource, setDataSource] = useState<AccountabilityDataSource>("supabase");
  const referenceNoticeShown = useRef(false);

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
    } finally {
      setLoading(false);
    }
  };

  const showReferenceNotice = () => {
    if (!referenceNoticeShown.current) {
      toast.info(
        "Loaded accountability data compiled from The Washington Post fatal force database and public court records.",
        {
          duration: 6000,
        },
      );
      referenceNoticeShown.current = true;
    }
  };

  const applyAgencyReference = () => {
    const filtered =
      selectedState === "all"
        ? ACCOUNTABILITY_DATA.agencies
        : ACCOUNTABILITY_DATA.agencies.filter((agency) => agency.state === selectedState);
    setAgencies(filtered.length > 0 ? filtered : ACCOUNTABILITY_DATA.agencies);
    setDataSource("reference");
    showReferenceNotice();
  };

  const applyOfficerReference = () => {
    const filtered =
      selectedState === "all"
        ? ACCOUNTABILITY_DATA.officers
        : ACCOUNTABILITY_DATA.officers.filter((officer) => officer.agency?.state === selectedState);
    setOfficers(filtered.length > 0 ? filtered : ACCOUNTABILITY_DATA.officers);
    setDataSource("reference");
    showReferenceNotice();
  };

  const fetchAgencies = async () => {
    try {
      let query = supabase
        .from("agencies")
        .select("*")
        .order("total_complaints", { ascending: false });

      if (selectedState !== "all") {
        query = query.eq("state", selectedState);
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Falling back to reference agencies due to Supabase error:", error);
        applyAgencyReference();
        return;
      }

      if (!data || data.length === 0) {
        applyAgencyReference();
        return;
      }

      setAgencies(data as AccountabilityAgency[]);
      setDataSource("supabase");
    } catch (error) {
      console.error("Unexpected error fetching agencies:", error);
      applyAgencyReference();
    }
  };

  const fetchOfficers = async () => {
    try {
      let query = supabase
        .from("officers")
        .select(`
          *,
          agency:agencies(name, state)
        `)
        .order("total_violations", { ascending: false })
        .limit(100);

      if (selectedState !== "all") {
        query = query.eq("agencies.state", selectedState);
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Falling back to reference officers due to Supabase error:", error);
        applyOfficerReference();
        return;
      }

      if (!data || data.length === 0) {
        applyOfficerReference();
        return;
      }

      setOfficers(data as AccountabilityOfficer[]);
      setDataSource("supabase");
    } catch (error) {
      console.error("Unexpected error fetching officers:", error);
      applyOfficerReference();
    }
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
      officer.rank?.toLowerCase().includes(searchLower) ||
      officer.status_summary?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <section id="accountability" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            Officer &amp; Agency Accountability
          </h2>
          <p className="text-muted-foreground text-lg">
            Track patterns of misconduct across law enforcement agencies and high-profile officer cases
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
                    placeholder="Search by agency, officer, or case"
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
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {dataSource === "reference" && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-100">
            <AlertCircle className="h-4 w-4" />
            Displaying accountability data sourced from The Washington Post fatal force database and documented court outcomes.
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="agencies">
              <Building2 className="h-4 w-4 mr-2" />
              Agencies
            </TabsTrigger>
            <TabsTrigger value="officers">
              <Shield className="h-4 w-4 mr-2" />
              Officer Cases
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
                  <Card key={agency.id} className={agency.total_complaints > 50 ? "border-red-500" : ""}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base leading-tight">{agency.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {agency.city && `${agency.city}, `}
                            {agency.state}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Badge variant="outline">{agency.agency_type}</Badge>

                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Fatal shootings (2015-present):</span>
                          <span className="font-bold flex items-center gap-1">
                            {agency.total_complaints}
                            {agency.total_complaints >= 50 && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Recent settlements (USD):</span>
                          <span className="font-bold text-red-600">
                            {agency.total_settlements_paid > 0
                              ? `$${agency.total_settlements_paid.toLocaleString()}`
                              : "Not publicly reported"}
                          </span>
                        </div>
                      </div>

                      {agency.data_notes && (
                        <p className="text-xs text-muted-foreground">
                          {agency.data_notes}
                        </p>
                      )}

                      {agency.source_url && (
                        <a
                          href={agency.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View source methodology
                        </a>
                      )}

                      {agency.total_complaints >= 75 && (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-red-600 mt-0.5" />
                            <div className="text-xs text-red-900 dark:text-red-200">
                              <strong>Pattern alert:</strong> This department records one of the highest
                              totals of fatal force incidents nationally.
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
              <div className="text-center py-12">Loading officer cases...</div>
            ) : filteredOfficers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No officer cases found. Cases will appear when linked to accountability reports.
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
                              : "Officer"}
                          </CardTitle>
                          {officer.badge_number && (
                            <CardDescription>Badge #{officer.badge_number}</CardDescription>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {officer.rank && <Badge variant="outline">{officer.rank}</Badge>}

                      {officer.agency && (
                        <div className="text-sm text-muted-foreground">
                          {officer.agency.name} ({officer.agency.state})
                        </div>
                      )}

                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Documented complaints or major incidents:</span>
                          <span className="font-bold flex items-center gap-1">
                            {officer.total_violations}
                            {officer.total_violations > 3 && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </span>
                        </div>
                      </div>

                      {officer.status_summary && (
                        <p className="text-sm text-muted-foreground bg-muted/60 border rounded-lg p-3">
                          {officer.status_summary}
                        </p>
                      )}

                      {officer.source_url && (
                        <a
                          href={officer.source_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Read case coverage
                        </a>
                      )}

                      {officer.total_violations > 2 && (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-red-600 mt-0.5" />
                            <div className="text-xs text-red-900 dark:text-red-200">
                              <strong>Pattern alert:</strong> Multiple documented complaints indicate sustained
                              accountability concerns.
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
              Agency-level metrics reflect the number of fatal police shootings tracked by The Washington Post since 2015 and the
              most recent settlement totals reported by local governments.
            </p>
            <p>
              Officer case summaries highlight high-profile incidents with outcomes documented in court records or official
              statements. Presence in this list reflects public reporting and does not replace due process.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
