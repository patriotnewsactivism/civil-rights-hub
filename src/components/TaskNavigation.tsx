import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight, Gavel, Map, Newspaper, Shield, Sparkles, Wrench } from "lucide-react";

const TASK_SECTIONS = [
  {
    title: "Know Your Rights",
    description: "State-aware guides, emergency scripts, and quick downloads to keep you safe.",
    to: "/rights",
    icon: Shield
  },
  {
    title: "Do This Now",
    description: "Rapid response playbooks for stops, searches, and protests with copy-ready scripts.",
    to: "/do-this-now",
    icon: Sparkles
  },
  {
    title: "Tools",
    description: "FOIA builder, evidence tracker, and accountability workflows in one place.",
    to: "/tools",
    icon: Wrench
  },
  {
    title: "Learn",
    description: "Federal and state law library, recording rules, and interactive maps by jurisdiction.",
    to: "/learn",
    icon: Map
  },
  {
    title: "Newsroom",
    description: "Investigations, explainers, and source docs from the Civil Rights Hub desk.",
    to: "/news",
    icon: Newspaper
  },
  {
    title: "Get Help",
    description: "Find attorneys, legal aid, and hotlines with clear next steps to request support.",
    to: "/help",
    icon: Gavel
  }
];

export function TaskNavigation() {
  return (
    <section className="container mx-auto px-4 py-10" aria-labelledby="task-navigation-heading">
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Start here</p>
          <h2 id="task-navigation-heading" className="text-3xl font-bold">Task-based navigation</h2>
          <p className="text-muted-foreground max-w-3xl">
            Choose the path that matches what you need right now. Each section is organized around urgent actions,
            tools, and trustworthy information with clear disclaimers and source notes.
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link to="/do-this-now">
            Jump to action
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TASK_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-semibold">{section.title}</span>
                </div>
                <CardTitle className="text-xl leading-tight">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={section.to} aria-label={`Open ${section.title}`}>
                    Explore {section.title}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export default TaskNavigation;
