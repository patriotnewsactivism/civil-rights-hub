import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Scale, ChevronRight } from "lucide-react";

interface StateCount {
  state: string;
  count: number;
}

const STATES: { slug: string; name: string; abbr: string }[] = [
  { slug: "alabama", name: "Alabama", abbr: "AL" },
  { slug: "alaska", name: "Alaska", abbr: "AK" },
  { slug: "arizona", name: "Arizona", abbr: "AZ" },
  { slug: "arkansas", name: "Arkansas", abbr: "AR" },
  { slug: "california", name: "California", abbr: "CA" },
  { slug: "colorado", name: "Colorado", abbr: "CO" },
  { slug: "connecticut", name: "Connecticut", abbr: "CT" },
  { slug: "delaware", name: "Delaware", abbr: "DE" },
  { slug: "florida", name: "Florida", abbr: "FL" },
  { slug: "georgia", name: "Georgia", abbr: "GA" },
  { slug: "hawaii", name: "Hawaii", abbr: "HI" },
  { slug: "idaho", name: "Idaho", abbr: "ID" },
  { slug: "illinois", name: "Illinois", abbr: "IL" },
  { slug: "indiana", name: "Indiana", abbr: "IN" },
  { slug: "iowa", name: "Iowa", abbr: "IA" },
  { slug: "kansas", name: "Kansas", abbr: "KS" },
  { slug: "kentucky", name: "Kentucky", abbr: "KY" },
  { slug: "louisiana", name: "Louisiana", abbr: "LA" },
  { slug: "maine", name: "Maine", abbr: "ME" },
  { slug: "maryland", name: "Maryland", abbr: "MD" },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA" },
  { slug: "michigan", name: "Michigan", abbr: "MI" },
  { slug: "minnesota", name: "Minnesota", abbr: "MN" },
  { slug: "mississippi", name: "Mississippi", abbr: "MS" },
  { slug: "missouri", name: "Missouri", abbr: "MO" },
  { slug: "montana", name: "Montana", abbr: "MT" },
  { slug: "nebraska", name: "Nebraska", abbr: "NE" },
  { slug: "nevada", name: "Nevada", abbr: "NV" },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH" },
  { slug: "new-jersey", name: "New Jersey", abbr: "NJ" },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM" },
  { slug: "new-york", name: "New York", abbr: "NY" },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC" },
  { slug: "north-dakota", name: "North Dakota", abbr: "ND" },
  { slug: "ohio", name: "Ohio", abbr: "OH" },
  { slug: "oklahoma", name: "Oklahoma", abbr: "OK" },
  { slug: "oregon", name: "Oregon", abbr: "OR" },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA" },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI" },
  { slug: "south-carolina", name: "South Carolina", abbr: "SC" },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD" },
  { slug: "tennessee", name: "Tennessee", abbr: "TN" },
  { slug: "texas", name: "Texas", abbr: "TX" },
  { slug: "utah", name: "Utah", abbr: "UT" },
  { slug: "vermont", name: "Vermont", abbr: "VT" },
  { slug: "virginia", name: "Virginia", abbr: "VA" },
  { slug: "washington", name: "Washington", abbr: "WA" },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV" },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI" },
  { slug: "wyoming", name: "Wyoming", abbr: "WY" },
  { slug: "washington-dc", name: "Washington D.C.", abbr: "DC" },
];

export default function StatesDirectory() {
  const [counts, setCounts] = useState<Map<string, number>>(new Map());
  const [totalAttorneys, setTotalAttorneys] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      // Get all attorneys and count by state
      const { data, count } = await supabase
        .from("attorneys")
        .select("state", { count: "exact" });

      if (data) {
        const map = new Map<string, number>();
        data.forEach((row: { state: string }) => {
          const st = row.state?.toUpperCase().trim();
          if (st) map.set(st, (map.get(st) ?? 0) + 1);
        });
        setCounts(map);
        setTotalAttorneys(count ?? data.length);
      }
      setLoading(false);
    };
    fetchCounts();
  }, []);

  const filteredStates = search.trim()
    ? STATES.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.abbr.toLowerCase().includes(search.toLowerCase())
      )
    : STATES;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Find Civil Rights Attorneys by State",
    "description": `Browse ${totalAttorneys}+ civil rights attorneys across all 50 states. Free directory for police brutality, false arrest, and constitutional rights cases.`,
    "url": "https://civilrightshub.org/states",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <SEO
        title="Find Civil Rights Attorneys by State | All 50 States | Civil Rights Hub"
        description={`Browse ${totalAttorneys}+ civil rights attorneys across all 50 states. Free directory — police brutality, false arrest, excessive force, constitutional rights lawyers.`}
        keywords="civil rights attorney by state, find civil rights lawyer, police brutality attorney, constitutional rights lawyer directory"
        canonicalUrl="https://civilrightshub.org/states"
        ogUrl="https://civilrightshub.org/states"
        ogTitle="Civil Rights Attorneys in All 50 States"
        ogDescription={`Free directory of ${totalAttorneys}+ civil rights lawyers across every state.`}
        structuredData={structuredData}
      />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-b">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/attorneys" className="hover:text-primary transition-colors">Attorneys</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">All States</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Civil Rights Attorneys by{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                State
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mb-6">
              {loading
                ? "Loading directory..."
                : `${totalAttorneys} attorneys across ${counts.size} states. Find a civil rights lawyer near you — all consultations tracked are free.`}
            </p>
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search states..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredStates.map((state) => {
              const count = counts.get(state.abbr) ?? 0;
              return (
                <Link key={state.slug} to={`/state/${state.slug}`}>
                  <Card className="border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-lg p-2">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{state.name}</p>
                          <p className="text-xs text-muted-foreground">{state.abbr}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {loading ? (
                          <div className="h-5 w-8 bg-muted animate-pulse rounded" />
                        ) : count > 0 ? (
                          <Badge variant="secondary" className="text-xs">
                            <Scale className="h-3 w-3 mr-1" />
                            {count}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            —
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
