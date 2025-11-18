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

const NEWS_ITEMS: NewsItem[] = [
  {
    id: "press-freedom-ordinance",
    title: "Federal appeals court revives citizen right to film police",
    summary:
      "A unanimous panel held that recording officers during traffic stops and street encounters is protected speech, limiting qualified immunity defenses.",
    source: "We The People News",
    link: "https://wethepeoplenews.com/investigations/press-freedom",
    category: "journalists",
    tags: ["First Amendment", "Filming Police"],
    publishedAt: "2024-05-29",
    urgency: "high",
  },
  {
    id: "public-records-fee-cap",
    title: "States move to cap outrageous public-records fees",
    summary:
      "Colorado, Ohio, and Florida legislators propose uniform fee schedules so local agencies cannot price activists out of FOIA-style requests.",
    source: "Open States Monitor",
    link: "https://openstates.org/spotlight/fee-cap",
    category: "activists",
    tags: ["FOIA", "State Policy"],
    publishedAt: "2024-05-22",
    urgency: "medium",
  },
  {
    id: "auditor-security-bill",
    title: "Proposed anti-auditor bill stalled after viral hearing",
    summary:
      "Grassroots auditors organized rapid testimony and halted a bill that would have criminalized recording government buildings from sidewalks.",
    source: "Civic Oversight Daily",
    link: "https://civicoveright.news/analysis/auditor-bill",
    category: "auditors",
    tags: ["Legislation", "Public Access"],
    publishedAt: "2024-05-25",
    urgency: "medium",
  },
  {
    id: "pattern-or-practice",
    title: "DOJ expands pattern-or-practice probes into mid-sized departments",
    summary:
      "Investigators are prioritizing cities where independent journalists have already documented retaliation against cop watchers.",
    source: "Justice Wire",
    link: "https://justicewire.gov/news/pattern-practice",
    category: "auditors",
    tags: ["DOJ", "Police Accountability"],
    publishedAt: "2024-05-20",
    urgency: "high",
  },
  {
    id: "press-safety-training",
    title: "Newsroom safety training adds modules for solo livestreamers",
    summary:
      "Major press freedom groups released open curricula so freelancers and auditors can build rapid response plans with attorneys.",
    source: "Reporters Guild",
    link: "https://reportersguild.org/resources/safety",
    category: "journalists",
    tags: ["Safety", "Training"],
    publishedAt: "2024-05-18",
    urgency: "low",
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
    <section id="news" className="border-y border-border/60 bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 text-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-sm font-semibold">
              <Newspaper className="h-4 w-4" />
              News Desk for Auditors & Activists
            </div>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Track the civil rights stories that impact field journalists, accountability activists, and attorneys before your next livestream.
            </p>
          </div>
          <div className="w-full max-w-3xl mx-auto flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search investigations, statutes, or agencies"
              className="flex-1"
            />
          </div>
        </div>

        <Tabs value={category} onValueChange={setCategory} className="mt-10">
          <TabsList className="mx-auto flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="px-4">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={category} className="mt-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="bg-background/80 shadow-strong border border-primary/30">
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Flame className="h-4 w-4" />
                    Breaking Signal
                  </div>
                  <CardTitle className="text-2xl md:text-3xl leading-tight">{heroStory.title}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {heroStory.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {heroStory.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {heroStory.source} • {new Date(heroStory.publishedAt).toLocaleDateString()}
                  </p>
                  <Button variant="default" className="w-full sm:w-auto" onClick={() => window.open(heroStory.link, "_blank") }>
                    Read investigation
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              <div className="grid gap-4">
                {supportingStories.map((story) => (
                  <Card key={story.id} className="border-border/70 hover:border-primary/60 transition">
                    <CardHeader className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{story.source}</span>
                        <span>{new Date(story.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="text-lg leading-snug">{story.title}</CardTitle>
                      <CardDescription className="line-clamp-3 text-sm">
                        {story.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {story.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => window.open(story.link, "_blank") }>
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {supportingStories.length === 0 && (
                  <Card>
                    <CardContent className="py-6 text-center text-sm text-muted-foreground">
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
