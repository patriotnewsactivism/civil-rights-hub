import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Mail, Newspaper, Clock } from "lucide-react";

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

const INTEREST_OPTIONS = [
  { key: "police_misconduct", label: "Police Misconduct" },
  { key: "voting_rights", label: "Voting Rights" },
  { key: "first_amendment", label: "First Amendment / Press" },
  { key: "housing", label: "Housing Discrimination" },
  { key: "employment", label: "Employment Discrimination" },
  { key: "immigration", label: "Immigration" },
  { key: "criminal_justice", label: "Criminal Justice Reform" },
  { key: "foia", label: "Public Records / FOIA" },
];

export function NewsletterSubscribe({
  variant = "full",
}: {
  variant?: "full" | "compact";
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function toggleInterest(key: string) {
    setSelectedInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSubmit() {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from("newsletter_subscribers").insert({
        email,
        state: state || null,
        interests: selectedInterests,
        source: "site_widget",
        is_confirmed: false,
      });
      if (insertError) {
        // If duplicate email, treat as success (already subscribed)
        if (insertError.code === "23505") {
          setSuccess(true);
          return;
        }
        throw insertError;
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="border-emerald-500/50">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-semibold text-lg mb-1">You're subscribed!</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Watch for your first Civil Rights Digest soon. We'll send you the most relevant updates based on your interests{state ? ` in ${state}` : ""}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          {variant === "compact" ? "Get Weekly Updates" : "Civil Rights Digest — Free Weekly Newsletter"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {variant === "full" && (
          <p className="text-sm text-muted-foreground">
            Get a weekly digest of civil rights news, new tools, attorney listings, and public records updates — tailored to your state and interests. Free. No spam. Unsubscribe anytime.
          </p>
        )}

        <div>
          <Label htmlFor="nl-email">Email Address *</Label>
          <div className="flex gap-2">
            <Input
              id="nl-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>
        </div>

        {variant === "full" && (
          <>
            <div>
              <Label htmlFor="nl-state">Your State (for local updates)</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="nl-state">
                  <SelectValue placeholder="Select your state (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Topics You Care About (optional)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {INTEREST_OPTIONS.map((opt) => {
                  const selected = selectedInterests.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => toggleInterest(opt.key)}
                      className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted hover:bg-muted"
                      }`}
                    >
                      {selected && <CheckCircle2 className="h-3 w-3" />}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button onClick={handleSubmit} disabled={!email || loading} className="w-full" size="lg">
          <Mail className="mr-2 h-4 w-4" />
          {loading ? "Subscribing..." : "Subscribe Free"}
        </Button>

        {variant === "full" && (
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Weekly</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> No spam</span>
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> Unsubscribe anytime</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
