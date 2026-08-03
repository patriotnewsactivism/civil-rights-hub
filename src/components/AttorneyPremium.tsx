import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AugustPromoCountdown } from "@/components/AugustPromoCountdown";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Crown, Star, TrendingUp, Users, Phone, Tag } from "lucide-react";

// August 2026 promo: 50% off all premium tiers
const isAugustPromo = true;

const TIERS = [
  {
    id: "basic",
    name: "Verified Badge",
    regularPrice: 49,
    features: [
      "Verified attorney badge on your profile",
      "Boosted search ranking (basic tier)",
      "Lead email forwarding included",
      "Profile analytics (views + clicks)",
      "Cancel anytime",
    ],
    icon: Star,
    color: "border-blue-500/50",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    id: "featured",
    name: "Featured Placement",
    regularPrice: 149,
    features: [
      "Everything in Verified Badge",
      "Top of search results in your state",
      "Featured flag on attorney match tool",
      "Priority lead routing (first in line)",
      "Premium bio section",
      "Enhanced profile with case highlights",
    ],
    icon: TrendingUp,
    color: "border-primary",
    badge: "bg-primary/10 text-primary",
    popular: true,
  },
  {
    id: "spotlight",
    name: "Homepage Spotlight",
    regularPrice: 599,
    features: [
      "Everything in Featured Placement",
      "Homepage rotation spotlight",
      "Top result in ALL searches for your state",
      "Maximum match score boost",
      "Exclusive practice area visibility",
      "Custom promotional bio",
      "Quarterly performance report",
    ],
    icon: Crown,
    color: "border-amber-500/50",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

function formatPrice(cents: number) {
  return `$` + (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2);
}

function getDisplayPrice(tier: typeof TIERS[0]) {
  if (isAugustPromo) {
    const discounted = tier.regularPrice / 2;
    return {
      current: formatPrice(Math.round(discounted * 100)),
      original: formatPrice(tier.regularPrice * 100),
      isDiscounted: true,
    };
  }
  return {
    current: formatPrice(tier.regularPrice * 100),
    original: null,
    isDiscounted: false,
  };
}

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

export function AttorneyPremium() {
  const [selectedTier, setSelectedTier] = useState("featured");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [firm, setFirm] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [practiceAreas, setPracticeAreas] = useState("");

  async function handleSubmit() {
    if (!name || !firm || !email || !state) return;
    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from("attorney_leads").insert({
        name,
        email,
        phone,
        state,
        practice_area: `Premium Signup: ${selectedTier}${isAugustPromo ? " (August 50% Off)" : ""}`,
        description: `Attorney: ${name}, Firm: ${firm}, Bar #: ${barNumber}, Practice Areas: ${practiceAreas}, Tier: ${selectedTier}${isAugustPromo ? ", Promo: August 50% Off" : ""}`,
        urgency: "normal",
        consent_contact: true,
      });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Premium Attorney Listings — 50% Off August 2026 | Civil Rights Hub"
        description="Upgrade your attorney profile. Featured placement, verified badge, priority lead routing. 50% off all tiers during August 2026. Cancel anytime."
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Premium Attorney Listings
          </h1>
          <p className="text-muted-foreground text-lg">
            Get found by more clients. Users search free — you pay to stand out.
          </p>
        </div>

        {/* August promo banner */}
        {isAugustPromo && (
          <div className="mb-8 rounded-lg border-2 border-amber-500/50 bg-amber-500/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Tag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="font-bold text-lg text-amber-700 dark:text-amber-400">
                August Launch Special — 50% Off All Premium Tiers
              </span>
            </div>
            <p className="text-sm text-amber-700/80 dark:text-amber-400/80">
              Lock in half-price for your entire first month. Offer ends August 31, 2026.
            <div className="mt-3"><AugustPromoCountdown /></div>
            </p>
          </div>
        )}

        {/* Value props */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border bg-card p-4">
            <Users className="h-8 w-8 text-primary mb-2" />
            <p className="font-medium mb-1">2,361+ attorneys in our directory</p>
            <p className="text-sm text-muted-foreground">Premium attorneys appear first in search and match results</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <p className="font-medium mb-1">Direct lead routing</p>
            <p className="text-sm text-muted-foreground">User submissions go to premium attorneys first, then free listings</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <Phone className="h-8 w-8 text-primary mb-2" />
            <p className="font-medium mb-1">Free for users — always</p>
            <p className="text-sm text-muted-foreground">We never charge citizens seeking civil rights help. Revenue is attorney-side only.</p>
          </div>
        </div>

        {/* Pricing tiers */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const isSelected = selectedTier === tier.id;
            const pricing = getDisplayPrice(tier);
            return (
              <Card
                key={tier.id}
                className={`cursor-pointer transition-all ${tier.color} ${isSelected ? "ring-2 ring-primary" : ""} ${tier.popular ? "relative" : ""}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${tier.badge} mb-2`}>
                    <Icon className="h-3.5 w-3.5" />
                    {tier.name}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <CardTitle className="text-2xl">{pricing.current}<span className="text-sm font-normal text-muted-foreground">/mo</span></CardTitle>
                    {pricing.original && (
                      <span className="text-sm text-muted-foreground line-through">{pricing.original}/mo</span>
                    )}
                  </div>
                  {pricing.isDiscounted && (
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-1">
                      50% off first month
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Signup form */}
        {!submitted ? (
          <Card>
            <CardHeader>
              <CardTitle>Get Started — {TIERS.find(t => t.id === selectedTier)?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fill out the form below and we'll verify your bar status and activate your premium listing within 1-2 business days.
                {isAugustPromo && " Your 50% discount will be applied to your first month."}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="p-name">Full Name *</Label>
                  <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="p-firm">Firm Name *</Label>
                  <Input id="p-firm" value={firm} onChange={(e) => setFirm(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="p-email">Email *</Label>
                  <Input id="p-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="p-phone">Phone</Label>
                  <Input id="p-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="p-state">State *</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger id="p-state">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="p-bar">Bar Number</Label>
                  <Input id="p-bar" value={barNumber} onChange={(e) => setBarNumber(e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="p-areas">Practice Areas (comma-separated)</Label>
                <Textarea
                  id="p-areas"
                  value={practiceAreas}
                  onChange={(e) => setPracticeAreas(e.target.value)}
                  placeholder="Police Misconduct, Civil Rights Litigation, Employment Discrimination..."
                  rows={2}
                />
              </div>
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <Button onClick={handleSubmit} disabled={!name || !firm || !email || !state || loading} className="w-full" size="lg">
                {loading ? "Submitting..." : `Activate ${TIERS.find(t => t.id === selectedTier)?.name}${isAugustPromo ? " — 50% Off First Month" : ""}`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We verify bar status before activation. No charge until your listing is live. Cancel anytime.
                {isAugustPromo && " August 50% off applies to your first month only."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-emerald-500/50">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Application received!</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                We'll verify your bar status and contact you at {email} within 1-2 business days to activate your{" "}
                {TIERS.find(t => t.id === selectedTier)?.name} listing.
                {isAugustPromo && " Your 50% August discount will be applied."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
