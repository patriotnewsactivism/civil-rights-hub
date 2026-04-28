import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin, Scale, Shield, Phone, Globe, Mail,
  Search, ChevronRight, FileText, AlertTriangle,
  Building2, Star, ExternalLink, Users,
} from "lucide-react";

const STATES: Record<string, { name: string; abbr: string }> = {
  alabama: { name: "Alabama", abbr: "AL" },
  alaska: { name: "Alaska", abbr: "AK" },
  arizona: { name: "Arizona", abbr: "AZ" },
  arkansas: { name: "Arkansas", abbr: "AR" },
  california: { name: "California", abbr: "CA" },
  colorado: { name: "Colorado", abbr: "CO" },
  connecticut: { name: "Connecticut", abbr: "CT" },
  delaware: { name: "Delaware", abbr: "DE" },
  florida: { name: "Florida", abbr: "FL" },
  georgia: { name: "Georgia", abbr: "GA" },
  hawaii: { name: "Hawaii", abbr: "HI" },
  idaho: { name: "Idaho", abbr: "ID" },
  illinois: { name: "Illinois", abbr: "IL" },
  indiana: { name: "Indiana", abbr: "IN" },
  iowa: { name: "Iowa", abbr: "IA" },
  kansas: { name: "Kansas", abbr: "KS" },
  kentucky: { name: "Kentucky", abbr: "KY" },
  louisiana: { name: "Louisiana", abbr: "LA" },
  maine: { name: "Maine", abbr: "ME" },
  maryland: { name: "Maryland", abbr: "MD" },
  massachusetts: { name: "Massachusetts", abbr: "MA" },
  michigan: { name: "Michigan", abbr: "MI" },
  minnesota: { name: "Minnesota", abbr: "MN" },
  mississippi: { name: "Mississippi", abbr: "MS" },
  missouri: { name: "Missouri", abbr: "MO" },
  montana: { name: "Montana", abbr: "MT" },
  nebraska: { name: "Nebraska", abbr: "NE" },
  nevada: { name: "Nevada", abbr: "NV" },
  "new-hampshire": { name: "New Hampshire", abbr: "NH" },
  "new-jersey": { name: "New Jersey", abbr: "NJ" },
  "new-mexico": { name: "New Mexico", abbr: "NM" },
  "new-york": { name: "New York", abbr: "NY" },
  "north-carolina": { name: "North Carolina", abbr: "NC" },
  "north-dakota": { name: "North Dakota", abbr: "ND" },
  ohio: { name: "Ohio", abbr: "OH" },
  oklahoma: { name: "Oklahoma", abbr: "OK" },
  oregon: { name: "Oregon", abbr: "OR" },
  pennsylvania: { name: "Pennsylvania", abbr: "PA" },
  "rhode-island": { name: "Rhode Island", abbr: "RI" },
  "south-carolina": { name: "South Carolina", abbr: "SC" },
  "south-dakota": { name: "South Dakota", abbr: "SD" },
  tennessee: { name: "Tennessee", abbr: "TN" },
  texas: { name: "Texas", abbr: "TX" },
  utah: { name: "Utah", abbr: "UT" },
  vermont: { name: "Vermont", abbr: "VT" },
  virginia: { name: "Virginia", abbr: "VA" },
  washington: { name: "Washington", abbr: "WA" },
  "west-virginia": { name: "West Virginia", abbr: "WV" },
  wisconsin: { name: "Wisconsin", abbr: "WI" },
  wyoming: { name: "Wyoming", abbr: "WY" },
  "district-of-columbia": { name: "District of Columbia", abbr: "DC" },
};

interface Attorney {
  id: string;
  name: string;
  firm: string | null;
  city: string | null;
  state: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  practice_areas: string[] | null;
  specialties: string[] | null;
  rating: number | null;
  review_count: number | null;
  is_verified: boolean | null;
  accepts_pro_bono: boolean | null;
  years_experience: number | null;
  languages: string[] | null;
  bio: string | null;
  professional_bio: string | null;
}

export default function StatePage() {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const stateInfo = STATES[stateSlug ?? ""];

  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  useEffect(() => {
    if (!stateInfo) { setLoading(false); return; }
    setLoading(true);
    supabase
      .from("attorneys")
      .select("id, name, firm, city, state, phone, email, website, practice_areas, specialties, rating, review_count, is_verified, accepts_pro_bono, years_experience, languages, bio, professional_bio")
      .eq("state", stateInfo.abbr)
      .order("is_verified", { ascending: false })
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(300)
      .then(({ data }) => {
        setAttorneys((data ?? []) as Attorney[]);
        setLoading(false);
      });
  }, [stateInfo]);

  const practiceAreas = useMemo(() => {
    const map = new Map<string, number>();
    attorneys.forEach((a) => {
      a.practice_areas?.forEach((p) => map.set(p, (map.get(p) ?? 0) + 1));
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [attorneys]);

  const cities = useMemo(() => {
    const map = new Map<string, number>();
    attorneys.forEach((a) => { if (a.city) map.set(a.city, (map.get(a.city) ?? 0) + 1); });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [attorneys]);

  const filteredAttorneys = useMemo(() => {
    return attorneys.filter((a) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          a.name.toLowerCase().includes(q) ||
          a.firm?.toLowerCase().includes(q) ||
          a.city?.toLowerCase().includes(q) ||
          a.practice_areas?.some((p) => p.toLowerCase().includes(q)) ||
          a.specialties?.some((s) => s.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (selectedArea) {
        const has = a.practice_areas?.includes(selectedArea) || a.specialties?.includes(selectedArea);
        if (!has) return false;
      }
      return true;
    });
  }, [attorneys, searchQuery, selectedArea]);

  if (!stateInfo) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">State Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find that state.</p>
          <Button asChild><Link to="/states">Browse All States</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const verifiedCount = attorneys.filter((a) => a.is_verified).length;
  const proBonoCount = attorneys.filter((a) => a.accepts_pro_bono).length;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Civil Rights Attorneys in ${stateInfo.name}`,
    description: `Find ${attorneys.length} civil rights attorneys in ${stateInfo.name}. Free attorney directory.`,
    url: `https://civilrightshub.org/state/${stateSlug}`,
    numberOfItems: attorneys.length,
    itemListElement: attorneys.slice(0, 10).map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Attorney",
        name: a.name,
        address: { "@type": "PostalAddress", addressLocality: a.city, addressRegion: stateInfo.abbr },
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SEO
        title={`Civil Rights Attorneys in ${stateInfo.name} | ${attorneys.length} Lawyers — Civil Rights Hub`}
        description={`Find ${attorneys.length} civil rights attorneys in ${stateInfo.name}. Free directory — police brutality, civil rights violations, excessive force, constitutional rights lawyers.`}
        keywords={`civil rights attorney ${stateInfo.name}, police brutality lawyer ${stateInfo.name}, ${stateInfo.abbr} civil rights lawyer, excessive force attorney ${stateInfo.abbr}`}
        canonicalUrl={`https://civilrightshub.org/state/${stateSlug}`}
        ogUrl={`https://civilrightshub.org/state/${stateSlug}`}
        ogTitle={`Civil Rights Attorneys in ${stateInfo.name}`}
        ogDescription={`${attorneys.length} civil rights attorneys ready to fight for your rights in ${stateInfo.name}`}
        structuredData={structuredData}
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link to="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/states" className="hover:text-primary">States</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{stateInfo.name}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Civil Rights Attorneys in{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                {stateInfo.name}
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              {loading
                ? "Loading attorneys..."
                : attorneys.length > 0
                ? `${attorneys.length} civil rights attorneys ready to fight for your rights in ${stateInfo.name}. All listings are free — no referral fees.`
                : `We're building our ${stateInfo.name} directory. Check back soon or try a neighboring state.`}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Badge variant="secondary" className="gap-1.5">
                <Scale className="h-3 w-3" /> {attorneys.length} Attorneys
              </Badge>
              {verifiedCount > 0 && (
                <Badge variant="secondary" className="gap-1.5">
                  <Shield className="h-3 w-3" /> {verifiedCount} Verified
                </Badge>
              )}
              {proBonoCount > 0 && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 gap-1.5">
                  <Users className="h-3 w-3" /> {proBonoCount} Pro Bono
                </Badge>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              {/* Main Content */}
              <div className="space-y-6">
                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, firm, city, or specialty..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {practiceAreas.length > 1 && (
                    <select
                      className="border rounded-md px-3 py-2 text-sm bg-background min-w-[180px]"
                      value={selectedArea ?? ""}
                      onChange={(e) => setSelectedArea(e.target.value || null)}
                    >
                      <option value="">All Practice Areas</option>
                      {practiceAreas.map(([area, count]) => (
                        <option key={area} value={area}>{area} ({count})</option>
                      ))}
                    </select>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  Showing {filteredAttorneys.length} of {attorneys.length} attorneys
                  {selectedArea && <> in <strong>{selectedArea}</strong> <button onClick={() => setSelectedArea(null)} className="text-primary hover:underline ml-1">clear</button></>}
                </p>

                {/* Attorney Cards */}
                {filteredAttorneys.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Scale className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No attorneys found</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? "Try adjusting your search." : `Check back soon — we're growing our ${stateInfo.name} network.`}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {filteredAttorneys.map((a) => (
                      <Card key={a.id} className="border-border/50 hover:border-primary/30 transition-colors">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="font-semibold text-base">{a.name}</h3>
                                {a.is_verified && (
                                  <Badge className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0 border-blue-500/30">
                                    ✓ Verified
                                  </Badge>
                                )}
                                {a.accepts_pro_bono && (
                                  <Badge className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0 border-green-500/30">
                                    Pro Bono
                                  </Badge>
                                )}
                                {a.rating && (
                                  <span className="flex items-center gap-0.5 text-yellow-500 text-xs">
                                    <Star className="h-3 w-3 fill-current" />
                                    {a.rating}
                                    {a.review_count ? <span className="text-muted-foreground ml-0.5">({a.review_count})</span> : null}
                                  </span>
                                )}
                              </div>
                              {a.firm && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Building2 className="h-3 w-3 shrink-0" /> {a.firm}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
                                {a.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {a.city}, {a.state}
                                  </span>
                                )}
                                {a.years_experience && (
                                  <span className="flex items-center gap-1">
                                    <Shield className="h-3 w-3" /> {a.years_experience}+ yrs
                                  </span>
                                )}
                                {a.languages && a.languages.length > 1 && (
                                  <span className="flex items-center gap-1">
                                    <Globe className="h-3 w-3" /> {a.languages.join(", ")}
                                  </span>
                                )}
                              </div>
                              {/* Practice areas */}
                              {a.practice_areas && a.practice_areas.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {a.practice_areas.slice(0, 4).map((p) => (
                                    <Badge key={p} variant="outline" className="text-[11px] h-5 cursor-pointer hover:bg-primary/10" onClick={() => setSelectedArea(p)}>
                                      {p}
                                    </Badge>
                                  ))}
                                  {a.practice_areas.length > 4 && (
                                    <Badge variant="outline" className="text-[11px] h-5 text-muted-foreground">
                                      +{a.practice_areas.length - 4}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              {/* Short bio */}
                              {(a.bio || a.professional_bio) && (
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                                  {a.professional_bio || a.bio}
                                </p>
                              )}
                            </div>
                            {/* Actions */}
                            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                              {a.phone && (
                                <a href={`tel:${a.phone}`}>
                                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 w-full">
                                    <Phone className="h-3 w-3" /> Call
                                  </Button>
                                </a>
                              )}
                              {a.email && (
                                <a href={`mailto:${a.email}`}>
                                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 w-full">
                                    <Mail className="h-3 w-3" /> Email
                                  </Button>
                                </a>
                              )}
                              {a.website && (
                                <a href={a.website} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 w-full">
                                    <ExternalLink className="h-3 w-3" /> Website
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-4">
                {/* Emergency */}
                <Card className="border-red-500/30 bg-red-500/5">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      Being Detained in {stateInfo.abbr}?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      You have the right to remain silent. Ask for a lawyer immediately. Do not consent to searches.
                    </p>
                    <Button variant="destructive" size="sm" className="w-full" asChild>
                      <Link to="/rights">Know Your Rights</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/do-this-now">What To Do Right Now</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Top Cities */}
                {cities.length > 0 && (
                  <Card className="border-border/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> Top Cities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-0.5">
                      {cities.map(([city, count]) => (
                        <button
                          key={city}
                          onClick={() => setSearchQuery(city)}
                          className="flex items-center justify-between w-full text-left px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors"
                        >
                          <span>{city}</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5">{count}</Badge>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Practice Areas */}
                {practiceAreas.length > 0 && (
                  <Card className="border-border/50">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Scale className="h-4 w-4 text-primary" /> Practice Areas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-0.5">
                      {practiceAreas.slice(0, 10).map(([area, count]) => (
                        <button
                          key={area}
                          onClick={() => setSelectedArea(selectedArea === area ? null : area)}
                          className={`flex items-center justify-between w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${selectedArea === area ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                        >
                          <span className="truncate">{area}</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0">{count}</Badge>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Resources */}
                <Card className="border-border/50">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-1">
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start text-xs h-8">
                      <Link to="/tools">File FOIA Request</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start text-xs h-8">
                      <Link to="/community">Join Community</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start text-xs h-8">
                      <Link to="/resources">Resource Library</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start text-xs h-8">
                      <Link to="/states">← All States</Link>
                    </Button>
                  </CardContent>
                </Card>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
