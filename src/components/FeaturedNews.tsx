import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Flame, Newspaper, Search } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  link: string;
  category: "auditors" | "activists" | "journalists";
  tags: string[];
  publishedAt: string;
  urgency: "high" | "medium" | "low";
}

// PLACEHOLDER DATA - Replace with real news sources via database or API
const NEWS_ITEMS: NewsItem[] = [
  {
    id: "aclu-filming",
    title: "ACLU: Know Your Rights When Taking Photos and Videos",
    summary:
      "The ACLU provides comprehensive guidance on constitutional protections for photography and video recording in public spaces.",
    source: "ACLU",
    link: "https://www.aclu.org/know-your-rights/stopped-by-police",
    category: "journalists",
    tags: ["First Amendment", "Filming Police"],
    publishedAt: "2026-01-01",
    urgency: "high",
  },
  {
    id: "rcfp-guide",
    title: "Reporters Committee First Amendment Handbook",
    summary:
      "Comprehensive legal guide for journalists covering access to courts, public records, and newsgathering rights.",
    source: "Reporters Committee for Freedom of the Press",
    link: "https://www.rcfp.org/first-amendment-handbook/",
    category: "journalists",
    tags: ["First Amendment", "Press Freedom"],
    publishedAt: "2026-01-01",
    urgency: "medium",
  },
  {
    id: "eff-know-your-rights",
    title: "EFF: Know Your Rights When Taking Photos and Making Video",
    summary:
      "Electronic Frontier Foundation guide to your rights when documenting in public, including police encounters.",
    source: "Electronic Frontier Foundation",
    link: "https://www.eff.org/issues/know-your-rights",
    category: "auditors",
    tags: ["Photography Rights", "Public Access"],
    publishedAt: "2026-01-01",
    urgency: "medium",
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "auditors", label: "Auditors" },
  { id: "activists", label: "Activists" },
  { id: "journalists", label: "Journalists" },
];

const urgencyWeight: Record<NewsItem["urgency"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const FeaturedNews = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredNews = useMemo(() => {
    return NEWS_ITEMS.filter((story) => {
      const matchesCategory = category === "all" || story.category === category;
      const normalizedQuery = search.trim().toLowerCase();
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${story.title} ${story.summary} ${story.tags.join(" ")}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    }).sort((a, b) => {
      const urgencyDelta = urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
      if (urgencyDelta !== 0) return urgencyDelta;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [category, search]);

  const heroStory = filteredNews[0] ?? NEWS_ITEMS[0];
  const supportingStories = filteredNews
    .filter((story) => story.id !== heroStory.id)
    .slice(0, 4);

  return (
    <section id="news" className="border-y border-border/60 bg-muted/30 py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 md:gap-6 text-center">
          <div className="space-y-2 md:space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold">
              <Newspaper className="h-3 w-3 md:h-4 md:w-4" />
              News Desk for Auditors & Activists
            </div>
            <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-3xl mx-auto px-4">
              Track civil rights stories that impact field journalists, accountability activists, and attorneys.
            </p>
          </div>
          <div className="w-full max-w-3xl mx-auto flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search investigations, statutes, or agencies"
              className="flex-1 text-sm"
            />
          </div>
        </div>

        <Tabs value={category} onValueChange={setCategory} className="mt-6 md:mt-10">
          <TabsList className="mx-auto flex flex-wrap gap-1 md:gap-2 h-auto p-1">
            {CATEGORY_TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="px-2 md:px-4 text-xs md:text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={category} className="mt-6 md:mt-8">
            <div className="grid gap-4 md:gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Hero Story */}
              <Card className="bg-background/80 shadow-strong border border-primary/30">
                <CardHeader className="p-4 md:p-6 space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-primary">
                    <Flame className="h-3 w-3 md:h-4 md:w-4" />
                    Breaking Signal
                  </div>
                  <CardTitle className="text-lg md:text-2xl lg:text-3xl leading-tight">{heroStory.title}</CardTitle>
                  <CardDescription className="text-sm md:text-base text-muted-foreground line-clamp-3 md:line-clamp-none">
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
                    {heroStory.source} • {new Date(heroStory.publishedAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full sm:w-auto text-xs md:text-sm"
                    onClick={() => window.open(heroStory.link, "_blank") }
                  >
                    Read investigation
                    <ArrowUpRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Supporting Stories - Hidden on small mobile, shown on larger screens */}
              <div className="hidden sm:grid gap-3 md:gap-4">
                {supportingStories.slice(0, 3).map((story) => (
                  <Card key={story.id} className="border-border/70 hover:border-primary/60 transition">
                    <CardHeader className="p-3 md:p-4 space-y-2 md:space-y-3">
                      <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground">
                        <span className="truncate">{story.source}</span>
                        <span className="flex-shrink-0">{new Date(story.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="text-sm md:text-base lg:text-lg leading-snug line-clamp-2">{story.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs md:text-sm">
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
                      <Button variant="ghost" size="icon" className="h-7 w-7 md:h-9 md:w-9 flex-shrink-0" onClick={() => window.open(story.link, "_blank") }>
                        <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {supportingStories.length === 0 && (
                  <Card>
                    <CardContent className="py-4 md:py-6 text-center text-xs md:text-sm text-muted-foreground">
                      No additional stories match your filters yet. Try another keyword.
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
