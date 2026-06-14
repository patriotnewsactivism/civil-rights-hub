import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImpactCounter } from "@/components/ImpactCounter";
import { Heart, ExternalLink, CheckCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// Set these in your Stripe dashboard → Payment Links, then add to .env
const STRIPE_LINKS: Record<string, string> = {
  "5": import.meta.env.VITE_STRIPE_5 as string ?? "",
  "10": import.meta.env.VITE_STRIPE_10 as string ?? "",
  "25": import.meta.env.VITE_STRIPE_25 as string ?? "",
  "100": import.meta.env.VITE_STRIPE_100 as string ?? "",
  "one-time": import.meta.env.VITE_STRIPE_ONE_TIME as string ?? "",
};
const STRIPE_FALLBACK = import.meta.env.VITE_STRIPE_DONATION_URL as string | undefined;
const PATREON_URL = "https://www.patreon.com/WeThePeopleNews";
const CASHAPP_URL = "https://cash.app/$WeThePeopleNews";
const VENMO_URL = "https://venmo.com/WeThePeopleNews";

const MONTHLY_TIERS = [
  {
    key: "5",
    label: "Supporter",
    amount: "$5",
    period: "/ month",
    perks: ["Weekly digest newsletter", "Supporter badge on profile"],
    highlight: false,
  },
  {
    key: "10",
    label: "Advocate",
    amount: "$10",
    period: "/ month",
    perks: ["Everything in Supporter", "Early access to new features"],
    highlight: true,
  },
  {
    key: "25",
    label: "Champion",
    amount: "$25",
    period: "/ month",
    perks: ["Everything in Advocate", "Name on donor wall (opt-in)"],
    highlight: false,
  },
  {
    key: "100",
    label: "Organization",
    amount: "$100",
    period: "/ month",
    perks: ["Everything in Champion", "Logo link on About page", "Priority feature requests"],
    highlight: false,
  },
];

const WHAT_IT_COVERS = [
  { label: "Database & auth (Supabase)", cost: "$25/mo" },
  { label: "Hosting & CDN (Vercel)", cost: "$20/mo" },
  { label: "Newsletter (Buttondown)", cost: "$9/mo" },
  { label: "Domain & tools", cost: "$17/mo" },
];

const Donate = () => {
  const [mode, setMode] = useState<"monthly" | "once">("monthly");

  const getDonateUrl = (tierKey: string) => {
    const link = STRIPE_LINKS[tierKey];
    if (link) return link;
    return STRIPE_FALLBACK ?? PATREON_URL;
  };

  const oneTimeUrl = getDonateUrl("one-time") || STRIPE_FALLBACK || PATREON_URL;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Donate | Support Civil Rights Hub"
        description="Support Civil Rights Hub with a monthly or one-time donation. Free for users, funded by people who believe civil rights tools should be accessible to all."
        ogTitle="Support Civil Rights Hub"
        ogDescription="Keep civil rights tools free for everyone. Donate monthly or one-time — no account required."
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-red-950/30 to-background">
          <div className="container mx-auto px-4 py-16 text-center max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 text-red-400 text-sm font-semibold">
              <Heart className="h-4 w-4 fill-red-400" />
              Keep it free for everyone
            </div>
            <h1 className="text-4xl md:text-5xl font-black">
              Civil rights tools shouldn't cost money
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Civil Rights Hub is 100% free — no ads, no paywalls, no data selling. It stays that
              way because people like you choose to support it. Every dollar goes directly to
              keeping the platform running and growing.
            </p>
          </div>
        </section>

        {/* Impact */}
        <section className="container mx-auto px-4 py-12 max-w-4xl">
          <p className="text-center text-sm text-muted-foreground mb-6">Your donations power this</p>
          <ImpactCounter />
        </section>

        {/* Frequency toggle */}
        <section className="container mx-auto px-4 pb-4 max-w-4xl">
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg border p-1 gap-1">
              <button
                onClick={() => setMode("monthly")}
                className={cn(
                  "px-5 py-2 rounded-md text-sm font-medium transition-colors",
                  mode === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setMode("once")}
                className={cn(
                  "px-5 py-2 rounded-md text-sm font-medium transition-colors",
                  mode === "once"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                One-time
              </button>
            </div>
          </div>
        </section>

        {/* Tiers or one-time */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          {mode === "monthly" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MONTHLY_TIERS.map((tier) => (
                <div
                  key={tier.key}
                  className={cn(
                    "rounded-xl border p-6 flex flex-col gap-4 relative",
                    tier.highlight
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "bg-card",
                  )}
                >
                  {tier.highlight && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs">
                      Most popular
                    </Badge>
                  )}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {tier.label}
                    </p>
                    <p className="text-3xl font-black mt-1">
                      {tier.amount}
                      <span className="text-base font-normal text-muted-foreground">
                        {tier.period}
                      </span>
                    </p>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn("w-full gap-1.5", tier.highlight ? "" : "variant-outline")}
                    variant={tier.highlight ? "default" : "outline"}
                    asChild
                  >
                    <a href={getDonateUrl(tier.key)} target="_blank" rel="noopener noreferrer">
                      <Heart className="h-3.5 w-3.5" />
                      Donate {tier.amount}/mo
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto rounded-xl border bg-card p-8 text-center space-y-5">
              <Heart className="h-10 w-10 text-red-400 fill-red-400 mx-auto" />
              <div>
                <h2 className="text-2xl font-bold">Any amount helps</h2>
                <p className="text-muted-foreground text-sm mt-2">
                  One-time donations go directly to hosting and development. No minimum.
                </p>
              </div>
              <Button size="lg" className="w-full gap-2" asChild>
                <a href={oneTimeUrl} target="_blank" rel="noopener noreferrer">
                  <Heart className="h-4 w-4" />
                  Donate via Stripe
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                Prefer another method? Use{" "}
                <a href={CASHAPP_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  CashApp
                </a>{" "}
                or{" "}
                <a href={VENMO_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  Venmo
                </a>
                .
              </p>
            </div>
          )}
        </section>

        {/* Alt payment methods */}
        <section className="border-t">
          <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h2 className="text-lg font-semibold mb-6 text-center">Other ways to give</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: "Patreon", emoji: "🎁", desc: "Monthly tiers from $5", url: PATREON_URL },
                { name: "CashApp", emoji: "💸", desc: "$WeThePeopleNews", url: CASHAPP_URL },
                { name: "Venmo", emoji: "💳", desc: "@WeThePeopleNews", url: VENMO_URL },
              ].map(({ name, emoji, desc, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 rounded-xl border p-5 hover:border-primary/50 hover:bg-accent transition-colors text-center group"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="font-semibold text-sm">{name}</span>
                  <span className="text-xs text-muted-foreground">{desc}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* What it covers */}
        <section className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h2 className="text-lg font-semibold mb-2">Where your money goes</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Total monthly operating cost: <strong className="text-foreground">~$71/month</strong>
            </p>
            <div className="space-y-2">
              {WHAT_IT_COVERS.map(({ label, cost }) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b last:border-b-0 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold tabular-nums">{cost}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
              <span>
                We The People News is not a 501(c)(3). Donations are not tax-deductible. Full
                cost breakdown on our{" "}
                <a href="/transparency" className="text-primary underline">
                  Transparency page
                </a>
                .
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Donate;
