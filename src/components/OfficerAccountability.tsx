import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Shield, AlertTriangle, Building2, ChevronRight,
  ExternalLink, MapPin, Filter, FileText, Scale, Gavel,
  Users, Video, ClipboardList, BookOpen,
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
  const [activeTab, setActiveTab] = useState<"violations" | "officers" | "agencies" | "brady">("violations");
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
        // Real `officers` table shape differs from the Officer interface used
        // for display (first_name/last_name instead of name, agency_id instead
        // of a resolved department string, total_complaints instead of
        // complaint_count) — map explicitly rather than blind-casting.
        const agencyNameById = new Map(
          (aRes.data ?? []).map((a) => [a.id, a.name])
        );
        setOfficers(
          (oRes.data ?? []).map((o) => ({
            id: o.id,
            name: [o.first_name, o.last_name].filter(Boolean).join(" ") || "Unknown Officer",
            badge_number: o.badge_number,
            department: o.agency_id ? agencyNameById.get(o.agency_id) ?? null : null,
            rank: o.rank,
            state: null,
            complaint_count: o.total_complaints ?? o.total_violations ?? 0,
            last_incident: null,
          }))
        );
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
        setAgencies(
          (aRes.data ?? []).map((a) => ({
            id: a.id,
            name: a.name,
            state: a.state,
            city: a.city,
            type: a.agency_type,
            violation_count: a.total_complaints ?? 0,
          }))
        );
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
            <button className={tabClass("brady")} onClick={() => setActiveTab("brady")}>
              Brady Lists
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
            {activeTab === "brady" && (
              <div className="space-y-6">

                {/* What is a Brady List? */}
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Gavel className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-bold">What Is a Brady List?</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      In <em>Brady v. Maryland</em> (1963), the Supreme Court ruled that prosecutors must
                      disclose evidence favorable to the defense — including information about officers with
                      credibility issues. A <strong className="text-foreground">Brady list</strong> (also called
                      a <em>Giglio list</em>) is a record maintained by prosecutor offices of law enforcement
                      officers who have sustained findings of dishonesty, misconduct, excessive force, or other
                      integrity problems. If an officer is on a Brady list, prosecutors are constitutionally
                      required to notify defense attorneys, which can undermine the officer's credibility as a
                      witness and lead to dismissed charges or overturned convictions.
                    </p>
                  </CardContent>
                </Card>

                {/* How to Brady List an Officer */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardList className="h-5 w-5 text-accent" />
                    <h3 className="text-lg font-bold">How to Brady List a Dirty Cop</h3>
                  </div>
                  <div className="grid gap-3">
                    {[
                      {
                        icon: AlertTriangle,
                        title: "File a Formal Complaint with Internal Affairs",
                        desc: "File a detailed complaint with the officer's agency IA division. Include dates, times, locations, badge numbers, and witness names. Get a complaint number and keep copies of everything.",
                        link: "/do-this-now#report",
                        linkText: "Report the Violation",
                      },
                      {
                        icon: Scale,
                        title: "File with the Civilian Review Board",
                        desc: "If your city has a civilian review board, file there too. These boards can issue independent findings of misconduct that carry weight with prosecutors.",
                      },
                      {
                        icon: Gavel,
                        title: "Notify the District Attorney",
                        desc: "Send a formal letter to the DA's office documenting the misconduct with all evidence. The DA is legally required to add the officer to their Brady/Giglio list once they have knowledge of credibility issues.",
                        link: "/help#records",
                        linkText: "Draft a Letter",
                      },
                      {
                        icon: Users,
                        title: "Contact the Public Defender's Office",
                        desc: "Defense attorneys need to know about the officer's credibility issues. They can file motions to compel disclosure if the DA refuses to share Brady material.",
                      },
                      {
                        icon: Shield,
                        title: "File with State POST Council",
                        desc: "Every state has a POST (Peace Officer Standards and Training) council that certifies officers. POST can revoke certification for sustained misconduct findings.",
                      },
                      {
                        icon: FileText,
                        title: "FOIA the Officer's Disciplinary History",
                        desc: "Submit a FOIA request for all sustained complaints, disciplinary actions, and IA findings for the officer. Use our FOIA Builder to draft the request from a template.",
                        link: "/help#records",
                        linkText: "FOIA Builder",
                      },
                      {
                        icon: Video,
                        title: "Document Everything",
                        desc: "Use the Go Live feature to record encounters. Keep a chain of custody for all evidence — video, photos, witness statements, documents. Timestamp everything.",
                        link: "/community",
                        linkText: "Go Live",
                      },
                    ].map((step, idx) => (
                      <Card key={idx} className="border-border/60 hover:border-primary/40 transition-all">
                        <CardContent className="p-4 flex items-start gap-3">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <step.icon className="h-4 w-4 text-accent flex-shrink-0" />
                              <p className="font-semibold text-sm">{step.title}</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                            {step.link && (
                              <a href={step.link} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2 font-medium">
                                {step.linkText}
                                <ChevronRight className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* How to Access Brady Lists */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">How to Access Existing Brady Lists</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      {
                        icon: FileText,
                        title: "FOIA the DA's Office",
                        desc: "Request their current Brady/Giglio list. Some offices call it 'officer credibility list' or 'potential impeachment list.' Draft this with our FOIA Builder.",
                        link: "/help#records",
                      },
                      {
                        icon: ExternalLink,
                        title: "Check Online Databases",
                        desc: "Some cities publish their Brady lists online (e.g., Philadelphia, Dallas, Houston). Check your local DA's website for a 'Brady list' or 'Giglio list' page.",
                      },
                      {
                        icon: Scale,
                        title: "Request Through Court Discovery",
                        desc: "Defense attorneys can request Brady material through discovery motions. File a 'Brady motion' or 'motion to compel' if the prosecution withholds disclosure.",
                      },
                      {
                        icon: Users,
                        title: "Contact Local ACLU",
                        desc: "Many ACLU state affiliates maintain databases of officer misconduct or can direct you to public Brady/Giglio lists in your jurisdiction.",
                      },
                      {
                        icon: ExternalLink,
                        title: "National Databases",
                        desc: "Search national police misconduct databases: NPAP (National Police Accountability Project), USA Today's police misconduct tracker, and The Intercept's Brady List database.",
                      },
                      {
                        icon: FileText,
                        title: "FOIA the Police Department",
                        desc: "Request 'all records related to officer disciplinary actions, sustained complaints, and IA findings for [officer name/badge number]' from the agency directly.",
                        link: "/help#records",
                      },
                    ].map((resource, idx) => (
                      <Card key={idx} className="border-border/60 hover:border-accent/40 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <resource.icon className="h-4 w-4 text-primary flex-shrink-0" />
                            <p className="font-semibold text-sm">{resource.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{resource.desc}</p>
                          {resource.link && (
                            <a href={resource.link} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2 font-medium">
                              Start Here <ChevronRight className="h-3 w-3" />
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Key Legal References */}
                <Card className="border-border/40 bg-muted/30">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Key Legal Precedents</h4>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="font-bold text-foreground">Brady v. Maryland (1963)</p>
                        <p className="text-muted-foreground mt-0.5">Prosecutors must disclose exculpatory evidence to the defense.</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Giglio v. United States (1972)</p>
                        <p className="text-muted-foreground mt-0.5">Impeachment evidence — including officer credibility — must also be disclosed.</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Kyles v. Whitley (1995)</p>
                        <p className="text-muted-foreground mt-0.5">Prosecution is responsible for all Brady information known to police, not just what they personally review.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild>
                    <a href="/do-this-now#report">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report a Violation
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/help#records">
                      <FileText className="h-4 w-4 mr-2" />
                      FOIA Builder
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/attorneys">
                      <Scale className="h-4 w-4 mr-2" />
                      Find an Attorney
                    </a>
                  </Button>
                </div>
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
