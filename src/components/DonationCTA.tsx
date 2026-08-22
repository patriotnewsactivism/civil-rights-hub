import { Button } from "@/components/ui/button";
import { DollarSign, Shield, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface DonationCTAProps {
  variant?: "banner" | "card" | "inline";
  className?: string;
}

const STRIPE_DONATION_URL = import.meta.env.VITE_STRIPE_DONATION_URL as string | undefined;
const CASHAPP_URL = "https://cash.app/$WeThePeopleNews";
const VENMO_URL = "https://venmo.com/WeThePeopleNews";

export function DonationCTA({ variant = "banner", className }: DonationCTAProps) {
  const primaryUrl = STRIPE_DONATION_URL ?? CASHAPP_URL;
  const primaryLabel = STRIPE_DONATION_URL ? "Stripe" : "CashApp";

  if (variant === "inline") {
    return (
      <span className={className}>
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
        >
          <DollarSign className="h-3.5 w-3.5" />
          Support this project
        </a>
      </span>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("rounded-xl border bg-card p-6 space-y-4", className)}>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          <h3 className="font-semibold">Support Civil Rights Hub</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Core public tools are currently free to use. Voluntary contributions can help support
          hosting, source verification, maintenance, and continued development. This page does not
          represent a fixed allocation of any individual contribution.
        </p>
        <Button className="w-full gap-2" asChild>
          <a href={primaryUrl} target="_blank" rel="noopener noreferrer">
            <DollarSign className="h-4 w-4" />
            Continue via {primaryLabel}
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        </Button>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <a href={CASHAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            CashApp
          </a>
          <a href={VENMO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Venmo
          </a>
        </div>
        <p className="text-[11px] text-muted-foreground text-center">
          Payment providers control their own terms and available amounts. Verify the recipient before sending funds.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("border-t border-b border-accent/20 bg-accent/5 py-4", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Support the maintenance of Civil Rights Hub</p>
              <p className="text-xs text-muted-foreground">
                Voluntary contributions can support hosting, source verification, maintenance, and development.
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button size="sm" variant="outline" className="border-accent/40 text-accent hover:bg-accent/10" asChild>
              <a href={CASHAPP_URL} target="_blank" rel="noopener noreferrer">CashApp</a>
            </Button>
            <Button size="sm" className="gap-1.5" asChild>
              <a href={primaryUrl} target="_blank" rel="noopener noreferrer">
                <DollarSign className="h-3.5 w-3.5" />
                Contribute
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
