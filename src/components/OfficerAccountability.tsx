import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Shield,
  AlertTriangle,
  Building2,
  ChevronRight,
  ExternalLink,
  MapPin,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Officer {
  id: string;
  name: string;
  badge_number?: string | null;
  department?: string | null;
  rank?: string | null;
  state?: string | null;
  complaint_count?: number;
  last_incident?: string | null;
}

interface Agency {
  id: string;
  name: string;
  state?: string | null;
  city?: string | null;
  type?: string | null;
  violation_count?: number;
}

interface ViolationWithOfficer {
  id: string;
  title: string;
  location_state: string;
  location_city: string | null;
  incident_date: string;
  officer_name?: string | null;
  agency_name?: string | null;
}

export function OfficerAccountability() {
  const [activeTab, setActiveTab] = useState<"officers" | "agencies" | "violations">("violations");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [violations, setViolations] = useState<ViolationWithOfficer[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  const US_STATES = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
    "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
    "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
    "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
    "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
    "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
    "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
    "Wisconsin","Wyoming",
  ];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let vQuery = supabase
        .from("violations")
        .select("id, title, location_state, location_city, incident_date, officer_name, agency_name")
        .order("incident_date", { ascending: false })
        .limit(50);
      if (stateFilter !== "all") vQuery = vQuery.eq("location_state", stateFilter);
      if (search) vQuery = vQuery.ilike("title", `%${search}%`);

      const [vRes, oRes, aRes] = await Promise.all([
        vQuery,
        supabase.from("officers").select("*").limit(50),
        supabase.from("agencies").select("*").limit(50),
      ]);

      setViolations(vRes.data ?? []);

      // Build officer list — from DB or synthesize from violations
      if ((oRes.data ?? []).length > 0) {
        setOfficers(oRes.data as Officer[]);
      } else {
        const officerMap = new Map<string, Officer>();
        (vRes.data ?? []).forEach((v: ViolationWithOfficer) => {
          if (v.officer_name) {
            const key = v.officer_name.toLowerCase();
            if (!officerMap.has(key)) {
              officerMap.set(key, {
                id: key,
                name: v.officer_name,
                department: v.agency_name,
                state: v.location_state,
                complaint_count: 1,
                last_incident: v.incident_date,
              });
            } else {
              const existing = officerMap.get(key)!;
              existing.complaint_count = (existing.complaint_count ?? 0) + 1;
            }
          }
        });
        setOfficers(Array.from(officerMap.values()).sort((a, b) => (b.complaint_count ?? 0) - (a.complaint_count ?? 0)));
      }

      // Build agency list
      if ((aRes.data ?? []).length > 0) {
        setAgencies(aRes.data as Agency[]);
      } else {
        const agencyMap = new Map<string, Agency>();
        (vRes.data ?? []).forEach((v: ViolationWithOfficer) => {
          if (v.agency_name) {
            const key = v.agency_name.toLowerCase();
            if (!agencyMap.has(key)) {
              agencyMap.set(key, {
                id: key,
                name: v.agency_name,
                state: v.location_state,
                city: v.location_city,
                violation_count: 1,
              });
            } else {
              agencyMap.get(key)!.violation_count! += 1;
            }
          }
        });
        setAgencies(Array.from(agencyMap.values()).sort((a, b) => (b.violation_count ?? 0) - (a.violation_count ?? 0)));
      }
    } finally {
      setLoading(false);
    }
  }, [search, stateFilter]);

  useEffect(() => { void loadData(); }, [loadData]);

  const tabClass = (t: typeof activeTab) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
      activeTab === t
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    }`;

  return (
    <section id="accountability" className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Officer &amp; Agency Accountability</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Searchable database of violations, departments, and reported officers. Every entry is sourced from reported incidents.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button className={tabClass("violations")} onClick={() => setActiveTab("violations")}>
              Violations
            </button>
            <button className={tabClass("officers")} onClick={() => setActiveTab("officers")}>
              Officers
            </button>
            <button className={tabClass("agencies")} onClick={() => setActiveTab("agencies")}>
              Agencies
            </button>
          </div>
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-3.5 w-3.5 mr-1" />
                <SelectValue placeholder="All states" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                {US_STATES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : (
          <>
            {activeTab === "violations" && (
              <div className="grid gap-3">
                {violations.length === 0 ? (
                  <Card><CardContent className="py-10 text-center text-muted-foreground">No violations found. Be the first to report one.</CardContent></Card>
                ) : (
                  violations.map((v) => (
                    <Card key={v.id} className="border-border/60 hover:border-primary/40 transition-all">
                      <CardContent className="p-4 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-sm leading-snug">{v.title}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {v.location_city ? `${v.location_city}, ` : ""}{v.location_state}
                              </span>
                              {v.agency_name && (
                                <Badge variant="outline" className="text-[10px]">{v.agency_name}</Badge>
                              )}
                              {v.officer_name && (
                                <Badge variant="secondary" className="text-[10px]">Officer: {v.officer_name}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(v.incident_date).toLocaleDateString()}
                        </span>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === "officers" && (
              <div className="grid gap-3">
                {officers.length === 0 ? (
                  <Card><CardContent className="py-10 text-center text-muted-foreground">No officer records yet. Officers are added when violations are reported with badge/name information.</CardContent></Card>
                ) : (
                  officers.map((o) => (
                    <Card key={o.id} className="border-border/60 hover:border-primary/40 transition-all">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{o.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {o.department ?? "Unknown department"} · {o.state ?? ""}
                              {o.badge_number ? ` · Badge #${o.badge_number}` : ""}
                            </p>
                          </div>
                        </div>
                        {(o.complaint_count ?? 0) > 0 && (
                          <Badge variant="destructive" className="flex-shrink-0">
                            {o.complaint_count} report{(o.complaint_count ?? 0) !== 1 ? "s" : ""}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === "agencies" && (
              <div className="grid gap-3">
                {agencies.length === 0 ? (
                  <Card><CardContent className="py-10 text-center text-muted-foreground">No agency records yet.</CardContent></Card>
                ) : (
                  agencies.map((a) => (
                    <Card key={a.id} className="border-border/60 hover:border-primary/40 transition-all">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{a.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {a.city ? `${a.city}, ` : ""}{a.state ?? ""} · {a.type ?? "Law Enforcement"}
                            </p>
                          </div>
                        </div>
                        {(a.violation_count ?? 0) > 0 && (
                          <Badge variant="destructive" className="flex-shrink-0">
                            {a.violation_count} violation{(a.violation_count ?? 0) !== 1 ? "s" : ""}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-center">
          <Button variant="outline" asChild>
            <a href="/do-this-now#report">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Report a Violation
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
