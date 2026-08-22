import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink, DollarSign, Coffee, Users } from "lucide-react";

const DONATION_LINKS = [
  {
    name: "CashApp",
    url: "https://cash.app/$WeThePeopleNews",
    icon: DollarSign,
    description: "$WeThePeopleNews",
  },
  {
    name: "Venmo",
    url: "https://venmo.com/WeThePeopleNews",
    icon: Coffee,
    description: "@WeThePeopleNews",
  },
];

export function DonationBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("crh-donate-dismissed") === "1";
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("crh-donate-dismissed", "1");
    } catch {
      // sessionStorage unavailable — dismiss in memory only.
    }
  };

  return (
    <section className="py-12 animate-fade-in-up">
      <div className="container mx-auto px-4">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/5 overflow-hidden relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted/80 transition-colors text-muted-foreground z-10"
            aria-label="Dismiss donation banner"
          >
            <X className="h-4 w-4" />
          </button>
          <CardContent className="py-8 md:py-10">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Users className="h-3 w-3" /> Community Supported
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  Help Support Civil Rights Hub
                </h3>
                <p className="text-muted-foreground max-w-lg">
                  Voluntary contributions can help support hosting, public-records tools, source verification,
                  rights-reference maintenance, and continued development. No fixed allocation of an individual contribution is represented here.
                </p>
                <div className="flex items-center gap-3 justify-center md:justify-start text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">Free Public Tools</Badge>
                  <Badge variant="outline" className="text-xs">Public Repository</Badge>
                  <Badge variant="outline" className="text-xs">Source-First Data Policy</Badge>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[240px]">
                {DONATION_LINKS.map(({ name, url, icon: Icon, description }) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="group">
                    <Button
                      variant="outline"
                      className="w-full justify-between gap-3 h-auto py-3 px-4 border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm">{name}</p>
                          <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Button>
                  </a>
                ))}
                <p className="text-[11px] text-muted-foreground text-center">
                  Verify the recipient shown by the payment provider before completing a transfer.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
