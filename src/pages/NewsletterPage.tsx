import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, Shield, MapPin, Info } from "lucide-react";

export default function NewsletterPage() {
  return (
    <>
      <SEO
        title="Civil Rights Digest Signup | Civil Rights Hub"
        description="Register your email and optional interests for future Civil Rights Digest updates. Recurring delivery and confirmation workflows are still being finalized."
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
                Register your interest in future civil-rights news, research, tools, and resource updates.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg border bg-card p-4">
                <Newspaper className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium mb-1">News & Research</p>
                <p className="text-sm text-muted-foreground">Civil-rights reporting, public-records work, and research updates.</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <Shield className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium mb-1">Tools & References</p>
                <p className="text-sm text-muted-foreground">Updates to rights references, public-records tools, and documentation resources.</p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium mb-1">Optional State Preference</p>
                <p className="text-sm text-muted-foreground">Save a U.S. state preference to help organize future location-relevant updates.</p>
              </div>
            </div>

            <NewsletterSubscribe variant="full" />

            <Card className="mt-8 bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm font-medium">Current delivery status</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The public signup form currently records email and optional preference data in the site database. A separate digest-delivery workflow exists in the codebase, but the signup and delivery paths are not yet verified as one complete production flow. Until that is confirmed, Civil Rights Hub does not publish a subscriber count or promise a recurring cadence.
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
