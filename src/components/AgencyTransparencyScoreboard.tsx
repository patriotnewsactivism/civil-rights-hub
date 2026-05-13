/**
 * AgencyTransparencyScoreboard.tsx
 * Public-facing scoreboard of agency transparency scores, denial rates,
 * and response times — all auto-calculated from real request data.
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Search, Shield, ShieldAlert, ShieldCheck, ShieldX,
  BarChart2, Clock, FileText, TrendingDown, TrendingUp,
  ChevronUp, ChevronDown, Twitter, Share2, Building2,
  Trophy, AlertTriangle, Info
} from "lucide-react";

interface Agency {
  id: string;
  name: string;
  agency_type: string;
  state: string | null;
  city: string | null;
  transparency_score: number | null;
  denial_rate: number | null;
  avg_response_days: number | null;
  total_requests: number | null;
  total_fulfilled: number | null;
  total_denied: number | null;
  foia_email: string | null;
  user_contributed: boolean | null;
  community_verified: boolean | null;
}

const gradeColor = (score: number | null) => {
  if (score === null) return { bg: "bg-gray-100", text: "text-gray-600", label: "?" };
  if (score >= 80) return { bg: "bg-green-50", text: "text-green-700", label: "A" };
  if (score >= 60) return { bg: "bg-blue-50", text: "text-blue-700", label: "B" };
  if (score >= 40) return { bg: "bg-yellow-50", text: "text-yellow-700", label: "C" };
  if (score >= 20) return { bg: "bg-orange-50", text: "text-orange-700", label: "D" };
  return { bg: "bg-red-50", text: "text-red-700", label: "F" };
};

const denialColor = (rate: number | null) => {
  if (rate === null) return "text-muted-foreground";
  if (rate < 20) return "text-green-600";
  if (rate < 40) return "text-yellow-600";
  return "text-red-600";
};

export default function AgencyTransparencyScoreboard() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"score" | "denial" | "requests" | "name">("requests");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Agency | null>(null);

  useEffect(() => {
    supabase
      .from("foia_agencies")
      .select("id, name, agency_type, state, city, transparency_score, denial_rate, avg_response_days, total_requests, total_fulfilled, total_denied, foia_email, user_contributed, community_verified")
      .gt("total_requests", 0)
      .order("total_requests", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setAgencies(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = agencies
    .filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || (a.state || "").toLowerCase().includes(q) || (a.city || "").toLowerCase().includes(q);
      const matchType = typeFilter === "all" || a.agency_type === typeFilter;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      let va: number, vb: number;
      switch (sortBy) {
        case "score": va = a.transparency_score ?? 50; vb = b.transparency_score ?? 50; break;
        case "denial": va = a.denial_rate ?? 0; vb = b.denial_rate ?? 0; break;
        case "requests": va = a.total_requests ?? 0; vb = b.total_requests ?? 0; break;
        case "name": return sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        default: va = a.total_requests ?? 0; vb = b.total_requests ?? 0;
      }
      return sortDir === "desc" ? vb - va : va - vb;
    });

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const SortBtn = ({ col, label }: { col: typeof sortBy; label: string }) => (
    <button
      className={`flex items-center gap-1 text-xs font-medium hover:text-primary transition-colors ${sortBy === col ? "text-primary" : "text-muted-foreground"}`}
      onClick={() => toggleSort(col)}
    >
      {label}
      {sortBy === col ? (sortDir === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />) : null}
    </button>
  );

  const shareScoreboard = (agency: Agency) => {
    const grade = gradeColor(agency.transparency_score).label;
    const text = `${agency.name} gets a transparency grade of ${grade} — ${agency.denial_rate?.toFixed(0) ?? "?"}% of FOIA requests denied. Data from @CivilRightsHub. civilrightshub.org/public-records #Transparency #FOIA #Accountability`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Top/Bottom highlights
  const topAgencies = [...agencies].sort((a, b) => (b.transparency_score ?? 0) - (a.transparency_score ?? 0)).slice(0, 3);
  const worstAgencies = [...agencies].filter(a => (a.total_requests ?? 0) >= 3).sort((a, b) => (b.denial_rate ?? 0) - (a.denial_rate ?? 0)).slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" /> Agency Transparency Scoreboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Real grades, real data — calculated from {agencies.length} agencies tracked by our community
        </p>
      </div>

      {/* Highlights */}
      {(topAgencies.length > 0 || worstAgencies.length > 0) && (
        <div className="grid md:grid-cols-2 gap-3">
          {topAgencies.length > 0 && (
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                  <Trophy className="h-4 w-4" /> Most Transparent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topAgencies.map((a, i) => {
                  const grade = gradeColor(a.transparency_score);
                  return (
                    <div key={a.id} className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">{i + 1}. {a.name}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${grade.bg} ${grade.text}`}>{grade.label}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
          {worstAgencies.length > 0 && (
            <Card className="border-red-200 bg-red-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" /> Highest Denial Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {worstAgencies.map((a, i) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <span className="text-sm truncate flex-1">{i + 1}. {a.name}</span>
                    <span className="text-xs font-bold text-red-600">{a.denial_rate?.toFixed(0)}% denied</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search agencies…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Federal">Federal</SelectItem>
            <SelectItem value="State">State</SelectItem>
            <SelectItem value="County">County</SelectItem>
            <SelectItem value="Municipal">Municipal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort bar */}
      <div className="flex items-center gap-4 px-1">
        <span className="text-xs text-muted-foreground">{filtered.length} agencies</span>
        <div className="flex gap-4 ml-auto">
          <SortBtn col="requests" label="Most Requested" />
          <SortBtn col="score" label="Transparency" />
          <SortBtn col="denial" label="Denial Rate" />
          <SortBtn col="name" label="Name" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">Loading scoreboard…</div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            No agencies with tracked requests yet. Data grows as users file requests!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(agency => {
            const grade = gradeColor(agency.transparency_score);
            return (
              <Card
                key={agency.id}
                className="cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setSelected(selected?.id === agency.id ? null : agency)}
              >
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    {/* Grade badge */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0 ${grade.bg} ${grade.text}`}>
                      {grade.label}
                    </div>

                    {/* Agency info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm truncate">{agency.name}</p>
                        {agency.user_contributed && !agency.community_verified && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600">Community</span>
                        )}
                        {agency.community_verified && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-600">✓ Verified</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{[agency.agency_type, agency.city, agency.state].filter(Boolean).join(" · ")}</p>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className={`text-sm font-bold ${denialColor(agency.denial_rate)}`}>
                          {agency.denial_rate !== null ? `${agency.denial_rate.toFixed(0)}%` : "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Denied</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{agency.avg_response_days !== null ? `${Math.round(Number(agency.avg_response_days))}d` : "—"}</p>
                        <p className="text-[10px] text-muted-foreground">Avg Response</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{agency.total_requests ?? 0}</p>
                        <p className="text-[10px] text-muted-foreground">Requests</p>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); shareScoreboard(agency); }}>
                      <Twitter className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Expanded detail */}
                  {selected?.id === agency.id && (
                    <div className="mt-3 pt-3 border-t space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Total Requests", value: agency.total_requests ?? 0 },
                          { label: "Fulfilled", value: agency.total_fulfilled ?? 0 },
                          { label: "Denied", value: agency.total_denied ?? 0 },
                          { label: "Transparency Score", value: `${agency.transparency_score ?? "??"}/100` },
                        ].map(s => (
                          <div key={s.label} className="bg-muted rounded-lg p-2 text-center">
                            <p className="font-bold">{s.value}</p>
                            <p className="text-[10px] text-muted-foreground">{s.label}</p>
                          </div>
                        ))}
                      </div>
                      {(agency.total_requests ?? 0) > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-green-600">Fulfilled {agency.total_fulfilled ?? 0}</span>
                            <span className="text-red-600">Denied {agency.total_denied ?? 0}</span>
                          </div>
                          <div className="h-2 rounded-full bg-red-100 overflow-hidden">
                            <div
                              className="h-full bg-green-400 rounded-full"
                              style={{ width: `${((agency.total_fulfilled ?? 0) / (agency.total_requests ?? 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {agency.foia_email && (
                        <p className="text-xs text-blue-600 flex items-center gap-1">
                          📧 FOIA email: {agency.foia_email}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => shareScoreboard(agency)}>
                          <Twitter className="h-3.5 w-3.5 mr-1" /> Share This Grade
                        </Button>
                        <Button size="sm" onClick={() => {
                          window.location.href = "/public-records";
                        }}>
                          <FileText className="h-3.5 w-3.5 mr-1" /> File a Request
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Methodology note */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="py-3 px-4 flex items-start gap-2">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Transparency scores are calculated from real public records request outcomes filed by CivilRightsHub users.
            Scores reflect fulfillment rate (70%) and response speed (30%). Data grows as more requests are filed.
            Agencies need at least 3 tracked requests to appear on this scoreboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
