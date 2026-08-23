import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Scale, Users, Shield, FileText } from "lucide-react";

const references = [
  {
    name: "U.S. Department of Justice — Civil Rights Division",
    description: "Federal civil-rights information and enforcement resources from the Department of Justice.",
    website: "https://www.justice.gov/crt",
    icon: Shield,
  },
  {
    name: "ACLU — Know Your Rights",
    description: "Public Know Your Rights materials published by the American Civil Liberties Union.",
    website: "https://www.aclu.org/know-your-rights",
    icon: Scale,
  },
  {
    name: "Reporters Committee — Open Government Guide",
    description: "State-by-state open-government research published by the Reporters Committee for Freedom of the Press.",
    website: "https://www.rcfp.org/open-government-guide",
    icon: FileText,
  },
  {
    name: "National Lawyers Guild",
    description: "Public resources and organization information from the National Lawyers Guild.",
    website: "https://www.nlg.org",
    icon: Users,
  },
  {
    name: "Electronic Frontier Foundation",
    description: "Digital-rights research, guides, and legal resources published by the Electronic Frontier Foundation.",
    website: "https://www.eff.org",
    icon: Scale,
  },
];

export const Resources = () => {
  return (
    <section id="resources" className="py-12 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-3">External Reference Resources</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Direct links to organizations and government sources that publish their own civil-rights, legal, and public-records material. These links are references, not endorsements or guarantees of legal assistance.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {references.map(({ name, description, website, icon: Icon }) => (
              <Card key={website} className="h-full">
                <CardHeader>
                  <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={website} target="_blank" rel="noopener noreferrer">
                      Open source site
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6 text-sm text-muted-foreground leading-relaxed">
              Civil Rights Hub's legacy internal resource-library records are being re-verified before public display. A resource being linked here does not mean Civil Rights Hub has verified every statement on the external site, and it does not create an attorney-client or other professional relationship.
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
