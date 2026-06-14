import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ImpactCounter } from "@/components/ImpactCounter";
import { DonationCTA } from "@/components/DonationCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ExternalLink, TrendingUp, DollarSign, Server, Shield } from "lucide-react";

// Update these figures monthly
const MONTHLY_COSTS = [
  { item: "Supabase (database + auth + realtime)", amount: "$25", category: "Infrastructure" },
  { item: "Vercel (hosting + CDN + analytics)", amount: "$20", category: "Infrastructure" },
  { item: "Domain registration (civilrightshub.org)", amount: "$2", category: "Infrastructure" },
  { item: "Email service (Buttondown newsletter)", amount: "$9", category: "Communications" },
  { item: "Development tools & software", amount: "$15–30", category: "Development" },
];

const REVENUE_SOURCES = [
  { source: "Patreon monthly donors", status: "active" },
  { source: "CashApp / Venmo one-time donations", status: "active" },
  { source: "Stripe recurring donations", status: "coming-soon" },
  { source: "Foundation grants", status: "planned" },
];

const GOVERNANCE_POINTS = [
  "We The People News makes all editorial and technical decisions.",
  "No law enforcement agencies, political campaigns, or government bodies fund or influence the platform.",
  "Content corrections are made within 48 hours of a verified report.",
  "User data is stored on Supabase (US-based) and never sold or shared with third parties.",
  "The full codebase is open source and publicly auditable on GitHub.",
];

const Transparency = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Transparency | Civil Rights Hub"
      description="Monthly operating costs, revenue sources, impact metrics, and governance principles for Civil Rights Hub."
      ogTitle="Transparency — Civil Rights Hub"
      ogDescription="Full breakdown of how Civil Rights Hub is funded, what it costs to run, and how decisions are made."
    />
    <Header />
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
            <Shield className="h-4 w-4" />
            Transparency report
          </div>
          <h1 className="text-4xl font-black">Open books, open code</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe platforms that advocate for accountability should hold themselves to the same
            standard. Here's exactly what it costs to run Civil Rights Hub and where the money comes
            from.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: June 2026
          </p>
        </div>
      </section>

      {/* Impact */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-2xl font-bold mb-2">Platform impact</h2>
        <p className="text-muted-foreground mb-8 text-sm">Live counts from the database</p>
        <ImpactCounter />
      </section>

      {/* Monthly costs */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Monthly operating costs</h2>
          </div>
          <p className="text-muted-foreground mb-8 text-sm">
            Total estimated range: <strong className="text-foreground">$70–$85/month</strong>
          </p>
          <div className="space-y-3">
            {MONTHLY_COSTS.map(({ item, amount, category }) => (
              <div
                key={item}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div>
                  <p className="text-sm font-medium">{item}</p>
                  <p className="text-xs text-muted-foreground">{category}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{amount}/mo</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Costs above reflect current tier usage. Infrastructure scales with traffic — high-traffic
            months may cost more.
          </p>
        </div>
      </section>

      {/* Revenue */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Revenue sources</h2>
          </div>
          <div className="space-y-3">
            {REVENUE_SOURCES.map(({ source, status }) => (
              <div key={source} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <p className="text-sm font-medium">{source}</p>
                <Badge
                  variant={status === "active" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {status === "active" ? "Active" : status === "coming-soon" ? "Coming soon" : "Planned"}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-xl border bg-card">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note on 501(c)(3) status:</strong> We The People
              News is not currently a registered 501(c)(3) nonprofit. Donations are not
              tax-deductible. We are evaluating formal nonprofit status as the platform grows.
            </p>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-8">Governance</h2>
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
              <a
                href="https://github.com/patriotnewsactivism/civil-rights-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                Audit the code on GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/about">About the project</Link>
            </Button>
          </div>
        </div>
      </section>

      <DonationCTA variant="banner" />
    </main>
    <Footer />
  </div>
);

export default Transparency;
