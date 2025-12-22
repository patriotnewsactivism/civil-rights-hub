import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  Wrench,
  BookOpenText,
  Newspaper,
  LifeBuoy,
} from "lucide-react";

const SECTIONS = [
  {
    id: "rights",
    title: "Know Your Rights",
    description: "State-aware guides, scripts, and pocket PDFs for stops, filming, and searches.",
    icon: ShieldCheck,
    href: "/rights",
    cta: "Open guides",
  },
  {
    id: "do-this-now",
    title: "Do This Now",
    description: "Scenario playbooks with 30-second scripts, do/don'ts, and quick exports.",
    icon: Zap,
    href: "/do-this-now",
    cta: "Run a playbook",
  },
  {
    id: "tools",
    title: "Tools",
    description: "FOIA builder, evidence checklists, violation reporting, and AI research copilots.",
    icon: Wrench,
    href: "/tools",
    cta: "Launch tools",
  },
  {
    id: "learn",
    title: "Learn",
    description: "Federal and state law library with recording rules, ID laws, and interactive maps.",
    icon: BookOpenText,
    href: "/learn",
    cta: "Browse laws",
  },
  {
    id: "newsroom",
    title: "Newsroom",
    description: "Investigations, document drops, and explainers from We The People News.",
    icon: Newspaper,
    href: "/newsroom",
    cta: "Read coverage",
  },
  {
    id: "help",
    title: "Get Help",
    description: "Attorney directory, pro-bono intake, hotlines, and safety contacts for your state.",
    icon: LifeBuoy,
    href: "/help",
    cta: "Find support",
  },
];

export const SectionEntryGrid = () => (
  <section className="py-12" aria-labelledby="task-navigation">
    <div className="container mx-auto px-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary font-semibold">Start here</p>
          <h2 id="task-navigation" className="text-3xl font-bold">What do you need to do?</h2>
          <p className="text-muted-foreground max-w-3xl">
            Jump into task-based hubs with scripts, tools, and contacts grouped by outcome instead of topic silos.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.id} className="h-full border-border/70">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Icon className="h-5 w-5" />
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </div>
                <CardDescription className="text-base text-foreground/80">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={section.href}>{section.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </section>
);
