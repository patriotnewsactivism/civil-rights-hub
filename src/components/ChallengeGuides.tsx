import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  BookOpen,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Copy,
  ChevronRight,
  Scale,
  FileText,
  Users,
  Megaphone,
  Camera,
  Home,
} from "lucide-react";
import { toast } from "sonner";

interface ChallengeStep {
  step: number;
  title: string;
  detail: string;
}

interface ChallengeGuide {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  steps: ChallengeStep[];
  legal_basis: string | null;
  estimated_time: string | null;
  tools_needed: string[] | null;
  important_warnings: string[] | null;
  success_stories: string | null;
  related_laws: string[] | null;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
  first_amendment: { icon: Camera, label: "First Amendment", color: "text-blue-400" },
  fourth_amendment: { icon: Shield, label: "Fourth Amendment", color: "text-green-400" },
  recording: { icon: Camera, label: "Recording Rights", color: "text-purple-400" },
  protest: { icon: Megaphone, label: "Protest Rights", color: "text-orange-400" },
  foia: { icon: FileText, label: "FOIA / Public Records", color: "text-cyan-400" },
  police_encounter: { icon: Scale, label: "Police Encounters", color: "text-red-400" },
};

const DIFFICULTY_BADGES: Record<string, { label: string; className: string }> = {
  easy: { label: "Easy", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  moderate: { label: "Moderate", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  advanced: { label: "Advanced", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export function ChallengeGuides() {
  const [guides, setGuides] = useState<ChallengeGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGuides() {
      const { data, error } = await supabase
        .from("challenge_guides")
        .select("*")
        .order("category", { ascending: true });

      if (!error && data) {
        setGuides(data.map((g) => ({
          ...g,
          steps: (typeof g.steps === "string" ? JSON.parse(g.steps) : g.steps) as ChallengeStep[],
        })));
      }
      setLoading(false);
    }
    fetchGuides();
  }, []);

  const categories = [...new Set(guides.map((g) => g.category))];

  const filteredGuides = selectedCategory
    ? guides.filter((g) => g.category === selectedCategory)
    : guides;

  const copySteps = (guide: ChallengeGuide) => {
    const text = `${guide.title}\n\n${guide.steps.map((s) => `Step ${s.step}: ${s.title}\n${s.detail}`).join("\n\n")}${guide.legal_basis ? `\n\nLegal Basis: ${guide.legal_basis}` : ""}`;
    navigator.clipboard.writeText(text);
    toast.success("Guide copied to clipboard");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 w-2/3 bg-muted rounded mb-3" />
              <div className="h-4 w-full bg-muted rounded mb-2" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (guides.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No challenge guides yet</h3>
          <p className="text-sm text-muted-foreground">
            Challenge guides will appear here after running the database migration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            Challenge Guides
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Step-by-step instructions for asserting your rights and challenging violations
          </p>
        </div>
        <Badge variant="outline" className="w-fit">
          {guides.length} guide{guides.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const Icon = config?.icon ?? BookOpen;
          return (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className="flex items-center gap-1.5"
            >
              <Icon className={`h-3.5 w-3.5 ${selectedCategory !== cat ? (config?.color ?? "") : ""}`} />
              {config?.label ?? cat}
            </Button>
          );
        })}
      </div>

      {/* Guide cards */}
      <div className="space-y-4">
        {filteredGuides.map((guide) => {
          const catConfig = CATEGORY_CONFIG[guide.category];
          const diffBadge = DIFFICULTY_BADGES[guide.difficulty];
          const CatIcon = catConfig?.icon ?? BookOpen;

          return (
            <Card key={guide.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-primary/10 ${catConfig?.color ?? "text-primary"}`}>
                      <CatIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{guide.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {diffBadge && (
                      <Badge variant="outline" className={diffBadge.className}>
                        {diffBadge.label}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copySteps(guide)}
                      title="Copy guide"
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                  {guide.estimated_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {guide.estimated_time}
                    </span>
                  )}
                  {guide.legal_basis && (
                    <span className="flex items-center gap-1">
                      <Scale className="h-3 w-3" />
                      {guide.legal_basis}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <Accordion type="single" collapsible>
                  <AccordionItem value="steps" className="border-none">
                    <AccordionTrigger className="text-sm font-semibold text-primary hover:no-underline py-2">
                      <span className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4" />
                        {guide.steps.length} Steps — Click to expand
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 mt-2">
                        {/* Steps */}
                        <ol className="space-y-3">
                          {guide.steps.map((step) => (
                            <li key={step.step} className="flex gap-3">
                              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center mt-0.5">
                                {step.step}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{step.title}</p>
                                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{step.detail}</p>
                              </div>
                            </li>
                          ))}
                        </ol>

                        {/* Warnings */}
                        {guide.important_warnings && guide.important_warnings.length > 0 && (
                          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 mt-4">
                            <h4 className="text-sm font-bold text-destructive flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4" />
                              Important Warnings
                            </h4>
                            <ul className="space-y-1">
                              {guide.important_warnings.map((w, i) => (
                                <li key={i} className="text-xs text-destructive/80 flex items-start gap-2">
                                  <span className="mt-1">⚠️</span>
                                  {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tools needed */}
                        {guide.tools_needed && guide.tools_needed.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tools Needed</h4>
                            <div className="flex flex-wrap gap-2">
                              {guide.tools_needed.map((tool, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{tool}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Success story */}
                        {guide.success_stories && (
                          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 mt-3">
                            <h4 className="text-sm font-bold text-green-400 flex items-center gap-2 mb-1">
                              <CheckCircle2 className="h-4 w-4" />
                              Success Story
                            </h4>
                            <p className="text-xs text-green-300/80 leading-relaxed">{guide.success_stories}</p>
                          </div>
                        )}

                        {/* Related laws */}
                        {guide.related_laws && guide.related_laws.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Related Laws</h4>
                            <div className="flex flex-wrap gap-2">
                              {guide.related_laws.map((law, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{law}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
