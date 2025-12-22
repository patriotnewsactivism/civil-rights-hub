import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const FeaturedNews = lazy(() =>
  import("@/components/FeaturedNews").then((module) => ({ default: module.FeaturedNews }))
);

const seoTitle = "Newsroom | Civil Rights Hub";
const seoDescription = "Investigations, explainers, and newsroom updates from Civil Rights Hub.";

export default function News() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalUrl="https://civilrightshub.org/news"
        ogTitle={seoTitle}
        ogDescription={seoDescription}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Newsroom</p>
          <h1 className="text-4xl font-bold leading-tight">Investigations and explainers</h1>
          <p className="text-muted-foreground">
            Verified reporting, legal explainers, and timeline coverage from the Civil Rights Hub editorial desk.
            Opinion content is kept separate so you know what is vetted and sourced.
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-muted-foreground">Loading newsroom…</div>}>
          <FeaturedNews />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
