import { Suspense, lazy, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Users, Scale, BookOpen, FileText, LayoutGrid } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DonationCTA } from "@/components/DonationCTA";
import { LawyerFinder } from "@/components/LawyerFinder";
import { ActivistDirectory } from "@/components/ActivistDirectory";
import { Resources } from "@/components/Resources";
import { PublicRecordsTracker } from "@/components/PublicRecordsTracker";
import { ResourceLibrary } from "@/components/ResourceLibrary";
import { SEO } from "@/components/SEO";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ResourceCommandCenter = lazy(() =>
  import("@/components/ResourceCommandCenter").then((module) => ({
    default: module.ResourceCommandCenter,
  }))
);

type HelpTab = "attorneys" | "activists" | "resources" | "records" | "tools";

const TABS: { value: HelpTab; label: string; icon: typeof Scale }[] = [
  { value: "attorneys", label: "Attorneys", icon: Scale },
  { value: "activists", label: "Activists", icon: Users },
  { value: "resources", label: "Resources", icon: BookOpen },
  { value: "records", label: "Public Records", icon: FileText },
  { value: "tools", label: "All Tools", icon: LayoutGrid },
];

const GetHelp = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<HelpTab>(() => {
    const fromHash = hash.replace("#", "") as HelpTab;
    return TABS.some((t) => t.value === fromHash) ? fromHash : "attorneys";
  });

  useEffect(() => {
    const fromHash = hash.replace("#", "") as HelpTab;
    if (TABS.some((t) => t.value === fromHash) && fromHash !== tab) {
      setTab(fromHash);
    }
  }, [hash, tab]);

  const onTabChange = (value: string) => {
    setTab(value as HelpTab);
    navigate(`/help#${value}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Get Help & Tools | Attorneys, Activists, FOIA, and Resources"
        description="The unified hub for civil rights help — search 1,700+ attorneys by state and specialty, find First Amendment auditors and activists, file and track FOIA requests, browse the resource library, and launch every tool in one place."
        ogTitle="Get Help & Tools — Civil Rights Hub"
        ogDescription="Attorneys, activists, public records tracker, resource library, and every accountability tool in one hub."
        canonicalUrl="https://civilrightshub.org/help"
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-wide text-accent font-semibold">Help &amp; Tools</p>
            <h1 className="text-4xl font-bold">Everything you need to defend your rights</h1>
            <p className="text-lg text-muted-foreground">
              Find legal representation, connect with activists, file and track public records requests, browse vetted resources,
              and launch every accountability tool — all from one place.
            </p>
          </div>
          <StatePreferenceBanner />
          <Tabs value={tab} onValueChange={onTabChange} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto h-auto py-1.5">
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="attorneys" className="mt-6">
              <LawyerFinder />
            </TabsContent>
            <TabsContent value="activists" className="mt-6">
              <ActivistDirectory />
            </TabsContent>
            <TabsContent value="resources" className="mt-6">
              <ResourceLibrary />
              <div className="mt-8">
                <Resources />
              </div>
            </TabsContent>
            <TabsContent value="records" className="mt-6">
              <PublicRecordsTracker />
            </TabsContent>
            <TabsContent value="tools" className="mt-6">
              <Suspense
                fallback={<div className="py-8 text-center text-muted-foreground text-sm">Loading tools…</div>}
              >
                <ResourceCommandCenter />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <DonationCTA variant="banner" />
      <Footer />
    </div>
  );
};

export default GetHelp;
