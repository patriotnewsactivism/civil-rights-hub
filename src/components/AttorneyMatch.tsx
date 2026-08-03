import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Search, Phone, Globe, Star, Shield, Clock } from "lucide-react";

const PRACTICE_AREAS = [
  "Police Misconduct",
  "Excessive Force",
  "Civil Rights Litigation",
  "Employment Discrimination",
  "Housing Discrimination",
  "Immigration",
  "First Amendment",
  "Voting Rights",
  "Racial Justice",
  "Criminal Defense",
  "Section 1983",
  "Wrongful Death",
  "ADA Compliance",
  "LGBTQ Rights",
  "Disability Rights",
];

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

type MatchedAttorney = {
  id: string;
  name: string;
  firm: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  specialties: string[];
  accepts_pro_bono: boolean;
  is_premium: boolean;
  premium_tier: string | null;
  bio: string | null;
  match_score: number;
};

export function AttorneyMatch() {
  const [state, setState] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchedAttorney[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Lead form state
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadDescription, setLeadDescription] = useState("");
  const [leadUrgency, setLeadUrgency] = useState("normal");

  async function handleSearch() {
    if (!state || !practiceArea) return;
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const { data, error: rpcError } = await supabase.rpc("match_attorneys_for_lead", {
        p_state: state,
        p_practice_area: practiceArea,
        p_limit: 10,
      });
      if (rpcError) throw rpcError;
      setResults((data as MatchedAttorney[]) || []);
      if (!data || data.length === 0) {
        setError("No attorneys found matching your criteria. Try a broader practice area or nearby state.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search attorneys. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLeadSubmit() {
    if (!state || !practiceArea || !leadDescription) return;
    setLoading(true);
    try {
      const { error: insertError } = await supabase.from("attorney_leads").insert({
        name: leadName || null,
        email: leadEmail || null,
        phone: leadPhone || null,
        state,
        practice_area: practiceArea,
        description: leadDescription,
        urgency: leadUrgency,
        consent_contact: true,
      });
      if (insertError) throw insertError;
      setLeadSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Find a Civil Rights Attorney — Free Match Tool | Civil Rights Hub"
        description="Answer a few questions and get matched with experienced civil rights attorneys in your state. Free, confidential, no obligation."
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Find a Civil Rights Attorney
          </h1>
          <p className="text-muted-foreground text-lg">
            Free, confidential matching. No account required. No obligation.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Tell us what you need
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">Your State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger id="state">
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
                <Label htmlFor="practice">What do you need help with?</Label>
                <Select value={practiceArea} onValueChange={setPracticeArea}>
                  <SelectTrigger id="practice">
                    <SelectValue placeholder="Select a practice area" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRACTICE_AREAS.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleSearch}
              disabled={!state || !practiceArea || loading}
              className="w-full"
              size="lg"
            >
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Searching..." : "Find Attorneys"}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold">
              {results.length} attorney{results.length !== 1 ? "s" : ""} found in {state}
            </h2>
            {results.map((attorney) => (
              <Card key={attorney.id} className={attorney.is_premium ? "border-primary/40" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{attorney.name}</h3>
                        {attorney.is_premium && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {attorney.premium_tier === "spotlight" ? "★ Spotlight" : "Featured"}
                          </span>
                        )}
                        {attorney.accepts_pro_bono && (
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            Pro Bono
                          </span>
                        )}
                      </div>
                      {attorney.firm && <p className="text-sm text-muted-foreground mb-2">{attorney.firm}</p>}
                      {attorney.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{attorney.bio}</p>}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {attorney.specialties?.slice(0, 4).map((s) => (
                          <span key={s} className="rounded-md bg-muted px-2 py-1 text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {attorney.city && <span className="text-muted-foreground">{attorney.city}, {attorney.state}</span>}
                        {attorney.phone && (
                          <a href={`tel:${attorney.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                            <Phone className="h-3.5 w-3.5" /> {attorney.phone}
                          </a>
                        )}
                        {attorney.website && (
                          <a href={attorney.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                            <Globe className="h-3.5 w-3.5" /> Website
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{attorney.match_score}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">match</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Lead form — show after search results */}
        {results.length > 0 && !leadSubmitted && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Need help? Submit your case — attorneys will contact you
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your information is sent to matching attorneys in {state}. They'll reach out to you directly. Free, no obligation.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lead-name">Your Name (optional)</Label>
                  <Input id="lead-name" value={leadName} onChange={(e) => setLeadName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lead-email">Email (optional)</Label>
                  <Input id="lead-email" type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lead-phone">Phone (optional)</Label>
                  <Input id="lead-phone" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lead-urgency">Urgency</Label>
                  <Select value={leadUrgency} onValueChange={setLeadUrgency}>
                    <SelectTrigger id="lead-urgency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="lead-desc">Describe your situation *</Label>
                <Textarea
                  id="lead-desc"
                  value={leadDescription}
                  onChange={(e) => setLeadDescription(e.target.value)}
                  placeholder="Briefly describe what happened, when, and what kind of help you're looking for."
                  rows={4}
                />
              </div>
              <Button onClick={handleLeadSubmit} disabled={!leadDescription || loading} className="w-full" size="lg">
                {loading ? "Submitting..." : "Submit to Attorneys"}
              </Button>
            </CardContent>
          </Card>
        )}

        {leadSubmitted && (
          <Card className="border-emerald-500/50">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Your case has been submitted</h3>
              <p className="text-muted-foreground text-sm">
                Matching attorneys in {state} will review your case and contact you directly.
                Your lead expires in 30 days if no attorney responds.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
