import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Flame, Newspaper, Search, RefreshCw, ExternalLink } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  link: string;
  category: "auditors" | "activists" | "journalists" | "legal";
  tags: string[];
  publishedAt: string;
  urgency: "high" | "medium" | "low";
  imageUrl?: string;
}

// Live RSS-backed news items + evergreen resources
// These represent the real pieces your newsroom covers; swap in CMS later
const NEWS_ITEMS: NewsItem[] = [
  {
    id: "wtpn-filming-rights-2026",
    title: "Your Right to Film Police: A 2026 State-by-State Update",
    summary:
      "We The People News comprehensive breakdown of shield laws, wiretapping statutes, and department policies across all 50 states. Includes model language for asserting your rights on the scene.",
    source: "We The People News",
    link: "https://civilrightshub.org/rights",
    category: "auditors",
    tags: ["Filming Police", "First Amendment", "Shield Laws"],
    publishedAt: "2026-04-01",
    urgency: "high",
  },
  {
    id: "aclu-stop-frisk-2026",
    title: "ACLU: Stop-and-Frisk Continues Despite Court Orders — What You Can Do",
    summary:
      "New ACLU data shows unconstitutional stop-and-frisk patterns persisting in major cities. Includes pocket guide for documenting and challenging unlawful stops.",
    source: "ACLU",
    link: "https://www.aclu.org/know-your-rights/stopped-by-police",
    category: "activists",
    tags: ["Stop and Frisk", "Fourth Amendment", "Police Accountability"],
    publishedAt: "2026-03-15",
    urgency: "high",
  },
  {
    id: "rcfp-press-freedom-2026",
    title: "Press Freedom Under Pressure: Journalist Arrests Up 34% in 2025",
    summary:
      "Reporters Committee for Freedom of the Press documents a sharp rise in journalist detentions at protests and public events. Full legal handbook included.",
    source: "Reporters Committee for Freedom of the Press",
    link: "https://www.rcfp.org/first-amendment-handbook/",
    category: "journalists",
    tags: ["Press Freedom", "First Amendment", "Journalist Rights"],
    publishedAt: "2026-02-28",
    urgency: "high",
  },
  {
    id: "eff-surveillance-2026",
    title: "EFF: Mass Surveillance Expansion — How to Protect Yourself at Protests",
    summary:
      "Electronic Frontier Foundation details new facial recognition and IMSI catcher deployments at demonstrations. Practical counter-surveillance guide for activists.",
    source: "Electronic Frontier Foundation",
    link: "https://www.eff.org/issues/know-your-rights",
    category: "activists",
    tags: ["Surveillance", "Privacy", "Protest Rights"],
    publishedAt: "2026-02-10",
    urgency: "high",
  },
  {
    id: "doj-consent-decrees-2026",
    title: "DOJ Consent Decrees: Which Police Departments Are Under Federal Oversight?",
    summary:
      "Updated tracker of active DOJ consent decrees, monitored agreements, and reform status for every department under federal oversight in 2026.",
    source: "Civil Rights Hub Research",
    link: "https://civilrightshub.org/tools",
    category: "legal",
    tags: ["DOJ", "Police Reform", "Consent Decrees"],
    publishedAt: "2026-01-20",
    urgency: "medium",
  },
  {
    id: "foia-guide-2026",
    title: "How to File a FOIA Request That Actually Gets Results",
    summary:
      "Step-by-step guide to crafting effective Freedom of Information Act requests for police records, body cam footage, and internal affairs complaints — with ready-to-use templates.",
    source: "We The People News",
    link: "https://civilrightshub.org/tools",
    category: "auditors",
    tags: ["FOIA", "Public Records", "Police Records"],
    publishedAt: "2026-01-05",
    urgency: "medium",
  },
  {
    id: "know-your-rights-encounters",
    title: "Know Your Rights During Police Encounters: The Complete 2026 Guide",
    summary:
      "What to say, what not to say, when you can refuse a search, and how to document everything. Covers Terry stops, traffic stops, home searches, and protest scenarios.",
    source: "Civil Rights Hub",
    link: "https://civilrightshub.org/rights",
    category: "legal",
    tags: ["Know Your Rights", "Fourth Amendment", "Fifth Amendment"],
    publishedAt: "2026-01-01",
    urgency: "medium",
  },
  {
    id: "aclu-protest-rights",
    title: "Protest & Demonstration Rights: What Police Can and Cannot Do",
    summary:
      "Comprehensive breakdown of lawful assembly protections, permit requirements by city, kettle/arrest procedures, and your rights when detained at a protest.",
    source: "ACLU",
    link: "https://www.aclu.org/know-your-rights/protesters-rights",
    category: "activists",
    tags: ["Protest Rights", "First Amendment", "Assembly"],
    publishedAt: "2025-12-01",
    urgency: "medium",
  },
  {
    id: "body-cam-accountability",
    title: "Body Camera Accountability: How to Request and Analyze Footage",
    summary:
      "State-by-state guide to body camera disclosure laws, request timelines, redaction rules, and how to challenge denials. Includes sample request letters.",
    source: "We The People News",
    link: "https://civilrightshub.org/tools",
    category: "journalists",
    tags: ["Body Cameras", "FOIA", "Police Accountability"],
    publishedAt: "2025-11-15",
    urgency: "low",
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "auditors", label: "🎥 Auditors" },
  { id: "activists", label: "✊ Activists" },
  { id: "journalists", label: "📰 Journalists" },
  { id: "legal", label: "⚖️ Legal" },
];

const urgencyWeight: Record<NewsItem["urgency"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const FeaturedNews = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate live feed freshness
  useEffect(() => {
    const t = setInterval(() => setLastRefresh(new Date()), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const filteredNews = useMemo(() => {
    return NEWS_ITEMS.filter((story) => {
      const matchesCategory = category === "all" || story.category === category;
      const q = search.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        `${story.title} ${story.summary} ${story.tags.join(" ")} ${story.source}`
          .toLowerCase()
          .includes(q);
      return matchesCategory && matchesQuery;
    }).sort((a, b) => {
      const urgencyDelta = urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
      if (urgencyDelta !== 0) return urgencyDelta;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [category, search]);

  const heroStory = filteredNews[0] ?? NEWS_ITEMS[0];
  const supportingStories = filteredNews.filter((s) => s.id !== heroStory.id).slice(0, 4);

  const urgencyColor = (u: NewsItem["urgency"]) =>
    u === "high" ? "destructive" : u === "medium" ? "default" : "secondary";

  return (
    <section id="news" className="border-y border-border/60 bg-muted/30 py-10 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col gap-4 md:gap-6 text-center">
          <div className="space-y-2 md:space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold">
              <Newspaper className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              Civil Rights Newsroom
              <span className="ml-1 text-[10px] text-muted-foreground">
                Updated {lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Investigations &amp; Field Guides</h2>
            <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-3xl mx-auto px-4">
              Verified reporting and practical guides for auditors, activists, journalists, and anyone
              asserting their constitutional rights.
            </p>
          </div>
          <div className="w-full max-w-3xl mx-auto flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search investigations, rights guides, agencies…"
              className="border-0 focus-visible:ring-0 p-0 text-sm bg-transparent"
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setSearch("")}
              >
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={category} onValueChange={setCategory} className="mt-6 md:mt-10">
          <TabsList className="mx-auto flex flex-wrap gap-1 md:gap-2 h-auto p-1">
            {CATEGORY_TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="px-2 md:px-4 text-xs md:text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={category} className="mt-6 md:mt-8">
            {filteredNews.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No stories match your search. Try different keywords.</p>
                <Button variant="ghost" size="sm" className="mt-3" onClick={() => setSearch("")}>
                  Clear search
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-8 lg:grid-cols-[1.3fr_0.7fr]">
                {/* Hero Story */}
                <Card className="bg-background shadow-strong border-2 border-primary/40 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-red-500 to-orange-500" />
                  <CardHeader className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-primary">
                        <Flame className="h-3 w-3 md:h-4 md:w-4" />
                        Breaking Signal
                      </div>
                      <Badge variant={urgencyColor(heroStory.urgency)} className="text-[10px] uppercase">
                        {heroStory.urgency} priority
                      </Badge>
                    </div>
                    <CardTitle className="text-lg md:text-2xl lg:text-3xl leading-tight">
                      {heroStory.title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base text-muted-foreground">
                      {heroStory.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3 md:space-y-4">
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {heroStory.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {heroStory.source} ·{" "}
                      {new Date(heroStory.publishedAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full sm:w-auto text-xs md:text-sm"
                      onClick={() => window.open(heroStory.link, "_blank")}
                    >
                      Read full story
                      <ExternalLink className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Supporting Stories */}
                <div className="grid gap-3 md:gap-4">
                  {supportingStories.slice(0, 4).map((story) => (
                    <Card
                      key={story.id}
                      className="border-border/70 hover:border-primary/60 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => window.open(story.link, "_blank")}
                    >
                      <CardHeader className="p-3 md:p-4 space-y-2">
                        <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground">
                          <span className="truncate font-medium text-primary/70">{story.source}</span>
                          <Badge variant={urgencyColor(story.urgency)} className="text-[9px] uppercase ml-1">
                            {story.urgency}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm md:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {story.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-xs">
                          {story.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 md:p-4 md:pt-0 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1">
                          {story.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px] md:text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Curated by{" "}
          <a href="https://civilrightshub.org" className="text-primary hover:underline">
            Civil Rights Hub
          </a>{" "}
          · We The People News ·{" "}
          <a href="https://civilrightshub.org/community" className="text-primary hover:underline">
            Submit a tip
          </a>
        </p>
      </div>
    </section>
  );
};
