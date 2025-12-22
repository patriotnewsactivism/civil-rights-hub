import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { InteractiveMap } from "@/components/InteractiveMap";
import { KnowYourRights } from "@/components/KnowYourRights";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const seoTitle = "Learn | Civil Rights Hub";
const seoDescription = "Federal and state law references, recording guidance, and interactive state navigation.";

export default function Learn() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalUrl="https://civilrightshub.org/learn"
        ogTitle={seoTitle}
        ogDescription={seoDescription}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Learn</p>
          <h1 className="text-4xl font-bold leading-tight">Deepen your understanding</h1>
          <p className="text-muted-foreground">
            Browse federal and state-level materials, recording rules, and interactive maps to quickly locate the laws
            that apply where you are working.
          </p>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            Content here is informational and may be incomplete. Always review the latest statutes and case law or
            consult a lawyer before acting on summarized guidance.
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Interactive Map</CardTitle>
            <CardDescription>Jump to state-specific guidance for recording, IDs, and public records.</CardDescription>
          </CardHeader>
          <CardContent>
            <InteractiveMap />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Rights Library</CardTitle>
            <CardDescription>Review amendment summaries and jurisdiction-aware tips.</CardDescription>
          </CardHeader>
          <CardContent>
            <KnowYourRights />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
