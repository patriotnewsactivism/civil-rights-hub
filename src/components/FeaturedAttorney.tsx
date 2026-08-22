import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  CheckCircle2,
  Clock,
  Crown,
  Globe,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";

const BOOST_PRICE = 700;
const AUGUST_PRICE = 350;
const BOOST_CONTACT_EMAIL = "info@civilrightshub.org?subject=Attorney Homepage Boost";

const BOOST_BENEFITS = [
  "Prominent sponsored placement on the Civil Rights Hub homepage",
  "Direct contact buttons for the verified phone, email, or website on your listing",
  "Featured Attorney badge and distinct sponsored presentation",
  "Placement alongside Civil Rights Hub rights and accountability resources",
];

interface BoostedAttorney {
  id: string;
  name: string;
  firm: string | null;
  state: string;
  city: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  bio: string | null;
  practice_areas: string[];
  specialties: string[] | null;
  is_verified: boolean | null;
}

async function fetchBoostedAttorney(): Promise<BoostedAttorney | null> {
  const { data, error } = await supabase
    .from("attorney_boosts")
    .select(`
      attorney:attorneys(
        id, name, firm, state, city, phone, email, website,
        bio, practice_areas, specialties, is_verified
      )
    `)
    .eq("payment_status", "paid")
    .gte("end_date", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  const attorney = (data as { attorney: BoostedAttorney | null }).attorney;
  return attorney?.is_verified ? attorney : null;
}

function BoostedCard({ attorney }: { attorney: BoostedAttorney }) {
  return (
    <Card className="border-accent/40 bg-gradient-to-br from-accent/8 via-card to-card overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
      <CardContent className="py-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-accent/20 text-accent border-accent/40 gap-1">
              <Star className="h-3 w-3 fill-accent" />
              Featured Attorney
            </Badge>
            <Badge variant="outline" className="border-primary/40 text-primary gap-1">
              <Shield className="h-3 w-3" />
              Source Verified
            </Badge>
            <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Sponsored</span>
          </div>

          <div>
            <h3 className="text-xl font-black text-foreground">{attorney.name}</h3>
            {attorney.firm && <p className="text-sm text-muted-foreground">{attorney.firm}</p>}
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {[attorney.city, attorney.state].filter(Boolean).join(", ")}
            </p>
          </div>

          {attorney.bio && <p className="text-sm text-muted-foreground/90 line-clamp-2">{attorney.bio}</p>}

          {attorney.practice_areas?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {attorney.practice_areas.slice(0, 4).map((area) => (
                <Badge key={area} variant="secondary" className="text-[10px] bg-primary/8 text-primary border-0">
                  {area}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {attorney.phone && (
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" asChild>
                <a href={`tel:${attorney.phone}`}>
                  <Phone className="h-3.5 w-3.5" />
                  {attorney.phone}
                </a>
              </Button>
            )}
            {attorney.email && (
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" asChild>
                <a href={`mailto:${attorney.email}`}>
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </a>
              </Button>
            )}
            {attorney.website && (
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" asChild>
                <a href={attorney.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-3.5 w-3.5" />
                  Website
                </a>
              </Button>
            )}
          </div>

          <p className="text-[10px] text-muted-foreground">
            Sponsored placement does not affect Civil Rights Hub's source-verification standard. Confirm licensing, availability, services, and fees directly with the attorney.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PromoCard() {
  const isAugust = new Date().getMonth() === 7;
  const activePrice = isAugust ? AUGUST_PRICE : BOOST_PRICE;

  return (
    <Card className="border-dashed border-accent/30 bg-card/50 overflow-hidden relative">
      <CardContent className="py-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-stretch">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-accent/15 text-accent border-accent/30 gap-1">
                <Crown className="h-3 w-3" />
                Premium Placement
              </Badge>
              {isAugust && (
                <Badge variant="destructive" className="gap-1 animate-pulse-slow">
                  <Clock className="h-3 w-3" />
                  August Special — 50% Off
                </Badge>
              )}
            </div>

            <div>
              <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Promote Your Practice
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Apply for prominent sponsored placement on the Civil Rights Hub homepage. Sponsored listings remain subject to the same source-verification requirements as other published attorney records.
              </p>
            </div>

            <ul className="space-y-1.5">
              {BOOST_BENEFITS.map((benefit) => (
                <li key={benefit} className="text-xs text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-3 md:w-48 shrink-0 justify-center">
            <div className="text-center">
              {isAugust && (
                <p className="text-sm text-muted-foreground line-through decoration-destructive/60">${BOOST_PRICE}</p>
              )}
              <p className="text-4xl font-black text-foreground">${activePrice}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">per week</p>
            </div>

            <Button
              size="sm"
              className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold gap-1.5 w-full"
              asChild
            >
              <a href={`mailto:${BOOST_CONTACT_EMAIL}`}>
                <Crown className="h-4 w-4" />
                Ask About Placement
              </a>
            </Button>

            <p className="text-[10px] text-muted-foreground text-center">
              {isAugust ? "August promotional rate shown." : "7-day sponsored placement."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingCard() {
  return (
    <Card className="border-accent/20">
      <CardContent className="py-6">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-24" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const FeaturedAttorney = () => {
  const { data, isLoading } = useQuery<BoostedAttorney | null>({
    queryKey: ["featured-attorney"],
    queryFn: fetchBoostedAttorney,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  if (isLoading) return <LoadingCard />;
  if (data) return <BoostedCard attorney={data} />;
  return <PromoCard />;
};
