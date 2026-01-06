import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ViolationReport } from "@/components/ViolationReport";
import { SEO } from "@/components/SEO";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";

const ResourceCommandCenter = lazy(() =>
  import("@/components/ResourceCommandCenter").then((module) => ({
    default: module.ResourceCommandCenter,
  }))
);

const Tools = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Tools | FOIA, reporting, and research"
      description="Launch FOIA builders, evidence trackers, violation reporting, AI research helpers, and accountability dashboards."
      ogTitle="Civil Rights Tools"
      ogDescription="All generators, trackers, and dashboards in one workspace."
    />
    <Header />
    <main className="flex-1">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm uppercase tracking-wide text-primary font-semibold">Tools</p>
          <h1 className="text-4xl font-bold">All generators and trackers in one place</h1>
          <p className="text-lg text-muted-foreground">
            Draft FOIA requests, log violations, and launch AI copilots without jumping between tabs. Your state preference keeps
            templates and guidance relevant.
          </p>
        </div>
        <StatePreferenceBanner />
        <Suspense
          fallback={<div className="py-8 text-center text-muted-foreground">Loading tools…</div>}
        >
          <ResourceCommandCenter />
        </Suspense>
        <ViolationReport />
      </div>
    </main>
    <Footer />
  </div>
);

export default Tools;
