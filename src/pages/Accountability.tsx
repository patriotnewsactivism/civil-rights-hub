import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OfficerAccountability } from "@/components/OfficerAccountability";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  FileText,
  Scale,
  ExternalLink,
} from "lucide-react";

const EXTERNAL_RESOURCES = [
  {
    name: "Mapping Police Violence",
    url: "https://mappingpoliceviolence.us",
    description: "Comprehensive database of police killings in the United States",
  },
  {
    name: "Fatal Encounters",
    url: "https://fatalencounters.org",
    description: "Database documenting all deaths through police interaction",
  },
  {
    name: "The Counted (Guardian)",
    url: "https://www.theguardian.com/us-news/ng-interactive/2015/jun/01/the-counted-police-killings-us-database",
    description: "Interactive record of people killed by police in the US",
  },
  {
    name: "NACOLE",
    url: "https://www.nacole.org",
    description: "National Association for Civilian Oversight of Law Enforcement",
  },
  {
    name: "DOJ Pattern & Practice",
    url: "https://www.justice.gov/crt/pattern-and-practice-cases",
    description: "DOJ investigations into systemic police misconduct",
  },
];

export default function Accountability() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Officer & Agency Accountability Database — Civil Rights Hub"
        description="Search violations, officers, and agencies. Transparent database of reported civil rights violations and law enforcement accountability."
        keywords="police accountability, officer complaints, law enforcement violations, civil rights database, police misconduct"
        ogTitle="Officer & Agency Accountability Database"
        ogDescription="Search reported civil rights violations, officers, and agencies. Community-driven accountability."
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-red-500/10 via-background to-primary/5 border-b">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="gap-1.5 text-xs">
                <Shield className="h-3 w-3" /> Accountability Database
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Officer &amp; Agency{" "}
              <span className="bg-gradient-to-r from-red-400 to-primary bg-clip-text text-transparent">
                Accountability
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              A transparent, community-driven database of reported civil rights violations,
              the officers and agencies involved, and the outcomes. Knowledge is power — 
              transparency drives reform.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Button asChild>
                <Link to="/do-this-now">
                  <AlertTriangle className="h-4 w-4 mr-2" /> Report a Violation
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/tools">
                  <FileText className="h-4 w-4 mr-2" /> File FOIA Request
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main DB Component */}
        <OfficerAccountability />

        {/* External Resources */}
        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            External Accountability Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXTERNAL_RESOURCES.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="border-border/50 hover:border-primary/30 transition-colors h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm">{r.name}</h3>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
