import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NewsletterSignupProps {
  variant?: "banner" | "inline" | "card";
  className?: string;
  heading?: string;
  subheading?: string;
}

// Buttondown public subscribe endpoint — set VITE_BUTTONDOWN_USERNAME in .env
const BUTTONDOWN_USERNAME = import.meta.env.VITE_BUTTONDOWN_USERNAME as string | undefined;

export function NewsletterSignup({
  variant = "inline",
  className,
  heading = "Stay informed. No spam.",
  subheading = "Get a weekly digest of civil rights news, new attorney listings, and FOIA updates in your area.",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      if (BUTTONDOWN_USERNAME) {
        const res = await fetch(
          `https://api.buttondown.email/v1/subscribers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${BUTTONDOWN_USERNAME}`,
            },
            body: JSON.stringify({ email_address: email }),
          },
        );
        if (!res.ok && res.status !== 409) {
          throw new Error("Subscription failed");
        }
      }
      // If no username configured, gracefully succeed (dev mode)
      setSubmitted(true);
      toast.success("You're subscribed!", {
        description: "Check your inbox to confirm your email address.",
      });
    } catch {
      toast.error("Subscription failed", {
        description: "Please try again or email us directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={cn("flex items-center gap-3 text-green-600", className)}>
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm font-medium">
          Subscribed! Check your inbox to confirm.
        </p>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className={cn("bg-primary/5 border border-primary/20 rounded-xl p-6", className)}>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Mail className="h-8 w-8 text-primary flex-shrink-0 hidden sm:block" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{heading}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{subheading}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm h-9 min-w-0 w-full sm:w-52"
            />
            <Button type="submit" size="sm" disabled={loading} className="flex-shrink-0">
              {loading ? "…" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("rounded-xl border bg-card p-6 space-y-4", className)}>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">{heading}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{subheading}</p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Subscribing…" : "Get weekly digest"}
          </Button>
        </form>
        <p className="text-[11px] text-muted-foreground">
          Free. Unsubscribe anytime. No account required.
        </p>
      </div>
    );
  }

  // inline (default)
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium">{heading}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-sm"
        />
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "…" : "Subscribe"}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">{subheading}</p>
    </div>
  );
}
