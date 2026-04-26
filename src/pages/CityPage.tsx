import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin, AlertTriangle, Radio, Users, FileText,
  Shield, ChevronRight, ExternalLink, Building2, Scale
} from "lucide-react";

// Map URL slugs to full state + city names
const CITY_MAP: Record<string, { city: string; state: string; stateAbbr: string }> = {
  "los-angeles":    { city: "Los Angeles",   state: "California",   stateAbbr: "CA" },
  "new-york":       { city: "New York",       state: "New York",     stateAbbr: "NY" },
  "chicago":        { city: "Chicago",        state: "Illinois",     stateAbbr: "IL" },
  "houston":        { city: "Houston",        state: "Texas",        stateAbbr: "TX" },
  "phoenix":        { city: "Phoenix",        state: "Arizona",      stateAbbr: "AZ" },
  "philadelphia":   { city: "Philadelphia",   state: "Pennsylvania", stateAbbr: "PA" },
  "san-antonio":    { city: "San Antonio",    state: "Texas",        stateAbbr: "TX" },
  "san-diego":      { city: "San Diego",      state: "California",   stateAbbr: "CA" },
  "dallas":         { city: "Dallas",         state: "Texas",        stateAbbr: "TX" },
  "san-jose":       { city: "San Jose",       state: "California",   stateAbbr: "CA" },
  "austin":         { city: "Austin",         state: "Texas",        stateAbbr: "TX" },
  "jacksonville":   { city: "Jacksonville",   state: "Florida",      stateAbbr: "FL" },
  "fort-worth":     { city: "Fort Worth",     state: "Texas",        stateAbbr: "TX" },
  "columbus":       { city: "Columbus",       state: "Ohio",         stateAbbr: "OH" },
  "charlotte":      { city: "Charlotte",      state: "North Carolina", stateAbbr: "NC" },
  "indianapolis":   { city: "Indianapolis",   state: "Indiana",      stateAbbr: "IN" },
  "san-francisco":  { city: "San Francisco",  state: "California",   stateAbbr: "CA" },
  "seattle":        { city: "Seattle",        state: "Washington",   stateAbbr: "WA" },
  "denver":         { city: "Denver",         state: "Colorado",     stateAbbr: "CO" },
  "nashville":      { city: "Nashville",      state: "Tennessee",    stateAbbr: "TN" },
  "oklahoma-city":  { city: "Oklahoma City",  state: "Oklahoma",     stateAbbr: "OK" },
  "el-paso":        { city: "El Paso",        state: "Texas",        stateAbbr: "TX" },
  "las-vegas":      { city: "Las Vegas",      state: "Nevada",       stateAbbr: "NV" },
  "louisville":     { city: "Louisville",     state: "Kentucky",     stateAbbr: "KY" },
  "memphis":        { city: "Memphis",        state: "Tennessee",    stateAbbr: "TN" },
  "portland":       { city: "Portland",       state: "Oregon",       stateAbbr: "OR" },
  "baltimore":      { city: "Baltimore",      state: "Maryland",     stateAbbr: "MD" },
  "milwaukee":      { city: "Milwaukee",      state: "Wisconsin",    stateAbbr: "WI" },
  "albuquerque":    { city: "Albuquerque",    state: "New Mexico",   stateAbbr: "NM" },
  "tucson":         { city: "Tucson",         state: "Arizona",      stateAbbr: "AZ" },
  "fresno":         { city: "Fresno",         state: "California",   stateAbbr: "CA" },
  "sacramento":     { city: "Sacramento",     state: "California",   stateAbbr: "CA" },
  "mesa":           { city: "Mesa",           state: "Arizona",      stateAbbr: "AZ" },
  "kansas-city":    { city: "Kansas City",    state: "Missouri",     stateAbbr: "MO" },
  "atlanta":        { city: "Atlanta",        state: "Georgia",      stateAbbr: "GA" },
  "omaha":          { city: "Omaha",          state: "Nebraska",     stateAbbr: "NE" },
  "colorado-springs": { city: "Colorado Springs", state: "Colorado", stateAbbr: "CO" },
  "raleigh":        { city: "Raleigh",        state: "North Carolina", stateAbbr: "NC" },
  "long-beach":     { city: "Long Beach",     state: "California",   stateAbbr: "CA" },
  "virginia-beach": { city: "Virginia Beach", state: "Virginia",     stateAbbr: "VA" },
  "miami":          { city: "Miami",          state: "Florida",      stateAbbr: "FL" },
  "oakland":        { city: "Oakland",        state: "California",   stateAbbr: "CA" },
  "minneapolis":    { city: "Minneapolis",    state: "Minnesota",    stateAbbr: "MN" },
  "tulsa":          { city: "Tulsa",          state: "Oklahoma",     stateAbbr: "OK" },
  "tampa":          { city: "Tampa",          state: "Florida",      stateAbbr: "FL" },
  "new-orleans":    { city: "New Orleans",    state: "Louisiana",    stateAbbr: "LA" },
  "cleveland":      { city: "Cleveland",      state: "Ohio",         stateAbbr: "OH" },
  "wichita":        { city: "Wichita",        state: "Kansas",       stateAbbr: "KS" },
  "bakersfield":    { city: "Bakersfield",    state: "California",   stateAbbr: "CA" },
  "aurora":         { city: "Aurora",         state: "Colorado",     stateAbbr: "CO" },
  "anaheim":        { city: "Anaheim",        state: "California",   stateAbbr: "CA" },
  "santa-ana":      { city: "Santa Ana",      state: "California",   stateAbbr: "CA" },
  "corpus-christi": { city: "Corpus Christi", state: "Texas",        stateAbbr: "TX" },
  "riverside":      { city: "Riverside",      state: "California",   stateAbbr: "CA" },
  "st-louis":       { city: "St. Louis",      state: "Missouri",     stateAbbr: "MO" },
  "lexington":      { city: "Lexington",      state: "Kentucky",     stateAbbr: "KY" },
  "pittsburgh":     { city: "Pittsburgh",     state: "Pennsylvania", stateAbbr: "PA" },
  "anchorage":      { city: "Anchorage",      state: "Alaska",       stateAbbr: "AK" },
  "stockton":       { city: "Stockton",       state: "California",   stateAbbr: "CA" },
  "cincinnati":     { city: "Cincinnati",     state: "Ohio",         stateAbbr: "OH" },
  "st-paul":        { city: "St. Paul",       state: "Minnesota",    stateAbbr: "MN" },
  "greensboro":     { city: "Greensboro",     state: "North Carolina", stateAbbr: "NC" },
  "toledo":         { city: "Toledo",         state: "Ohio",         stateAbbr: "OH" },
  "newark":         { city: "Newark",         state: "New Jersey",   stateAbbr: "NJ" },
  "plano":          { city: "Plano",          state: "Texas",        stateAbbr: "TX" },
  "henderson":      { city: "Henderson",      state: "Nevada",       stateAbbr: "NV" },
  "lincoln":        { city: "Lincoln",        state: "Nebraska",     stateAbbr: "NE" },
  "buffalo":        { city: "Buffalo",        state: "New York",     stateAbbr: "NY" },
  "jersey-city":    { city: "Jersey City",    state: "New Jersey",   stateAbbr: "NJ" },
  "chula-vista":    { city: "Chula Vista",    state: "California",   stateAbbr: "CA" },
  "fort-wayne":     { city: "Fort Wayne",     state: "Indiana",      stateAbbr: "IN" },
  "orlando":        { city: "Orlando",        state: "Florida",      stateAbbr: "FL" },
  "st-petersburg":  { city: "St. Petersburg", state: "Florida",      stateAbbr: "FL" },
  "laredo":         { city: "Laredo",         state: "Texas",        stateAbbr: "TX" },
  "madison":        { city: "Madison",        state: "Wisconsin",    stateAbbr: "WI" },
  "durham":         { city: "Durham",         state: "North Carolina", stateAbbr: "NC" },
  "lubbock":        { city: "Lubbock",        state: "Texas",        stateAbbr: "TX" },
  "winston-salem":  { city: "Winston-Salem",  state: "North Carolina", stateAbbr: "NC" },
  "garland":        { city: "Garland",        state: "Texas",        stateAbbr: "TX" },
  "glendale-az":    { city: "Glendale",       state: "Arizona",      stateAbbr: "AZ" },
  "hialeah":        { city: "Hialeah",        state: "Florida",      stateAbbr: "FL" },
  "reno":           { city: "Reno",           state: "Nevada",       stateAbbr: "NV" },
  "baton-rouge":    { city: "Baton Rouge",    state: "Louisiana",    stateAbbr: "LA" },
  "irvine":         { city: "Irvine",         state: "California",   stateAbbr: "CA" },
  "chesapeake":     { city: "Chesapeake",     state: "Virginia",     stateAbbr: "VA" },
  "scottsdale":     { city: "Scottsdale",     state: "Arizona",      stateAbbr: "AZ" },
  "north-las-vegas":{ city: "North Las Vegas",state: "Nevada",       stateAbbr: "NV" },
  "gilbert":        { city: "Gilbert",        state: "Arizona",      stateAbbr: "AZ" },
  "richmond":       { city: "Richmond",       state: "Virginia",     stateAbbr: "VA" },
  "spokane":        { city: "Spokane",        state: "Washington",   stateAbbr: "WA" },
};

interface CityData {
  violations: Array<{ id: string; title: string; incident_date: string; officer_name?: string | null; agency_name?: string | null }>;
  scanners: Array<{ id: string; scanner_name: string; feed_url?: string | null; listener_count?: number | null }>;
  attorneys: Array<{ id: string; name: string; firm?: string | null; phone?: string | null; website?: string | null; accepts_pro_bono?: boolean | null }>;
  violationCount: number;
}

const CityPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const cityInfo = CITY_MAP[slug ?? ""] ?? null;

  const [data, setData] = useState<CityData>({
    violations: [], scanners: [], attorneys: [], violationCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("violations");

  const load = useCallback(async () => {
    if (!cityInfo) { setLoading(false); return; }
    setLoading(true);
    try {
      const [vRes, sRes, aRes, vCount] = await Promise.all([
        supabase.from("violations")
          .select("id, title, incident_date, officer_name, agency_name")
          .ilike("location_city", `%${cityInfo.city}%`)
          .order("incident_date", { ascending: false })
          .limit(20),
        supabase.from("scanner_links")
          .select("id, scanner_name, feed_url, listener_count")
          .ilike("city", `%${cityInfo.city}%`)
          .eq("is_active", true)
          .order("listener_count", { ascending: false })
          .limit(10),
        supabase.from("attorneys")
          .select("id, name, firm, phone, website, accepts_pro_bono")
          .eq("state", cityInfo.state)
          .order("created_at", { ascending: false })
          .limit(12),
        supabase.from("violations")
          .select("id", { count: "exact", head: true })
          .ilike("location_city", `%${cityInfo.city}%`),
      ]);
      setData({
        violations: vRes.data ?? [],
        scanners: sRes.data ?? [],
        attorneys: aRes.data ?? [],
        violationCount: vCount.count ?? 0,
      });
    } finally {
      setLoading(false);
    }
  }, [cityInfo]);

  useEffect(() => { void load(); }, [load]);

  if (!cityInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">City not found</h1>
            <p className="text-muted-foreground">We don't have a dedicated page for that city yet.</p>
            <Button asChild><Link to="/">Back to Hub</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = `${cityInfo.city} Civil Rights Hub | Know Your Rights in ${cityInfo.city}, ${cityInfo.stateAbbr}`;
  const description = `Civil rights resources, violation reports, pro bono attorneys, scanner feeds, and FOIA tools for ${cityInfo.city}, ${cityInfo.state}. Know your rights. Report police misconduct. Find legal help.`;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={title}
        description={description}
        ogTitle={title}
        ogDescription={description}
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="border-b bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 py-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link to="/" className="hover:text-primary transition-colors">Civil Rights Hub</Link>
              <ChevronRight className="h-3 w-3" />
              <span>{cityInfo.state}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{cityInfo.city}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    City Hub
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black">
                  {cityInfo.city}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {cityInfo.state} · Civil rights resources, violation reports &amp; legal help
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:ml-auto">
                <div className="text-center px-4 py-2 rounded-lg border bg-background">
                  <p className="text-2xl font-black text-red-500">
                    {loading ? "—" : data.violationCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Reports</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg border bg-background">
                  <p className="text-2xl font-black text-blue-500">
                    {loading ? "—" : data.scanners.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Scanners</p>
                </div>
                <div className="text-center px-4 py-2 rounded-lg border bg-background">
                  <p className="text-2xl font-black text-green-500">
                    {loading ? "—" : data.attorneys.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Attorneys</p>
                </div>
              </div>
            </div>

            {/* Quick action bar */}
            <div className="flex flex-wrap gap-2 mt-6">
              <Button size="sm" variant="destructive" asChild>
                <Link to="/do-this-now#report">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                  Report Incident
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/tools">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  File FOIA
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/attorneys">
                  <Scale className="h-3.5 w-3.5 mr-1.5" />
                  Find Attorney
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/rights">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Know Your Rights
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Content tabs */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex flex-wrap h-auto gap-1 p-1 mb-6">
              <TabsTrigger value="violations">
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                Violations ({data.violationCount})
              </TabsTrigger>
              <TabsTrigger value="scanners">
                <Radio className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                Scanners ({data.scanners.length})
              </TabsTrigger>
              <TabsTrigger value="attorneys">
                <Scale className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                Attorneys ({data.attorneys.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="violations">
              {loading ? (
                <div className="grid gap-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
              ) : data.violations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center space-y-3">
                    <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground opacity-40" />
                    <p className="text-muted-foreground">No violations reported in {cityInfo.city} yet.</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/do-this-now#report">Be the first to report</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {data.violations.map((v) => (
                    <Card key={v.id} className="border-border/60 hover:border-red-500/40 transition-all">
                      <CardContent className="p-4 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm leading-snug">{v.title}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {v.agency_name && <Badge variant="outline" className="text-[10px]">{v.agency_name}</Badge>}
                              {v.officer_name && <Badge variant="secondary" className="text-[10px]">Officer: {v.officer_name}</Badge>}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(v.incident_date).toLocaleDateString()}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scanners">
              {loading ? (
                <div className="grid gap-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
              ) : data.scanners.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No scanner feeds found for {cityInfo.city}.
                    <div className="mt-3">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/tools#scanner">Browse all scanners</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {data.scanners.map((s) => (
                    <Card key={s.id} className="border-border/60 hover:border-orange-500/40 transition-all">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <Radio className="h-4 w-4 text-orange-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{s.scanner_name}</p>
                            {s.listener_count != null && (
                              <p className="text-xs text-muted-foreground">{s.listener_count.toLocaleString()} listeners</p>
                            )}
                          </div>
                        </div>
                        {s.feed_url && (
                          <Button variant="ghost" size="sm" onClick={() => window.open(s.feed_url!, "_blank")}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="attorneys">
              {loading ? (
                <div className="grid gap-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
              ) : data.attorneys.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No attorneys found for {cityInfo.state}.
                    <div className="mt-3">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/attorneys">Browse all attorneys</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {data.attorneys.map((a) => (
                    <Card key={a.id} className="border-border/60 hover:border-green-500/40 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm">{a.name}</p>
                            {a.firm && <p className="text-xs text-muted-foreground">{a.firm}</p>}
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {a.accepts_pro_bono && (
                                <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-700 dark:text-green-400">
                                  Pro Bono
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {a.phone && (
                              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => window.open(`tel:${a.phone}`)}>
                                Call
                              </Button>
                            )}
                            {a.website && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(a.website!, "_blank")}>
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CityPage;
