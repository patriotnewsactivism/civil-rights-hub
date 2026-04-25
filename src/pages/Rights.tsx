import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KnowYourRights } from "@/components/KnowYourRights";
import { IncidentGuide } from "@/components/IncidentGuide";
import { StateSelector } from "@/components/StateSelector";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";
import { StateConflictLaws } from "@/components/StateConflictLaws";
import { SEO } from "@/components/SEO";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, AlertTriangle, BookOpen, FileWarning } from "lucide-react";

const Rights = () => {
  const { state, setState } = useJurisdiction();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Know Your Rights | Civil Rights Hub"
        description="State-aware stop-and-identify rules, recording laws, conflicting state legislation, and rapid scripts to assert your rights safely."
        ogTitle="Know Your Rights"
        ogDescription="Tailored guidance for stops, searches, recording, and protests with state-level nuance. Identify laws that conflict with your federal rights."
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 space-y-8">
          {/* Page Header */}
          <div className="max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold">Rights</p>
            <h1 className="text-4xl font-bold">Know your rights with state-aware context</h1>
            <p className="text-lg text-muted-foreground">
              Understand your constitutional protections, identify state laws that may conflict with your rights,
              and get actionable guidance for challenging them. Use the tabs below to explore recording rules,
              conflicting legislation, and incident guides.
            </p>
          </div>

          <StatePreferenceBanner />

          {/* Tabbed Layout */}
          <Tabs defaultValue="state-laws" className="space-y-6">
            <TabsList className="flex w-full justify-start overflow-x-auto flex-nowrap bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
              <TabsTrigger
                value="state-laws"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
              >
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                State Recording Laws
              </TabsTrigger>
              <TabsTrigger
                value="conflicts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
              >
                <AlertTriangle className="h-4 w-4 mr-1.5 text-red-500" />
                <span>Conflicting Laws</span>
              </TabsTrigger>
              <TabsTrigger
                value="know-rights"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
              >
                <BookOpen className="h-4 w-4 mr-1.5" />
                Know Your Rights
              </TabsTrigger>
              <TabsTrigger
                value="incident"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
              >
                <FileWarning className="h-4 w-4 mr-1.5" />
                Incident Guide
              </TabsTrigger>
            </TabsList>

            <TabsContent value="state-laws" className="space-y-6">
              <StateSelector selectedState={state} onStateChange={setState} />
            </TabsContent>

            <TabsContent value="conflicts" className="space-y-6">
              <StateConflictLaws />
            </TabsContent>

            <TabsContent value="know-rights" className="space-y-6">
              <KnowYourRights />
            </TabsContent>

            <TabsContent value="incident" className="space-y-6">
              <IncidentGuide />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rights;
