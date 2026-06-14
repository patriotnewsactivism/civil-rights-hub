import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { DonationCTA } from "@/components/DonationCTA";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Scale,
  Radio,
  Flag,
  Heart,
  Code,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const PATREON_URL = "https://www.patreon.com/WeThePeopleNews";
const CASHAPP_URL = "https://cash.app/$WeThePeopleNews";
const VENMO_URL = "https://venmo.com/WeThePeopleNews";
const GITHUB_URL = "https://github.com/patriotnewsactivism/civil-rights-hub";

const WAYS = [
  {
    icon: AlertCircle,
    title: "Submit a violation report",
    description:
      "Document civil rights incidents in your community. Your report goes into the public feed and helps build accountability over time.",
    cta: "Report a violation",
    to: "/do-this-now#report",
    internal: true,
  },
  {
    icon: Scale,
    title: "Add an attorney",
    description:
      "Know a civil rights attorney who isn't in our directory? Submit their info (with their permission) so others can find them.",
    cta: "Suggest an attorney",
    to: "/attorneys",
    internal: true,
  },
  {
    icon: Radio,
    title: "Suggest a scanner feed",
    description:
      "We list 500+ police scanner feeds. If your area is missing, let us know the Broadcastify link and we'll add it.",
    cta: "Suggest a scanner",
    to: "mailto:info@civilrightshub.org?subject=Scanner feed suggestion",
    internal: false,
  },
  {
    icon: Flag,
    title: "Report outdated information",
    description:
      "Laws change. Attorney contact info goes stale. If you spot something wrong, flag it and we'll fix it quickly.",
    cta: "Report an error",
    to: "mailto:info@civilrightshub.org?subject=Content correction",
    internal: false,
  },
  {
    icon: Code,
    title: "Contribute code",
    description:
      "The entire platform is open source on GitHub. Bug fixes, new features, accessibility improvements — all PRs welcome.",
    cta: "View on GitHub",
    to: GITHUB_URL,
    internal: false,
  },
  {
    icon: Heart,
    title: "Donate",
    description:
      "Hosting, data, and development cost money. Donations go directly to keeping the platform free and expanding its reach.",
    cta: "Donate",
    to: PATREON_URL,
    internal: false,
  },
];

const Contribute = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Contribute | Civil Rights Hub"
      description="Contribute to Civil Rights Hub — submit violations, add attorneys, suggest scanner feeds, report errors, contribute code, or donate."
      ogTitle="Contribute to Civil Rights Hub"
      ogDescription="Six ways to help make civil rights resources better for everyone."
    />
    <Header />
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl text-center space-y-4">
          <h1 className="text-4xl font-black">Every contribution matters</h1>
          <p className="text-lg text-muted-foreground">
            Civil Rights Hub improves because people like you add data, report errors, and help
            spread the word. You don't need to code or donate — even submitting one violation
            report helps someone in the future.
          </p>
        </div>
      </section>

      {/* Ways to contribute */}
      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <h2 className="text-2xl font-bold mb-8">Ways to contribute</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WAYS.map(({ icon: Icon, title, description, cta, to, internal }) => (
            <Card key={title} className="flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <p className="text-sm text-muted-foreground flex-1">{description}</p>
                {internal ? (
                  <Button variant="outline" size="sm" className="w-full gap-1" asChild>
                    <Link to={to}>
                      {cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full gap-1" asChild>
                    <a href={to} target="_blank" rel="noopener noreferrer">
                      {cta}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* GitHub section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">For developers</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            The full codebase is on GitHub under an open source license. We use TypeScript, React,
            Vite, Tailwind CSS, and Supabase. Issues are labeled — look for{" "}
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">good first issue</code> to
            get started.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="gap-2">
                <Code className="h-4 w-4" />
                View on GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/volunteer">Volunteer as a developer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Financial contributions */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Financial contributions</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            All donations go directly to hosting, data costs, and platform development. We publish
            our costs monthly on the{" "}
            <Link to="/transparency" className="text-primary underline underline-offset-2">
              Transparency page
            </Link>
            .
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href={PATREON_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-xl border p-5 hover:border-primary/50 hover:bg-accent transition-colors text-center group"
            >
              <span className="text-2xl">🎁</span>
              <span className="font-semibold text-sm">Patreon</span>
              <span className="text-xs text-muted-foreground">Monthly tiers from $5</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </a>
            <a
              href={CASHAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-xl border p-5 hover:border-primary/50 hover:bg-accent transition-colors text-center group"
            >
              <span className="text-2xl">💸</span>
              <span className="font-semibold text-sm">CashApp</span>
              <span className="text-xs text-muted-foreground">$WeThePeopleNews</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </a>
            <a
              href={VENMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-xl border p-5 hover:border-primary/50 hover:bg-accent transition-colors text-center group"
            >
              <span className="text-2xl">💳</span>
              <span className="font-semibold text-sm">Venmo</span>
              <span className="text-xs text-muted-foreground">@WeThePeopleNews</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </section>

      <DonationCTA variant="banner" />
    </main>
    <Footer />
  </div>
);

export default Contribute;
