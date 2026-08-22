import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";
import { DonationCTA } from "@/components/DonationCTA";
import { Button } from "@/components/ui/button";
import { Shield, ExternalLink, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const STORY_ITEMS = [
  {
    heading: "Why it exists",
    text: "Civil Rights Hub was built to reduce the friction of finding rights references, public-records tools, documentation workflows, scanner resources, and research material across separate services.",
  },
  {
    heading: "What is public now",
    text: "Emergency tools, rights-reference material, public-records workflows, scanner resources, research features, community tools, and incident-submission intake are available through the site.",
  },
  {
    heading: "Current integrity work",
    text: "Legacy attorney, activist, incident, and accountability datasets are being withheld while records are re-verified against durable source evidence. State-law summaries are also being moved to a primary-source provenance standard.",
  },
];

const PRINCIPLES = [
  {
    heading: "Public access",
    body: "Core public tools are currently available without a paid subscription. Future product changes should not be described here until they are actually implemented.",
  },
  {
    heading: "Public source repository",
    body: "The application source is publicly viewable on GitHub. The repository currently has no LICENSE file, so this page does not claim broader software reuse rights that have not been granted.",
  },
  {
    heading: "Source-first publication",
    body: "Unsupported directory and accountability records are withheld rather than treated as verified merely because they exist in a database or old seed file.",
  },
  {
    heading: "Corrections over certainty",
    body: "Legal rules, contact information, and public records can change. Corrections and source-backed updates are invited without promising an artificial response deadline.",
  },
];

const About = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="About | Civil Rights Hub by We The People News"
      description="Civil Rights Hub is a public-interest toolkit by We The People News for rights references, documentation, public-records work, research, scanners, and community collaboration."
      ogTitle="About Civil Rights Hub"
      ogDescription="A source-first public-interest toolkit for civil-rights research, records work, documentation, and response."
      canonicalUrl="https://civilrightshub.org/about"
    />
    <Header />
    <main className="flex-1">
      <section className="bg-gradient-to-b from-slate-950 to-background border-b">
        <div className="container mx-auto px-4 py-20 text-center space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
            <Shield className="h-4 w-4" />
            Built for public-interest research and response
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Rights tools should be useful, inspectable, and honest about their sources
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Civil Rights Hub is a public-interest project by <strong className="text-white">We The People News</strong>.
            It brings together rights references, incident documentation, public-records workflows,
            scanner resources, research tools, and community features in one place.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-3">Data publication status</h2>
        <p className="text-sm text-muted-foreground text-center mb-8">
          We are deliberately showing less data while legacy records are re-verified.
        </p>
        <VerifiedDataHold />
      </section>

      <section className="border-t">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-10">The project</h2>
          <div className="space-y-8">
            {STORY_ITEMS.map(({ heading, text }) => (
              <div key={heading} className="grid gap-2 sm:grid-cols-[150px_1fr] sm:gap-6">
                <h3 className="text-sm font-bold text-primary">{heading}</h3>
                <p className="text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Operating principles</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {PRINCIPLES.map(({ heading, body }) => (
              <div key={heading} className="rounded-xl border bg-card p-6 space-y-2">
                <h3 className="font-semibold text-foreground">{heading}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Funding disclosure</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The site offers voluntary contribution links, but it does not currently publish an independently verified monthly financial statement. We therefore do not represent exact revenue totals, donor mix, operating costs, or the allocation of individual contributions as established facts.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            The <Link to="/transparency" className="text-primary underline underline-offset-2">Transparency page</Link>{" "}
            now distinguishes known infrastructure and public repository facts from financial information that has not been verified through connected billing or accounting records.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild><Link to="/transparency">View transparency status</Link></Button>
            <Button variant="outline" asChild><Link to="/contribute">Ways to contribute</Link></Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/patriotnewsactivism/civil-rights-hub" target="_blank" rel="noopener noreferrer">
                Public source repository <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Press &amp; contact</h2>
          <p className="text-muted-foreground mb-6">
            Media inquiries, source-backed corrections, collaboration requests, and general feedback are welcome.
          </p>
          <a href="mailto:info@civilrightshub.org" className="inline-flex items-center gap-2 text-primary hover:underline">
            <Mail className="h-4 w-4" /> info@civilrightshub.org
          </a>
        </div>
      </section>

      <DonationCTA variant="banner" />
    </main>
    <Footer />
  </div>
);

export default About;
