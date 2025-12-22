import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KnowYourRights } from "@/components/KnowYourRights";
import { SEO } from "@/components/SEO";

const seoTitle = "Know Your Rights | Civil Rights Hub";
const seoDescription =
  "State-aware constitutional rights, recording rules, and emergency scripts with downloadable guides.";

export default function Rights() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalUrl="https://civilrightshub.org/rights"
        ogTitle={seoTitle}
        ogDescription={seoDescription}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Know Your Rights</p>
          <h1 className="text-4xl font-bold leading-tight">Know your rights by jurisdiction</h1>
          <p className="text-muted-foreground">
            Quick-reference summaries for the First, Fourth, Fifth, and other core protections, plus recording rules and
            emergency language you can use immediately. Always verify state-specific nuances before acting.
          </p>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            This hub provides general legal information—not legal advice. Laws change, so confirm details with a licensed
            attorney in your state before relying on any guidance.
          </div>
        </div>
        <KnowYourRights />
      </main>
      <Footer />
    </div>
  );
}
