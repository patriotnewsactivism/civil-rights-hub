import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, Users, Shield, TrendingUp } from "lucide-react";

export default function NewsletterPage() {
  return (
    <>
      <SEO
        title="Civil Rights Digest — Free Weekly Newsletter | Civil Rights Hub"
        description="Get a weekly digest of civil rights news, new tools, attorney listings, and public records updates — tailored to your state and interests. Free. No spam."
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Civil Rights Digest
              </h1>
              <p className="text-muted-foreground text-lg">
                Your weekly brief on civil rights news, tools, and resources.
              </p>
            </div>

            {/* What you get */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg border bg-card p-4">
                <Newspaper className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium mb-1">Curated News</p>
                <p className="text-sm text-muted-foreground">Top civil rights stories of the week, no fluff</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <Shield className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium mb-1">New Tools & Resources</p>
                <p className="text-sm text-muted-foreground">Know Your Rights updates, SOL changes, new guides</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium mb-1">State-Specific Alerts</p>
                <p className="text-sm text-muted-foreground">Legislation and rights changes in your state</p>
              </div>
            </div>

            <NewsletterSubscribe variant="full" />

            <Card className="mt-8 bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-medium">Trusted by 1,200+ subscribers</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  The Civil Rights Digest is free, always. We never sell your email. Sponsors help us keep it free — and we clearly label sponsored content so you always know what's editorial vs. sponsored.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
