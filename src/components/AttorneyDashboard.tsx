import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, MousePointerClick, Users, Crown, Star, TrendingUp } from "lucide-react";

type AttorneyProfile = {
  id: string;
  name: string;
  firm: string | null;
  state: string;
  city: string | null;
  phone: string | null;
  website: string | null;
  specialties: string[] | null;
  is_premium: boolean;
  premium_tier: string | null;
  profile_views: number;
  contact_clicks: number;
  bio: string | null;
};

type Lead = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  state: string;
  practice_area: string;
  description: string;
  urgency: string;
  status: string;
  created_at: string;
};

export function AttorneyDashboard() {
  const [email, setEmail] = useState("");
  const [attorney, setAttorney] = useState<AttorneyProfile | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLookup() {
    if (!email) return;
    setLoading(true);
    setError(null);
    setAttorney(null);
    setLeads([]);
    try {
      // Look up attorney by lead_email or email in attorneys table
      const { data: attData, error: attError } = await supabase
        .from("attorneys")
        .select("id, name, firm, state, city, phone, website, specialties, is_premium, premium_tier, profile_views, contact_clicks, bio")
        .or(`email.eq.${email},lead_email.eq.${email}`)
        .maybeSingle();

      if (attError) throw attError;
      if (!attData) {
        setError("No attorney profile found with that email. Make sure you've signed up for a premium listing first.");
        return;
      }

      setAttorney(attData as AttorneyProfile);

      // Fetch leads matching this attorney's state + practice areas
      const { data: leadData, error: leadError } = await supabase
        .from("attorney_leads")
        .select("id, name, email, phone, state, practice_area, description, urgency, status, created_at")
        .eq("state", (attData as AttorneyProfile).state)
        .eq("status", "new")
        .order("created_at", { ascending: false })
        .limit(20);

      if (leadError) throw leadError;
      setLeads((leadData as Lead[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Attorney Dashboard — Profile Analytics & Leads | Civil Rights Hub"
        description="View your profile performance, lead activity, and premium listing status."
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Attorney Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your profile views, contact clicks, and incoming leads.
          </p>
        </div>

        {!attorney && (
          <Card className="mb-8">
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="dash-email">Your email address</Label>
                <Input
                  id="dash-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourfirm.com"
                />
              </div>
              <Button onClick={handleLookup} disabled={!email || loading} className="w-full" size="lg">
                {loading ? "Loading..." : "View My Dashboard"}
              </Button>
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {attorney && (
          <div className="space-y-6">
            {/* Premium status banner */}
            {attorney.is_premium ? (
              <Card className={`${attorney.premium_tier === "spotlight" ? "border-amber-500/50" : attorney.premium_tier === "featured" ? "border-primary" : "border-blue-500/50"}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    {attorney.premium_tier === "spotlight" ? (
                      <Crown className="h-6 w-6 text-amber-500" />
                    ) : attorney.premium_tier === "featured" ? (
                      <TrendingUp className="h-6 w-6 text-primary" />
                    ) : (
                      <Star className="h-6 w-6 text-blue-500" />
                    )}
                    <div>
                      <p className="font-semibold capitalize">{attorney.premium_tier || "Premium"} Listing Active</p>
                      <p className="text-sm text-muted-foreground">Your listing is boosted in {attorney.state} search results</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-muted">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Free Listing</p>
                      <p className="text-sm text-muted-foreground">Upgrade to get featured placement and priority leads</p>
                    </div>
                    <Button asChild variant="outline">
                      <a href="/attorney-premium">Upgrade →</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Profile Views</span>
                  </div>
                  <p className="text-2xl font-bold">{attorney.profile_views}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Contact Clicks</span>
                  </div>
                  <p className="text-2xl font-bold">{attorney.contact_clicks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">New Leads</span>
                  </div>
                  <p className="text-2xl font-bold">{leads.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Profile summary */}
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium text-lg">{attorney.name}</p>
                  {attorney.firm && <p className="text-sm text-muted-foreground">{attorney.firm}</p>}
                  <p className="text-sm text-muted-foreground">{attorney.city}, {attorney.state}</p>
                  {attorney.specialties && attorney.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {attorney.specialties.slice(0, 6).map((s) => (
                        <span key={s} className="rounded-md bg-muted px-2 py-1 text-xs">{s}</span>
                      ))}
                    </div>
                  )}
                  {attorney.bio && <p className="text-sm text-muted-foreground mt-3">{attorney.bio}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Leads */}
            {leads.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">New Leads in {attorney.state}</h2>
                {leads.map((lead) => (
                  <Card key={lead.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{lead.name || "Anonymous"}</h3>
                            {lead.urgency === "urgent" && (
                              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                                Urgent
                              </span>
                            )}
                            {lead.urgency === "emergency" && (
                              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                                Emergency
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-primary mb-1">{lead.practice_area}</p>
                          <p className="text-sm text-muted-foreground mb-3">{lead.description}</p>
                          <div className="flex flex-wrap gap-3 text-sm">
                            {lead.email && <span className="text-muted-foreground">✉️ {lead.email}</span>}
                            {lead.phone && <span className="text-muted-foreground">📞 {lead.phone}</span>}
                            <span className="text-muted-foreground">
                              {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No new leads in {attorney.state} yet. Leads will appear here when users submit cases matching your state.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
}
