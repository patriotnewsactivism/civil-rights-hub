import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ImpactCounter } from "@/components/ImpactCounter";
import { DonationCTA } from "@/components/DonationCTA";
import { Button } from "@/components/ui/button";
import { Shield, Heart, ExternalLink, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const STORY_ITEMS = [
  {
    year: "2024",
    text: "We The People News identified a critical gap: civil rights resources were scattered across dozens of sites, often behind paywalls or hard to find in a crisis. We began building.",
  },
  {
    year: "2025",
    text: "Civil Rights Hub launched publicly — free, ad-free, and open source. Attorney directories, FOIA tools, Know Your Rights guides, and a community violation feed, all in one place.",
  },
  {
    year: "Today",
    text: "The platform serves users across all 50 states with live scanner feeds, attorney matching, and real-time violation reporting. Always free. Always open.",
  },
];

const PRINCIPLES = [
  { heading: "Always free", body: "No paywalls, no subscriptions, no premium tiers. Civil rights resources must be accessible to everyone regardless of income." },
  { heading: "No ads", body: "We don't sell your attention or your data. Funded by donations and grants, not advertising." },
  { heading: "Open source", body: "The code is public. Anyone can audit, contribute, or fork it. Transparency is non-negotiable." },
  { heading: "Cite your sources", body: "Every legal claim links to the underlying statute or case. We don't publish unverified information." },
];

const About = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="About | Civil Rights Hub by We The People News"
      description="Civil Rights Hub is a free, open-source platform built by We The People News to make civil rights resources accessible to everyone in America."
      ogTitle="About Civil Rights Hub"
      ogDescription="Free, ad-free, and open source. Built by We The People News to put civil rights tools in everyone's hands."
    />
    <Header />
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-950 to-background border-b">
        <div className="container mx-auto px-4 py-20 text-center space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
            <Shield className="h-4 w-4" />
            Built for the people
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Civil rights resources should be free for everyone
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Civil Rights Hub is a free, ad-free, open-source platform by{" "}
            <strong className="text-white">We The People News</strong>. We build tools that help
            ordinary people document violations, find attorneys, file public records requests, and
            know their rights — without paying a dime.
          </p>
        </div>
      </section>

      {/* Impact */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-8">Platform impact</h2>
        <ImpactCounter />
      </section>

      {/* Our Story */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-10">Our story</h2>
          <div className="space-y-8">
            {STORY_ITEMS.map(({ year, text }) => (
              <div key={year} className="flex gap-6">
                <div className="w-16 flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{year}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Our principles</h2>
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

      {/* Funding transparency */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">How we're funded</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Civil Rights Hub is funded entirely by voluntary donations from individuals and
            organizations who believe civil rights tools should be free. We do not accept advertising,
            sell user data, or accept funding from law enforcement agencies or political campaigns.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            See our{" "}
            <Link to="/transparency" className="text-primary underline underline-offset-2">
              Transparency page
            </Link>{" "}
            for a full breakdown of operating costs and revenue sources.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/transparency">View transparency report</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contribute">Ways to contribute</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Press / Contact */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Press &amp; contact</h2>
          <p className="text-muted-foreground mb-6">
            Media inquiries, partnership requests, attorney listing corrections, and general feedback
            are all welcome.
          </p>
          <a
            href="mailto:info@civilrightshub.org"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Mail className="h-4 w-4" />
            info@civilrightshub.org
          </a>
        </div>
      </section>

      <DonationCTA variant="banner" />
    </main>
    <Footer />
  </div>
);

export default About;
