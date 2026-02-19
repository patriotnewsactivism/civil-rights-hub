import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Zap,
  Wrench,
  BookOpenText,
  Newspaper,
  LifeBuoy,
  Radio,
  FileText,
  Scale,
  Users,
  MapPin,
  ArrowRight,
} from "lucide-react";

const QUICK_ACCESS = [
  {
    title: "Know Your Rights",
    description: "State-aware guides for stops, filming, and searches",
    icon: ShieldCheck,
    href: "/rights",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Do This Now",
    description: "30-second scripts and playbooks for incidents",
    icon: Zap,
    href: "/do-this-now",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Tools",
    description: "FOIA builder, scanners, violation reports",
    icon: Wrench,
    href: "/tools",
    color: "text-slate-600",
    bg: "bg-slate-100",
  },
  {
    title: "State Laws",
    description: "Recording rules, ID laws by jurisdiction",
    icon: BookOpenText,
    href: "/learn",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Newsroom",
    description: "Investigations and document drops",
    icon: Newspaper,
    href: "/newsroom",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Get Help",
    description: "Attorneys, hotlines, safety contacts",
    icon: LifeBuoy,
    href: "/help",
    color: "text-red-600",
    bg: "bg-red-50",
  },
];

const FEATURED_TOOLS = [
  { label: "Live Scanner", icon: Radio, href: "/tools#scanner" },
  { label: "FOIA Builder", icon: FileText, href: "/tools#foia" },
  { label: "Find Attorney", icon: Scale, href: "/help" },
  { label: "Activist Directory", icon: Users, href: "/community" },
  { label: "Accountability Map", icon: MapPin, href: "/tools#map" },
];

export const QuickAccessHub = () => (
  <section className="py-4">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-xl font-semibold">Quick Access</h2>
        <p className="text-sm text-muted-foreground">Jump to any resource</p>
      </div>
      <Badge variant="secondary" className="text-xs">
        6 hubs
      </Badge>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {QUICK_ACCESS.map((section) => {
        const Icon = section.icon;
        return (
          <Link
            key={section.title}
            to={section.href}
            className="group flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:border-border bg-card hover:bg-muted/50 transition-all"
          >
            <div className={`p-2 rounded-md ${section.bg}`}>
              <Icon className={`h-5 w-5 ${section.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm group-hover:text-primary transition-colors">
                {section.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {section.description}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </Link>
        );
      })}
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {FEATURED_TOOLS.map((tool) => {
        const Icon = tool.icon;
        return (
          <Link
            key={tool.label}
            to={tool.href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 border border-border/50 hover:border-border transition-colors"
          >
            <Icon className="h-3 w-3" />
            {tool.label}
          </Link>
        );
      })}
    </div>
  </section>
);
