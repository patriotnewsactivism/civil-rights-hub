import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";
import { DonationCTA } from "@/components/DonationCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ExternalLink, Server, Shield, Database, GitBranch, ReceiptText, AlertTriangle } from "lucide-react";

const INFRASTRUCTURE = [
  {
    icon: Server,
    item: "Netlify",
    role: "Web hosting and deployment",
    evidence: "netlify.toml deployment configuration and live production deployment",
    status: "Confirmed",
  },
  {
    icon: Database,
    item: "Supabase",
    role: "Application database, authentication, and related backend services",
    evidence: "Application source and Supabase migrations/functions in the public repository",
    status: "Confirmed",
  },
  {
    icon: GitBranch,
    item: "GitHub",
    role: "Public source repository and change history",
    evidence: "patriotnewsactivism/civil-rights-hub",
    status: "Confirmed",
  },
];

const DISCLOSURE_LIMITS = [
  "No connected billing or accounting source is currently available to this page, so exact monthly operating costs are not published as verified figures.",
  "No independently verified revenue ledger is connected, so donor totals, funding mix, grant status, and monthly revenue are not represented as established facts.",
  "No tax-status or tax-deductibility representation is made on this page. Contributors should rely on the payment receipt and qualified tax advice for their own situation.",
  "The public repository currently has no LICENSE file, so public source visibility should not be confused with a grant of open-source reuse rights.",
  "Attorney, activist, incident, and accountability datasets remain withheld until source provenance and database enforcement are verified in production.",
];

const GOVERNANCE_POINTS = [
  "Application changes are visible through the public GitHub commit and pull-request history.",
  "Legacy public datasets are being withheld rather than treated as verified solely because they exist in old seed data.",
  "Legal-reference content is being migrated toward direct citations to statutes, controlling cases, and other primary authority.",
  "Corrections are invited, but the project does not publish an artificial guaranteed correction turnaround time.",
  "Financial claims should be added only when they can be tied to current billing, accounting, or payment records.",
];

const Transparency = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Transparency | Civil Rights Hub"
      description="Transparency status for Civil Rights Hub: confirmed infrastructure, public source history, data-integrity safeguards, and disclosure limits where financial or operational facts are not independently verified."
      ogTitle="Transparency — Civil Rights Hub"
      ogDescription="What Civil Rights Hub can currently verify, what remains under review, and what the project deliberately does not claim without evidence."
      canonicalUrl="https://civilrightshub.org/transparency"
    />
    <Header />
    <main className="flex-1">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
            <Shield className="h-4 w-4" /> Transparency status
          </div>
          <h1 className="text-4xl font-black">Say what we know. Label what we don't.</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Accountability requires more than publishing confident-looking numbers. This page distinguishes facts that can be verified from current infrastructure and source history from financial or operational claims that do not yet have connected evidence.
          </p>
          <p className="text-sm text-muted-foreground">Last reviewed: August 22, 2026</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-2xl font-bold mb-2">Public data status</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          Legacy directory and accountability datasets are intentionally withheld during provenance reconstruction.
        </p>
        <VerifiedDataHold />
      </section>

      <section className="border-t">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <Server className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Confirmed infrastructure</h2>
          </div>
          <p className="text-muted-foreground mb-8 text-sm">
            These providers and roles are directly evidenced by the application source or live deployment configuration. No price is inferred from a provider's public list price.
          </p>
          <div className="space-y-3">
            {INFRASTRUCTURE.map(({ icon: Icon, item, role, evidence, status }) => (
              <Card key={item}>
                <CardContent className="p-5 flex items-start gap-4">
                  <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{item}</p>
                      <Badge variant="outline" className="text-xs">{status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{role}</p>
                    <p className="text-xs text-muted-foreground mt-2">Evidence: {evidence}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <ReceiptText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Financial disclosure status</h2>
          </div>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Exact costs and revenue are not currently verified here
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {DISCLOSURE_LIMITS.map((point) => (
                <p key={point} className="text-sm text-muted-foreground leading-relaxed">{point}</p>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-8">Governance &amp; correction standard</h2>
          <ul className="space-y-4">
            {GOVERNANCE_POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <Shield className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{point}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href="https://github.com/patriotnewsactivism/civil-rights-hub" target="_blank" rel="noopener noreferrer" className="gap-2">
                Inspect source &amp; change history <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
            <Button variant="outline" asChild><Link to="/about">About the project</Link></Button>
          </div>
        </div>
      </section>

      <DonationCTA variant="banner" />
    </main>
    <Footer />
  </div>
);

export default Transparency;
