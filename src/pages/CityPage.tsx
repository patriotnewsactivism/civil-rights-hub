import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  FileText,
  MapPin,
  Radio,
  Scale,
  Shield,
} from "lucide-react";

const CITY_MAP: Record<string, { city: string; state: string; stateAbbr: string }> = {
  "los-angeles": { city: "Los Angeles", state: "California", stateAbbr: "CA" },
  "new-york": { city: "New York", state: "New York", stateAbbr: "NY" },
  chicago: { city: "Chicago", state: "Illinois", stateAbbr: "IL" },
  houston: { city: "Houston", state: "Texas", stateAbbr: "TX" },
  phoenix: { city: "Phoenix", state: "Arizona", stateAbbr: "AZ" },
  philadelphia: { city: "Philadelphia", state: "Pennsylvania", stateAbbr: "PA" },
  "san-antonio": { city: "San Antonio", state: "Texas", stateAbbr: "TX" },
  "san-diego": { city: "San Diego", state: "California", stateAbbr: "CA" },
  dallas: { city: "Dallas", state: "Texas", stateAbbr: "TX" },
  "san-jose": { city: "San Jose", state: "California", stateAbbr: "CA" },
  austin: { city: "Austin", state: "Texas", stateAbbr: "TX" },
  jacksonville: { city: "Jacksonville", state: "Florida", stateAbbr: "FL" },
  "fort-worth": { city: "Fort Worth", state: "Texas", stateAbbr: "TX" },
  columbus: { city: "Columbus", state: "Ohio", stateAbbr: "OH" },
  charlotte: { city: "Charlotte", state: "North Carolina", stateAbbr: "NC" },
  indianapolis: { city: "Indianapolis", state: "Indiana", stateAbbr: "IN" },
  "san-francisco": { city: "San Francisco", state: "California", stateAbbr: "CA" },
  seattle: { city: "Seattle", state: "Washington", stateAbbr: "WA" },
  denver: { city: "Denver", state: "Colorado", stateAbbr: "CO" },
  nashville: { city: "Nashville", state: "Tennessee", stateAbbr: "TN" },
  "oklahoma-city": { city: "Oklahoma City", state: "Oklahoma", stateAbbr: "OK" },
  "el-paso": { city: "El Paso", state: "Texas", stateAbbr: "TX" },
  "las-vegas": { city: "Las Vegas", state: "Nevada", stateAbbr: "NV" },
  louisville: { city: "Louisville", state: "Kentucky", stateAbbr: "KY" },
  memphis: { city: "Memphis", state: "Tennessee", stateAbbr: "TN" },
  portland: { city: "Portland", state: "Oregon", stateAbbr: "OR" },
  baltimore: { city: "Baltimore", state: "Maryland", stateAbbr: "MD" },
  milwaukee: { city: "Milwaukee", state: "Wisconsin", stateAbbr: "WI" },
  albuquerque: { city: "Albuquerque", state: "New Mexico", stateAbbr: "NM" },
  tucson: { city: "Tucson", state: "Arizona", stateAbbr: "AZ" },
  fresno: { city: "Fresno", state: "California", stateAbbr: "CA" },
  sacramento: { city: "Sacramento", state: "California", stateAbbr: "CA" },
  mesa: { city: "Mesa", state: "Arizona", stateAbbr: "AZ" },
  "kansas-city": { city: "Kansas City", state: "Missouri", stateAbbr: "MO" },
  atlanta: { city: "Atlanta", state: "Georgia", stateAbbr: "GA" },
  omaha: { city: "Omaha", state: "Nebraska", stateAbbr: "NE" },
  "colorado-springs": { city: "Colorado Springs", state: "Colorado", stateAbbr: "CO" },
  raleigh: { city: "Raleigh", state: "North Carolina", stateAbbr: "NC" },
  "long-beach": { city: "Long Beach", state: "California", stateAbbr: "CA" },
  "virginia-beach": { city: "Virginia Beach", state: "Virginia", stateAbbr: "VA" },
  miami: { city: "Miami", state: "Florida", stateAbbr: "FL" },
  oakland: { city: "Oakland", state: "California", stateAbbr: "CA" },
  minneapolis: { city: "Minneapolis", state: "Minnesota", stateAbbr: "MN" },
  tulsa: { city: "Tulsa", state: "Oklahoma", stateAbbr: "OK" },
  tampa: { city: "Tampa", state: "Florida", stateAbbr: "FL" },
  "new-orleans": { city: "New Orleans", state: "Louisiana", stateAbbr: "LA" },
  cleveland: { city: "Cleveland", state: "Ohio", stateAbbr: "OH" },
  wichita: { city: "Wichita", state: "Kansas", stateAbbr: "KS" },
  bakersfield: { city: "Bakersfield", state: "California", stateAbbr: "CA" },
  aurora: { city: "Aurora", state: "Colorado", stateAbbr: "CO" },
  anaheim: { city: "Anaheim", state: "California", stateAbbr: "CA" },
  "santa-ana": { city: "Santa Ana", state: "California", stateAbbr: "CA" },
  "corpus-christi": { city: "Corpus Christi", state: "Texas", stateAbbr: "TX" },
  riverside: { city: "Riverside", state: "California", stateAbbr: "CA" },
  "st-louis": { city: "St. Louis", state: "Missouri", stateAbbr: "MO" },
  lexington: { city: "Lexington", state: "Kentucky", stateAbbr: "KY" },
  pittsburgh: { city: "Pittsburgh", state: "Pennsylvania", stateAbbr: "PA" },
  anchorage: { city: "Anchorage", state: "Alaska", stateAbbr: "AK" },
  stockton: { city: "Stockton", state: "California", stateAbbr: "CA" },
  cincinnati: { city: "Cincinnati", state: "Ohio", stateAbbr: "OH" },
  "st-paul": { city: "St. Paul", state: "Minnesota", stateAbbr: "MN" },
  greensboro: { city: "Greensboro", state: "North Carolina", stateAbbr: "NC" },
  toledo: { city: "Toledo", state: "Ohio", stateAbbr: "OH" },
  newark: { city: "Newark", state: "New Jersey", stateAbbr: "NJ" },
  plano: { city: "Plano", state: "Texas", stateAbbr: "TX" },
  henderson: { city: "Henderson", state: "Nevada", stateAbbr: "NV" },
  lincoln: { city: "Lincoln", state: "Nebraska", stateAbbr: "NE" },
  buffalo: { city: "Buffalo", state: "New York", stateAbbr: "NY" },
  "jersey-city": { city: "Jersey City", state: "New Jersey", stateAbbr: "NJ" },
  "chula-vista": { city: "Chula Vista", state: "California", stateAbbr: "CA" },
  "fort-wayne": { city: "Fort Wayne", state: "Indiana", stateAbbr: "IN" },
  orlando: { city: "Orlando", state: "Florida", stateAbbr: "FL" },
  "st-petersburg": { city: "St. Petersburg", state: "Florida", stateAbbr: "FL" },
  laredo: { city: "Laredo", state: "Texas", stateAbbr: "TX" },
  madison: { city: "Madison", state: "Wisconsin", stateAbbr: "WI" },
  durham: { city: "Durham", state: "North Carolina", stateAbbr: "NC" },
  lubbock: { city: "Lubbock", state: "Texas", stateAbbr: "TX" },
  "winston-salem": { city: "Winston-Salem", state: "North Carolina", stateAbbr: "NC" },
  garland: { city: "Garland", state: "Texas", stateAbbr: "TX" },
  "glendale-az": { city: "Glendale", state: "Arizona", stateAbbr: "AZ" },
  hialeah: { city: "Hialeah", state: "Florida", stateAbbr: "FL" },
  reno: { city: "Reno", state: "Nevada", stateAbbr: "NV" },
  "baton-rouge": { city: "Baton Rouge", state: "Louisiana", stateAbbr: "LA" },
  irvine: { city: "Irvine", state: "California", stateAbbr: "CA" },
  chesapeake: { city: "Chesapeake", state: "Virginia", stateAbbr: "VA" },
  scottsdale: { city: "Scottsdale", state: "Arizona", stateAbbr: "AZ" },
  "north-las-vegas": { city: "North Las Vegas", state: "Nevada", stateAbbr: "NV" },
  gilbert: { city: "Gilbert", state: "Arizona", stateAbbr: "AZ" },
  richmond: { city: "Richmond", state: "Virginia", stateAbbr: "VA" },
  spokane: { city: "Spokane", state: "Washington", stateAbbr: "WA" },
};

interface CityData {
  violations: Array<{
    id: string;
    title: string;
    incident_date: string;
    officer_name: string | null;
    agency_name: string | null;
  }>;
  scanners: Array<{
    id: string;
    scanner_name: string;
    feed_url: string | null;
    listener_count: number | null;
  }>;
  attorneys: Array<{
    id: string;
    name: string;
    firm: string | null;
    phone: string | null;
    website: string | null;
    accepts_pro_bono: boolean | null;
  }>;
  violationCount: number;
}

const EMPTY_DATA: CityData = {
  violations: [],
  scanners: [],
  attorneys: [],
  violationCount: 0,
};

const CityPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const cityInfo = CITY_MAP[slug ?? ""] ?? null;
  const [data, setData] = useState<CityData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("violations");

  const load = useCallback(async () => {
    if (!cityInfo) {
      setData(EMPTY_DATA);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [vRes, sRes, aRes, vCount] = await Promise.all([
        supabase
          .from("violations")
          .select("id, title, incident_date, officer_name, agency_name")
          .eq("status", "verified")
          .eq("location_state", cityInfo.state)
          .ilike("location_city", `%${cityInfo.city}%`)
          .order("incident_date", { ascending: false })
          .limit(20),
        supabase
          .from("scanner_links")
          .select("id, scanner_name, listener_count, broadcastify_url, other_url, scanner_radio_url")
          .ilike("city", `%${cityInfo.city}%`)
          .eq("is_active", true)
          .order("listener_count", { ascending: false, nullsFirst: false })
          .limit(10),
        supabase
          .from("attorneys")
          .select("id, name, firm, phone, website, accepts_pro_bono")
          .eq("is_verified", true)
          .in("state", [cityInfo.state, cityInfo.stateAbbr])
          .order("created_at", { ascending: false })
          .limit(12),
        supabase
          .from("violations")
          .select("id", { count: "exact", head: true })
          .eq("status", "verified")
          .eq("location_state", cityInfo.state)
          .ilike("location_city", `%${cityInfo.city}%`),
      ]);

      if (vRes.error) throw vRes.error;
      if (sRes.error) throw sRes.error;
      if (aRes.error) throw aRes.error;
      if (vCount.error) throw vCount.error;

      setData({
        violations: vRes.data ?? [],
        scanners: (sRes.data ?? []).map((scanner) => ({
          id: scanner.id,
          scanner_name: scanner.scanner_name,
          listener_count: scanner.listener_count,
          feed_url: scanner.broadcastify_url || scanner.other_url || scanner.scanner_radio_url || null,
        })),
        attorneys: aRes.data ?? [],
        violationCount: vCount.count ?? 0,
      });
    } catch (error) {
      console.error("Unable to load source-verified city data:", error);
      setData(EMPTY_DATA);
    } finally {
      setLoading(false);
    }
  }, [cityInfo]);

  useEffect(() => {
    void load();
  }, [load]);

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

  const title = `${cityInfo.city} Civil Rights Hub | Verified Records & Rights Resources`;
  const description = `Source-verified civil-rights incident records and attorney directory records, active scanner feeds, public-records tools, and rights resources for ${cityInfo.city}, ${cityInfo.state}.`;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={title}
        description={description}
        ogTitle={title}
        ogDescription={description}
        canonicalUrl={`https://civilrightshub.org/city/${slug}`}
      />
      <Header />
      <main className="flex-1">
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
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">City Hub</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black">{cityInfo.city}</h1>
                <p className="text-muted-foreground mt-2">
                  {cityInfo.state} · source-verified civil-rights records and practical resources
                </p>
              </div>

              <div className="flex flex-wrap gap-3 md:ml-auto">
                <Metric label="Verified incidents" value={loading ? null : data.violationCount} className="text-red-500" />
                <Metric label="Active scanners" value={loading ? null : data.scanners.length} className="text-blue-500" />
                <Metric label="Verified attorneys" value={loading ? null : data.attorneys.length} className="text-green-500" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <Button size="sm" variant="destructive" asChild>
                <Link to="/do-this-now#report">
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                  Submit Incident Report
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/tools">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Public Records Tools
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/attorneys">
                  <Scale className="h-3.5 w-3.5 mr-1.5" />
                  Find Verified Attorney
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

        <div className="container mx-auto px-4 py-8">
          <Card className="mb-6 border-dashed">
            <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed">
              Public incident and attorney data on this page is restricted to records that passed the source-provenance gate. An officer or agency being named in a verified incident record is not, by itself, a finding of misconduct or legal liability. Attorney listings are informational; independently confirm licensing, availability, services, and fees.
            </CardContent>
          </Card>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex flex-wrap h-auto gap-1 p-1 mb-6">
              <TabsTrigger value="violations">
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                Verified Incidents ({data.violationCount})
              </TabsTrigger>
              <TabsTrigger value="scanners">
                <Radio className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                Scanners ({data.scanners.length})
              </TabsTrigger>
              <TabsTrigger value="attorneys">
                <Scale className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                Verified Attorneys ({data.attorneys.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="violations">
              {loading ? (
                <LoadingRows count={5} />
              ) : data.violations.length === 0 ? (
                <EmptyCard>
                  No source-verified incident records are currently published for {cityInfo.city}. New submissions stay pending until evidence review.
                </EmptyCard>
              ) : (
                <div className="grid gap-3">
                  {data.violations.map((incident) => (
                    <Card key={incident.id} className="border-border/60 hover:border-red-500/40 transition-all">
                      <CardContent className="p-4 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="flex flex-wrap gap-2 items-center">
                              <p className="font-medium text-sm leading-snug">{incident.title}</p>
                              <Badge variant="outline" className="text-[10px]">Source Verified</Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-1">
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
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scanners">
              {loading ? (
                <LoadingRows count={3} />
              ) : data.scanners.length === 0 ? (
                <EmptyCard>No active scanner feeds were found for {cityInfo.city}.</EmptyCard>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {data.scanners.map((scanner) => (
                    <Card key={scanner.id} className="border-border/60 hover:border-orange-500/40 transition-all">
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <Radio className="h-4 w-4 text-orange-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{scanner.scanner_name}</p>
                            {scanner.listener_count != null && (
                              <p className="text-xs text-muted-foreground">{scanner.listener_count.toLocaleString()} listeners</p>
                            )}
                          </div>
                        </div>
                        {scanner.feed_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(scanner.feed_url ?? undefined, "_blank", "noopener,noreferrer")}
                          >
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
                <LoadingRows count={4} />
              ) : data.attorneys.length === 0 ? (
                <EmptyCard>
                  No source-verified attorney records are currently published for {cityInfo.state}.
                </EmptyCard>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {data.attorneys.map((attorney) => (
                    <Card key={attorney.id} className="border-border/60 hover:border-green-500/40 transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-sm">{attorney.name}</p>
                              <Badge variant="outline" className="text-[10px]">Source Verified</Badge>
                            </div>
                            {attorney.firm && <p className="text-xs text-muted-foreground mt-0.5">{attorney.firm}</p>}
                            {attorney.accepts_pro_bono && (
                              <Badge variant="secondary" className="mt-1.5 text-[10px] bg-green-500/10 text-green-700 dark:text-green-400">
                                Listed as accepting pro bono matters
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            {attorney.phone && (
                              <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                                <a href={`tel:${attorney.phone}`}>Call</a>
                              </Button>
                            )}
                            {attorney.website && (
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <a href={attorney.website} target="_blank" rel="noopener noreferrer" aria-label={`${attorney.name} website`}>
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
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

function Metric({ label, value, className }: { label: string; value: number | null; className: string }) {
  return (
    <div className="text-center px-4 py-2 rounded-lg border bg-background">
      <p className={`text-2xl font-black ${className}`}>{value == null ? "—" : value.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function LoadingRows({ count }: { count: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-20 rounded-xl" />
      ))}
    </div>
  );
}

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="py-12 text-center text-muted-foreground">{children}</CardContent>
    </Card>
  );
}

export default CityPage;
