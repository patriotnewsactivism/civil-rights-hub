import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LawyerFinder } from "@/components/LawyerFinder";
import { ResourceLibrary } from "@/components/ResourceLibrary";
import { ResourceCommandCenter } from "@/components/ResourceCommandCenter";
import { SEO } from "@/components/SEO";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";

const GetHelp = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Get Help | Attorneys and hotlines"
      description="Find civil rights attorneys, emergency hotlines, and resource partners with state-aware filters."
      ogTitle="Get Help"
      ogDescription="Attorney directory, pro-bono intake, and rapid hotlines."
    />
    <Header />
    <main className="flex-1">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm uppercase tracking-wide text-primary font-semibold">Support</p>
          <h1 className="text-4xl font-bold">Get connected to legal help fast</h1>
          <p className="text-lg text-muted-foreground">
            Search attorneys by state and specialty, browse vetted hotlines, and open the tools you need to collect evidence and
            file complaints.
          </p>
        </div>
        <StatePreferenceBanner />
        <LawyerFinder />
        <ResourceLibrary />
        <ResourceCommandCenter />
      </div>
    </main>
    <Footer />
  </div>
);

export default GetHelp;
