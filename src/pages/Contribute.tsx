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
  DollarSign,
  Code,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const CASHAPP_URL = "https://cash.app/$WeThePeopleNews";
const VENMO_URL = "https://venmo.com/WeThePeopleNews";
const GITHUB_URL = "https://github.com/patriotnewsactivism/civil-rights-hub";
const CONTACT_EMAIL = "info@civilrightshub.org";

const WAYS = [
  {
    icon: AlertCircle,
    title: "Submit an incident report",
    description:
      "Document an incident for review. A submission is not treated as verified public evidence merely because it was received; publication requires the applicable review and provenance standard.",
    cta: "Draft an incident report",
    to: "/do-this-now#report",
    internal: true,
  },
  {
    icon: Scale,
    title: "Suggest an attorney record",
    description:
      "Attorney listings are currently withheld while legacy data is rebuilt. Source-backed additions or corrections can be sent for later verification without promising immediate publication.",
    cta: "Send source-backed suggestion",
    to: `mailto:${CONTACT_EMAIL}?subject=Source-backed attorney suggestion`,
    internal: false,
  },
  {
    icon: Radio,
    title: "Suggest a scanner resource",
    description:
      "If a public-safety scanner resource is missing or outdated, send the provider link and location so it can be checked before being added.",
    cta: "Suggest a scanner",
    to: `mailto:${CONTACT_EMAIL}?subject=Scanner resource suggestion`,
    internal: false,
  },
  {
    icon: Flag,
    title: "Report outdated information",
    description:
      "If you find a broken link, outdated legal reference, incorrect contact detail, or unsupported claim, send the page and a source that supports the correction when possible.",
    cta: "Report a correction",
    to: `mailto:${CONTACT_EMAIL}?subject=Content correction`,
    internal: false,
  },
  {
    icon: Code,
    title: "Propose a code change",
    description:
      "The source repository is public on GitHub. Pull requests can propose bug fixes, accessibility improvements, integrity safeguards, tests, or new features and remain subject to review before merge.",
    cta: "View public repository",
    to: GITHUB_URL,
    internal: false,
  },
  {
    icon: DollarSign,
    title: "Contribute financially",
    description:
      "Voluntary contributions can support hosting, source verification, maintenance, and continued development. No fixed allocation of an individual contribution is represented here.",
    cta: "Contribution options",
    to: "/donate",
    internal: true,
  },
];

const Contribute = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Contribute | Civil Rights Hub"
      description="Contribute to Civil Rights Hub with source-backed incident reports and corrections, scanner suggestions, code contributions, research help, or voluntary financial support."
      ogTitle="Contribute to Civil Rights Hub"
      ogDescription="Help improve source verification, public-interest research, records tools, accessibility, and platform maintenance."
      canonicalUrl="https://civilrightshub.org/contribute"
    />
    <Header />
    <main className="flex-1">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl text-center space-y-4">
          <h1 className="text-4xl font-black">Contribute evidence, corrections, code, or support</h1>
          <p className="text-lg text-muted-foreground">
            The most useful contribution is one the project can verify. Source-backed corrections,
            careful research, reproducible bug reports, and transparent code changes are more valuable
            than simply increasing the number of records in a database.
          </p>
        </div>
      </section>

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
                    <Link to={to}>{cta}<ArrowRight className="h-3.5 w-3.5" /></Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full gap-1" asChild>
                    <a href={to} target="_blank" rel="noopener noreferrer">
                      {cta}<ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">For developers</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            The application source is publicly viewable on GitHub and currently uses TypeScript,
            React, Vite, Tailwind CSS, and Supabase. The repository does not currently contain a
            LICENSE file, so this page does not imply software reuse rights beyond what the repository owner has expressly granted.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="gap-2">
                <Code className="h-4 w-4" /> View source repository <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
            <Button variant="outline" asChild><Link to="/volunteer">Volunteer as a developer</Link></Button>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Financial contributions</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Civil Rights Hub currently surfaces external payment methods for voluntary support. Exact revenue,
            operating cost, donor mix, and allocation figures are not represented as verified facts without connected accounting evidence.
            See the <Link to="/transparency" className="text-primary underline underline-offset-2">Transparency page</Link> for the current disclosure standard.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
            <a href={CASHAPP_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 rounded-xl border p-5 hover:border-primary/50 hover:bg-accent transition-colors text-center group">
              <span className="text-2xl">💸</span>
              <span className="font-semibold text-sm">CashApp</span>
              <span className="text-xs text-muted-foreground">$WeThePeopleNews</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </a>
            <a href={VENMO_URL} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 rounded-xl border p-5 hover:border-primary/50 hover:bg-accent transition-colors text-center group">
              <span className="text-2xl">💳</span>
              <span className="font-semibold text-sm">Venmo</span>
              <span className="text-xs text-muted-foreground">@WeThePeopleNews</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Verify the recipient shown by the payment provider before completing a transfer.
          </p>
        </div>
      </section>

      <DonationCTA variant="banner" />
    </main>
    <Footer />
  </div>
);

export default Contribute;
