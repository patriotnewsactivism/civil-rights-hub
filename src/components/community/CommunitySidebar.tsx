import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const SAFETY_RESOURCES: Record<string, { title: string; links: { label: string; href: string }[] }> = {
  journalist: {
    title: "Journalist Safety Sources",
    links: [
      { label: "CPJ Safety Advisories", href: "https://cpj.org/safety" },
      { label: "Reporters Committee", href: "https://www.rcfp.org" },
      { label: "Freedom of the Press Foundation", href: "https://freedom.press" },
    ],
  },
  attorney: {
    title: "Attorney Reference Sources",
    links: [
      { label: "NACDL", href: "https://www.nacdl.org" },
      { label: "NLG Legal Observer Program", href: "https://nlg.org/legalobservers" },
      { label: "ABA Civil Rights", href: "https://www.americanbar.org/groups/civil_rights" },
    ],
  },
  activist: {
    title: "Activist Safety Sources",
    links: [
      { label: "Know Your Rights", href: "/rights" },
      { label: "EFF Surveillance Self-Defense", href: "https://ssd.eff.org" },
      { label: "ACLU Protesters' Rights", href: "https://www.aclu.org/know-your-rights/protesters-rights" },
    ],
  },
};

export function CommunitySidebar({ currentUserRole }: { currentUserRole?: string | null }) {
  const safetyResources = currentUserRole ? SAFETY_RESOURCES[currentUserRole] : null;

  return (
    <div className="space-y-4">
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4">
          <p className="text-sm font-semibold">Community public-data cleanup</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Activity totals, trending counters, suggested verified profiles, incident feeds, and seeded public posts are temporarily withheld while synthetic/demo records are removed and verification rules are rebuilt.
          </p>
        </CardContent>
      </Card>

      {safetyResources && (
        <Card className="border-border/50 border-accent/30 bg-accent/5">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-accent" />
              {safetyResources.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-4 pt-0">
            {safetyResources.links.map(({ label, href }) =>
              href.startsWith("/") ? (
                <Button key={label} variant="ghost" size="sm" asChild className="h-8 w-full justify-start text-xs text-accent/90 hover:text-accent">
                  <Link to={href}>{label}</Link>
                </Button>
              ) : (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-accent/90 transition-colors hover:bg-muted hover:text-accent"
                >
                  {label}
                  <ExternalLink className="ml-auto h-3 w-3 shrink-0" />
                </a>
              ),
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm">Available resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-4 pt-0">
          {[
            { label: "Know Your Rights", to: "/rights" },
            { label: "Attorney Verification Status", to: "/attorneys" },
            { label: "Public Records Tools", to: "/tools" },
            { label: "Resource Library", to: "/resources" },
          ].map(({ label, to }) => (
            <Button key={to} variant="ghost" size="sm" asChild className="h-8 w-full justify-start text-sm">
              <Link to={to}>{label}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
