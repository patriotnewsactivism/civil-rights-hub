import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { FOIABuilder } from "@/components/FOIABuilder";
import { FOIATracker } from "@/components/FOIATracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ResourceCommandCenter = lazy(() =>
  import("@/components/ResourceCommandCenter").then((module) => ({ default: module.ResourceCommandCenter }))
);

const seoTitle = "Tools | Civil Rights Hub";
const seoDescription = "FOIA generator, accountability workflows, and safety utilities for fast action.";

export default function Tools() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalUrl="https://civilrightshub.org/tools"
        ogTitle={seoTitle}
        ogDescription={seoDescription}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tools</p>
          <h1 className="text-4xl font-bold leading-tight">Accountability tools and generators</h1>
          <p className="text-muted-foreground">
            Draft public records requests, track follow-ups, and access the broader Civil Rights Hub command center for
            evidence, scanners, and legal support workflows.
          </p>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            Do not include sensitive personal data in generators unless you intend to share it. Verify destination emails
            and follow your agency's submission requirements before sending.
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>FOIA & Public Records Toolkit</CardTitle>
            <CardDescription>
              Build requests, track deadlines, and capture the context you need for appeals or escalation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FOIABuilder />
            <FOIATracker />
          </CardContent>
        </Card>

        <Suspense fallback={<div className="text-center text-muted-foreground">Loading tools…</div>}>
          <ResourceCommandCenter />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
