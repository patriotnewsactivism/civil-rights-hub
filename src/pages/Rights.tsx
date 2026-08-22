import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DonationCTA } from "@/components/DonationCTA";
import { KnowYourRights } from "@/components/KnowYourRights";
import { IncidentGuide } from "@/components/IncidentGuide";
import { SEO } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, AlertTriangle, BookOpen, FileWarning } from "lucide-react";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";

const Rights = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Know Your Rights | Federal Reference & Documentation Guide | Civil Rights Hub"
        description="Plain-language federal constitutional orientation and conservative incident-documentation guidance. State-specific legal conclusions are temporarily withheld pending primary-source verification."
        ogTitle="Know Your Rights"
        ogDescription="Federal constitutional orientation and incident-documentation guidance with state-specific data held until primary-source verification is complete."
        canonicalUrl="https://civilrightshub.org/rights"
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold">Rights</p>
            <h1 className="text-4xl font-bold">Federal rights reference and documentation guidance</h1>
            <p className="text-lg text-muted-foreground">
              Use the federal reference as a starting point for research and the incident guide for evidence-preservation practices. State-specific recording, identification, conflict, and contact data is withheld until each claim is tied to current primary authority.
            </p>
          </div>

          <Tabs defaultValue="know-rights" className="space-y-6">
            <TabsList className="flex w-full justify-start overflow-x-auto flex-nowrap bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
              <TabsTrigger
                value="know-rights"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
              >
                <BookOpen className="h-4 w-4 mr-1.5" />
                Federal Reference
              </TabsTrigger>
              <TabsTrigger
                value="incident"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 text-sm font-medium"
              >
                <FileWarning className="h-4 w-4 mr-1.5" />
                Incident Guide
              </TabsTrigger>
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
                State Conflicts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="know-rights" className="space-y-6">
              <KnowYourRights />
            </TabsContent>

            <TabsContent value="incident" className="space-y-6">
              <IncidentGuide />
            </TabsContent>

            <TabsContent value="state-laws" className="space-y-6">
              <VerifiedDataHold
                title="State recording-law summaries are temporarily withheld"
                description="The legacy state selector contains generated organizations, generated legal-support labels, and generalized state recording conclusions that are not tied field-by-field to current statutes or controlling cases."
                detail="The rebuilt state view will cite current primary authority and show its verification date instead of generating state-specific organizations or legal conclusions from a template."
              />
            </TabsContent>

            <TabsContent value="conflicts" className="space-y-6">
              <VerifiedDataHold
                title="State conflict-law database is temporarily withheld"
                description="The legacy conflict table includes legal-status conclusions, severity labels, challenge advice, and reporting contacts without the provenance controls required for high-stakes legal guidance."
                detail="Those records will return only after current statutes, court orders, and source-backed contact information are independently verified."
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <DonationCTA variant="banner" />
      <Footer />
    </div>
  );
};

export default Rights;
