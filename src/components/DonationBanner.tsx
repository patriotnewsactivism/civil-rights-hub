import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, ExternalLink, DollarSign, Coffee, Users } from "lucide-react";

const DONATION_LINKS = [
  {
    name: "Patreon",
    url: "https://www.patreon.com/patriotnewsactivism",
    icon: Heart,
    color: "bg-[#FF424D]",
    description: "Monthly support",
  },
  {
    name: "CashApp",
    url: "https://cash.app/$WeThePeopleNews",
    icon: DollarSign,
    color: "bg-[#00D632]",
    description: "Quick donation",
  },
  {
    name: "Venmo",
    url: "https://venmo.com/WeThePeopleNews",
    icon: Coffee,
    color: "bg-[#3D95CE]",
    description: "One-time gift",
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
    } catch {}
  };

  return (
    <section className="py-12">
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
              {/* Left: Message */}
              <div className="flex-1 text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Users className="h-3 w-3" />
                  Community Powered
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  Keep Civil Rights Hub{" "}
                  <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                    Free & Independent
                  </span>
                </h3>
                <p className="text-muted-foreground max-w-lg">
                  This platform is built by We The People News — no corporate sponsors, no government funding.
                  Every attorney lookup, FOIA request, and rights guide is funded entirely by people like you.
                </p>
                <div className="flex items-center gap-3 justify-center md:justify-start text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">100% Free to Use</Badge>
                  <Badge variant="outline" className="text-xs">No Ads</Badge>
                  <Badge variant="outline" className="text-xs">Open Source</Badge>
                </div>
              </div>

              {/* Right: Donation buttons */}
              <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[240px]">
                {DONATION_LINKS.map(({ name, url, icon: Icon, color, description }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-between gap-3 h-auto py-3 px-4 border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${color} rounded-lg p-2 text-white`}>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
