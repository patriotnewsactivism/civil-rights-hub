import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, X, Check } from "lucide-react";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION } from "@/data/usStates";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const DISMISS_KEY = "digest_banner_dismissed_v1";

export function DigestSubscribeBanner() {
  const { state } = useJurisdiction();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      // ignore
    }

    let cancelled = false;
    supabase.auth.getUser().then(async ({ data }) => {
      if (cancelled) return;
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) {
        setHasSubscription(false);
        return;
      }
      const { data: sub } = await supabase
        .from("digest_subscriptions")
        .select("id, enabled")
        .eq("user_id", uid)
        .maybeSingle();
      if (!cancelled) setHasSubscription(Boolean(sub?.enabled));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubscribe = async () => {
    if (!userId) return;
    setSubmitting(true);
    const targetState = state && state !== DEFAULT_JURISDICTION ? state : null;
    const { error } = await supabase.from("digest_subscriptions").upsert(
      {
        user_id: userId,
        state: targetState,
        frequency: "weekly",
        enabled: true,
      },
      { onConflict: "user_id" },
    );
    setSubmitting(false);
    if (error) {
      toast.error("Could not subscribe", { description: error.message });
      return;
    }
    setHasSubscription(true);
    toast.success("You're in", { description: "Weekly digest enabled." });
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (dismissed || hasSubscription === null || hasSubscription === true) return null;

  return (
    <div className="container mx-auto px-4 pt-4">
      <Card className="relative flex flex-col items-start gap-3 border-primary/30 bg-primary/5 p-4 md:flex-row md:items-center md:justify-between">
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-background/60 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Get the weekly civil-rights digest</p>
            <p className="text-xs text-muted-foreground">
              3 things in {state && state !== DEFAULT_JURISDICTION ? state : "your area"}, every Monday. New
              violations, FOIA news, court watches, attorney listings.
            </p>
          </div>
        </div>
        {userId ? (
          <Button onClick={handleSubscribe} disabled={submitting} size="sm">
            <Check className="mr-1.5 h-3.5 w-3.5" />
            {submitting ? "Subscribing…" : "Subscribe"}
          </Button>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link to="/auth">Sign in to subscribe</Link>
          </Button>
        )}
      </Card>
    </div>
  );
}
