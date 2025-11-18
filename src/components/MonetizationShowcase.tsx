import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Star, DollarSign, CalendarRange, Megaphone } from "lucide-react";

const BOOST_PACKAGES = [
  {
    id: "7-day",
    label: "7-day boost",
    price: "$450",
    impressions: "35k homepage impressions",
    perks: ["Pinned inside featured resources", "Social spotlight shout-out", "Scanner alert overlay"]
  },
  {
    id: "14-day",
    label: "14-day boost",
    price: "$800",
    impressions: "80k homepage impressions",
    perks: ["Featured attorney interview", "Priority placement in Lawyer Finder", "Newsletter feature"]
  },
  {
    id: "30-day",
    label: "30-day takeover",
    price: "$1,600",
    impressions: "Full-month rotation",
    perks: ["Dedicated banner", "Community AMA", "Custom analytics dashboard"]
  }
];

const AD_CHANNELS = [
  { name: "Homepage hero capsule", reach: "120k / month", formats: "Static + video", cta: "Monetize educational content" },
  { name: "Newsletter placement", reach: "48k engaged readers", formats: "Native story + CTA", cta: "Promote case updates" },
  { name: "Scanner overlay", reach: "Real-time listeners", formats: "Audio stinger", cta: "Promote rapid response" }
];

export const MonetizationShowcase = () => {
  const [selectedPackage, setSelectedPackage] = useState(BOOST_PACKAGES[1]);

  return (
    <section id="monetization" className="py-10 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-2 md:space-y-4 mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
            Partner boosts & ads
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold px-4">Fund the mission while promoting trusted partners</h2>
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground max-w-3xl mx-auto px-4">
            Attorneys, legal collectives, and civil rights organizations can boost their listings or reserve ethical ad space. Funds fuel new investigations, hosting, and rapid response tech.
          </p>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card className="border-primary/40 shadow-strong">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl lg:text-2xl">
                <Star className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                Boosted listings
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Choose how long your attorney or organization profile stays pinned on the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
              <Tabs value={selectedPackage.id} onValueChange={(value) => {
                const pkg = BOOST_PACKAGES.find((pack) => pack.id === value);
                if (pkg) setSelectedPackage(pkg);
              }}>
                <TabsList className="grid grid-cols-3 h-auto">
                  {BOOST_PACKAGES.map((pkg) => (
                    <TabsTrigger key={pkg.id} value={pkg.id} className="text-xs md:text-sm px-2 py-2">{pkg.label}</TabsTrigger>
                  ))}
                </TabsList>
                {BOOST_PACKAGES.map((pkg) => (
                  <TabsContent key={pkg.id} value={pkg.id} className="space-y-3 md:space-y-4">
                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                      <Badge variant="secondary" className="text-base md:text-lg px-3 md:px-4 py-1.5 md:py-2">
                        {pkg.price}
                      </Badge>
                      <p className="text-xs md:text-sm text-muted-foreground">{pkg.impressions}</p>
                    </div>
                    <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                      {pkg.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2 p-2 rounded-lg bg-muted/20">
                          <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      size="sm"
                      className="w-full sm:w-auto text-xs md:text-sm"
                      onClick={() => window.open(`mailto:partners@civilrightshub.org?subject=${encodeURIComponent(pkg.label)}%20Boost`)}
                    >
                      Reserve this slot
                      <CalendarRange className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl lg:text-2xl">
                <Megaphone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                Ethical ad inventory
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">Limited placements ensure the homepage stays clean while still funding expansion.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3 md:space-y-4">
              {AD_CHANNELS.map((channel) => (
                <div key={channel.name} className="rounded-2xl border border-border/60 bg-muted/20 p-3 md:p-4">
                  <div className="flex items-start sm:items-center justify-between gap-3 md:gap-4 flex-wrap sm:flex-nowrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base font-semibold">{channel.name}</p>
                      <p className="text-[10px] md:text-xs uppercase tracking-wide text-muted-foreground">Reach: {channel.reach}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] md:text-xs flex-shrink-0">{channel.formats}</Badge>
                  </div>
                  <p className="mt-2 text-xs md:text-sm text-muted-foreground">{channel.cta}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 md:mt-3 text-xs md:text-sm"
                    onClick={() => window.open("mailto:ads@civilrightshub.org?subject=Advertising%20Inquiry")}
                  >
                    Start conversation
                    <DollarSign className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
