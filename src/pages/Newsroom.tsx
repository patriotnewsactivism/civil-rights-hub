import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const FeaturedNews = lazy(() =>
  import("@/components/FeaturedNews").then((module) => ({ default: module.FeaturedNews }))
);

const Newsroom = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Newsroom | We The People News"
      description="Investigations, explainers, and document drops from the Civil Rights Hub newsroom."
      ogTitle="Newsroom"
      ogDescription="Stay current on investigations and civil rights coverage."
    />
    <Header />
    <main className="flex-1">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm uppercase tracking-wide text-primary font-semibold">Newsroom</p>
          <h1 className="text-4xl font-bold">Investigations and explainers</h1>
          <p className="text-lg text-muted-foreground">
            Verified reporting, timelines, and document drops from We The People News. Articles with clear sources and “last
            updated” dates live here, separate from opinion posts.
          </p>
        </div>
        <Suspense
          fallback={<div className="py-8 text-center text-muted-foreground">Loading newsroom…</div>}
        >
          <FeaturedNews />
        </Suspense>
      </div>
    </main>
    <Footer />
  </div>
);

export default Newsroom;
