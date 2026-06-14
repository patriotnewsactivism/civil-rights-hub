import { Button } from "@/components/ui/button";
import { Heart, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface DonationCTAProps {
  variant?: "banner" | "card" | "inline";
  className?: string;
}

// Stripe payment link configured in your Stripe dashboard
const STRIPE_DONATION_URL = import.meta.env.VITE_STRIPE_DONATION_URL as string | undefined;
const PATREON_URL = "https://www.patreon.com/WeThePeopleNews";
const CASHAPP_URL = "https://cash.app/$WeThePeopleNews";

const TIERS = [
  { label: "Supporter", amount: "$5/mo" },
  { label: "Advocate", amount: "$10/mo" },
  { label: "Champion", amount: "$25/mo" },
  { label: "Organization", amount: "$100/mo" },
];

export function DonationCTA({ variant = "banner", className }: DonationCTAProps) {
  const donateUrl = STRIPE_DONATION_URL ?? PATREON_URL;

  if (variant === "inline") {
    return (
      <span className={className}>
        <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
        >
          <Heart className="h-3.5 w-3.5" />
          Support this project
        </a>
      </span>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("rounded-xl border bg-card p-6 space-y-4", className)}>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          <h3 className="font-semibold">Keep Civil Rights Hub free</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          This platform is 100% free, ad-free, and open source. Monthly donations cover hosting,
          development, and data costs.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {TIERS.map((tier) => (
            <div key={tier.label} className="border rounded-lg p-2.5 text-center">
              <p className="font-semibold text-foreground">{tier.amount}</p>
              <p className="text-muted-foreground">{tier.label}</p>
            </div>
          ))}
        </div>
        <Button className="w-full gap-2" asChild>
          <a href={donateUrl} target="_blank" rel="noopener noreferrer">
            <Heart className="h-4 w-4" />
            Donate via {STRIPE_DONATION_URL ? "Stripe" : "Patreon"}
          </a>
        </Button>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <a href={CASHAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            CashApp
          </a>
          <a href={PATREON_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Patreon
          </a>
        </div>
      </div>
    );
  }

  // banner (default) — subtle horizontal strip
  return (
    <div
      className={cn(
        "border-t border-b border-red-500/20 bg-red-500/5 py-4",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-red-500 fill-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Civil Rights Hub is free for everyone — help keep it that way</p>
              <p className="text-xs text-muted-foreground">
                No ads, no paywalls, no data selling. Funded entirely by people like you.
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button size="sm" variant="outline" className="border-red-500/40 text-red-600 hover:bg-red-500/10" asChild>
              <a href={CASHAPP_URL} target="_blank" rel="noopener noreferrer">
                CashApp
              </a>
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 gap-1.5" asChild>
              <a href={donateUrl} target="_blank" rel="noopener noreferrer">
                <Heart className="h-3.5 w-3.5" />
                Donate
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
