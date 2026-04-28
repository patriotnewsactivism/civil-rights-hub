import { Suspense, lazy, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ViolationReport } from "@/components/ViolationReport";
import { SEO } from "@/components/SEO";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";
import { CaseEvaluator } from "@/components/CaseEvaluator";
import { EvidenceVault } from "@/components/EvidenceVault";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Lock, FileText, Search, AlertTriangle, Wrench } from "lucide-react";

const ResourceCommandCenter = lazy(() =>
  import("@/components/ResourceCommandCenter").then((module) => ({
    default: module.ResourceCommandCenter,
  }))
);

const Tools = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Tools | Case Evaluator, Evidence Vault, FOIA & More — Civil Rights Hub"
        description="AI case evaluator, evidence vault with chain of custody, FOIA builder, violation reporting, and accountability dashboards. All free."
        ogTitle="Civil Rights Tools"
        ogDescription="AI-powered case evaluation, secure evidence storage, FOIA builders, and more."
        keywords="civil rights case evaluator, evidence vault, FOIA request builder, police brutality tools, civil rights resources"
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold">Tools</p>
            <h1 className="text-4xl font-bold">
              Your Civil Rights{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Toolkit
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-powered case evaluation, secure evidence storage with chain of custody, FOIA
              request builders, violation reporting, and more — all free, all private.
            </p>
          </div>

          <StatePreferenceBanner />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
              <TabsTrigger value="all" className="gap-1.5 text-xs sm:text-sm">
                <Wrench className="h-3.5 w-3.5" /> All Tools
              </TabsTrigger>
              <TabsTrigger value="evaluate" className="gap-1.5 text-xs sm:text-sm">
                <Scale className="h-3.5 w-3.5" /> Case Evaluator
              </TabsTrigger>
              <TabsTrigger value="vault" className="gap-1.5 text-xs sm:text-sm">
                <Lock className="h-3.5 w-3.5" /> Evidence Vault
              </TabsTrigger>
              <TabsTrigger value="foia" className="gap-1.5 text-xs sm:text-sm">
                <Search className="h-3.5 w-3.5" /> FOIA & Search
              </TabsTrigger>
              <TabsTrigger value="report" className="gap-1.5 text-xs sm:text-sm">
                <AlertTriangle className="h-3.5 w-3.5" /> Report Violation
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="all" className="space-y-8 mt-0">
                <CaseEvaluator />
                <EvidenceVault />
                <Suspense
                  fallback={
                    <div className="py-8 text-center text-muted-foreground">Loading tools…</div>
                  }
                >
                  <ResourceCommandCenter />
                </Suspense>
                <ViolationReport />
              </TabsContent>

              <TabsContent value="evaluate" className="mt-0">
                <CaseEvaluator />
              </TabsContent>

              <TabsContent value="vault" className="mt-0">
                <EvidenceVault />
              </TabsContent>

              <TabsContent value="foia" className="mt-0">
                <Suspense
                  fallback={
                    <div className="py-8 text-center text-muted-foreground">Loading tools…</div>
                  }
                >
                  <ResourceCommandCenter />
                </Suspense>
              </TabsContent>

              <TabsContent value="report" className="mt-0">
                <ViolationReport />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
