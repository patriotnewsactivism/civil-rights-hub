import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
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
  MapPin,
  Filter,
  FileText,
  Scale,
  Gavel,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VerifiedIncident {
  id: string;
  title: string;
  location_state: string;
  location_city: string | null;
  incident_date: string;
  officer_name: string | null;
  agency_name: string | null;
}

interface OfficerReference {
  id: string;
  name: string;
  agency: string | null;
  state: string;
  incidentCount: number;
}

interface AgencyReference {
  id: string;
  name: string;
  state: string;
  city: string | null;
  incidentCount: number;
}

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
];

export function OfficerAccountability() {
  const [activeTab, setActiveTab] = useState<"incidents" | "officers" | "agencies" | "brady">("incidents");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [incidents, setIncidents] = useState<VerifiedIncident[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("violations")
        .select("id, title, location_state, location_city, incident_date, officer_name, agency_name")
        .eq("status", "verified")
        .order("incident_date", { ascending: false })
        .limit(100);

      if (stateFilter !== "all") {
        query = query.eq("location_state", stateFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setIncidents((data ?? []) as VerifiedIncident[]);
    } catch (error) {
      console.error("Unable to load source-verified accountability data:", error);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  }, [stateFilter]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const visibleIncidents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return incidents;

    return incidents.filter((incident) =>
      [incident.title, incident.officer_name, incident.agency_name, incident.location_city, incident.location_state]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [incidents, search]);

  const officers = useMemo<OfficerReference[]>(() => {
    const officerMap = new Map<string, OfficerReference>();

    visibleIncidents.forEach((incident) => {
      if (!incident.officer_name) return;
      const key = `${incident.officer_name}|${incident.agency_name ?? ""}|${incident.location_state}`.toLowerCase();
      const existing = officerMap.get(key);
      if (existing) {
        existing.incidentCount += 1;
      } else {
        officerMap.set(key, {
          id: key,
          name: incident.officer_name,
          agency: incident.agency_name,
          state: incident.location_state,
          incidentCount: 1,
        });
      }
    });

    return Array.from(officerMap.values()).sort((a, b) => b.incidentCount - a.incidentCount || a.name.localeCompare(b.name));
  }, [visibleIncidents]);

  const agencies = useMemo<AgencyReference[]>(() => {
    const agencyMap = new Map<string, AgencyReference>();

    visibleIncidents.forEach((incident) => {
      if (!incident.agency_name) return;
      const key = `${incident.agency_name}|${incident.location_state}`.toLowerCase();
      const existing = agencyMap.get(key);
      if (existing) {
        existing.incidentCount += 1;
      } else {
        agencyMap.set(key, {
          id: key,
          name: incident.agency_name,
          state: incident.location_state,
          city: incident.location_city,
          incidentCount: 1,
        });
      }
    });

    return Array.from(agencyMap.values()).sort((a, b) => b.incidentCount - a.incidentCount || a.name.localeCompare(b.name));
  }, [visibleIncidents]);

  const tabClass = (tab: typeof activeTab) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
      activeTab === tab
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
          <p className="text-muted-foreground text-sm max-w-3xl">
            Source-verified incident records only. Officer and agency names appear here only when they are documented in a verified incident record; inclusion is not, by itself, a finding of misconduct or liability.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex flex-wrap gap-1 p-1 bg-muted rounded-lg">
            <button className={tabClass("incidents")} onClick={() => setActiveTab("incidents")}>
              Verified Incidents
            </button>
            <button className={tabClass("officers")} onClick={() => setActiveTab("officers")}>
              Named Officers
            </button>
            <button className={tabClass("agencies")} onClick={() => setActiveTab("agencies")}>
              Agencies
            </button>
            <button className={tabClass("brady")} onClick={() => setActiveTab("brady")}>
              Brady / Giglio
            </button>
          </div>

          {activeTab !== "brady" && (
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search verified records…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
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
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {loading && activeTab !== "brady" ? (
          <div className="grid gap-3">
            {[...Array(5)].map((_, index) => <Skeleton key={index} className="h-20 rounded-xl" />)}
          </div>
        ) : (
          <>
            {activeTab === "incidents" && (
              <div className="grid gap-3">
                {visibleIncidents.length === 0 ? (
                  <EmptyState text="No source-verified incidents match this search yet." />
                ) : (
                  visibleIncidents.map((incident) => (
                    <Card key={incident.id} className="border-border/60 hover:border-primary/40 transition-all">
                      <CardContent className="p-4 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-sm leading-snug">{incident.title}</p>
                              <Badge variant="outline" className="text-[10px]">Source Verified</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {incident.location_city ? `${incident.location_city}, ` : ""}{incident.location_state}
                              </span>
                              {incident.agency_name && (
                                <Badge variant="outline" className="text-[10px]">Agency named: {incident.agency_name}</Badge>
                              )}
                              {incident.officer_name && (
                                <Badge variant="secondary" className="text-[10px]">Officer named: {incident.officer_name}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(incident.incident_date).toLocaleDateString()}
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
                  <EmptyState text="No officer names appear in the matching source-verified incidents." />
                ) : (
                  officers.map((officer) => (
                    <Card key={officer.id} className="border-border/60 hover:border-primary/40 transition-all">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm">{officer.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {officer.agency ?? "Agency not recorded"} · {officer.state}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0">
                          {officer.incidentCount} verified reference{officer.incidentCount === 1 ? "" : "s"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === "agencies" && (
              <div className="grid gap-3">
                {agencies.length === 0 ? (
                  <EmptyState text="No agency names appear in the matching source-verified incidents." />
                ) : (
                  agencies.map((agency) => (
                    <Card key={agency.id} className="border-border/60 hover:border-primary/40 transition-all">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm">{agency.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {agency.city ? `${agency.city}, ` : ""}{agency.state}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0">
                          {agency.incidentCount} verified reference{agency.incidentCount === 1 ? "" : "s"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === "brady" && <BradyGiglioGuide />}
          </>
        )}

        <div className="mt-6 flex justify-center">
          <Button variant="outline" asChild>
            <a href="/do-this-now#report">
              <AlertTriangle className="h-4 w-4 mr-2 text-primary" />
              Submit an Incident Report
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Card>
      <CardContent className="py-10 text-center text-muted-foreground">{text}</CardContent>
    </Card>
  );
}

function BradyGiglioGuide() {
  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Brady and Giglio: the constitutional core</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <em>Brady v. Maryland</em> requires the prosecution to disclose material evidence favorable to the accused. Supreme Court decisions applying Brady also cover material impeachment evidence, including evidence that can bear on a government witness&apos;s credibility. Under <em>Kyles v. Whitley</em>, a prosecutor&apos;s Brady responsibility extends to favorable evidence known to others acting on the government&apos;s behalf in the case, including police.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A “Brady list,” “Giglio list,” or credibility-review process is an administrative practice used in some jurisdictions; there is no single nationwide list procedure or universal rule requiring every prosecutor&apos;s office to maintain the same kind of list. Federal DOJ policy governs federal prosecutors and federal investigative agencies; state and local practices vary.
          </p>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Documenting an officer credibility concern</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            {
              title: "Preserve first-hand evidence",
              desc: "Keep original video, photographs, documents, dates, locations, witness information, and the identity or badge number shown in the evidence. Preserve originals and avoid altering files.",
            },
            {
              title: "Use the agency complaint process",
              desc: "If appropriate, submit a factual complaint through the agency's official process and retain the confirmation or complaint number. Complaint procedures and public access to resulting records vary by jurisdiction.",
            },
            {
              title: "Provide documented information to counsel",
              desc: "If the officer is a witness in a criminal case, defense counsel can evaluate whether the information is relevant to discovery, impeachment, a Brady/Giglio request, or other litigation strategy.",
            },
            {
              title: "Contact the appropriate prosecutor carefully",
              desc: "A prosecutor's office may have a credibility-review or disclosure process. Submit factual, documented information rather than assuming that a specific list placement is legally required.",
            },
            {
              title: "Check certification or licensing channels",
              desc: "Many states use a POST board or another peace-officer standards/certification body. Names, jurisdiction, authority, and complaint procedures differ by state, so verify the official state process first.",
            },
            {
              title: "Request records under the applicable law",
              desc: "Public-records laws may provide access to some disciplinary or credibility-related records, but exemptions and confidentiality rules vary substantially by jurisdiction.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-border/60">
              <CardContent className="p-4">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-border/40 bg-muted/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Key cases</h4>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div>
              <p className="font-bold text-foreground">Brady v. Maryland (1963)</p>
              <p className="text-muted-foreground mt-0.5">Material evidence favorable to the accused falls within the prosecution&apos;s constitutional disclosure duty.</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Giglio v. United States (1972)</p>
              <p className="text-muted-foreground mt-0.5">Impeachment information affecting the credibility of an important government witness can fall within that disclosure duty.</p>
            </div>
            <div>
              <p className="font-bold text-foreground">Kyles v. Whitley (1995)</p>
              <p className="text-muted-foreground mt-0.5">A prosecutor must account for favorable evidence known to others acting for the government in the case, including police.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="p-5 text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Important:</strong> This section is general educational information, not legal advice. Disclosure standards, prosecutor policies, certification rules, disciplinary-record access, and filing procedures can differ by jurisdiction and case.
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <a href="/do-this-now#report">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Submit an Incident Report
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/help#records">
            <FileText className="h-4 w-4 mr-2" />
            Public Records Tools
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/attorneys">
            <Scale className="h-4 w-4 mr-2" />
            Find a Verified Attorney
          </a>
        </Button>
        <Button variant="ghost" asChild>
          <a href="https://www.justice.gov/jm/jm-9-5000-issues-related-trials-and-other-court-proceedings" target="_blank" rel="noopener noreferrer">
            Federal DOJ Disclosure Policy
            <ExternalLink className="h-3.5 w-3.5 ml-2" />
          </a>
        </Button>
      </div>
    </div>
  );
}
