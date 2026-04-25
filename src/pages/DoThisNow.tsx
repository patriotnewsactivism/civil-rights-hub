import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScenarioPlaybooks } from "@/components/ScenarioPlaybooks";
import { IncidentGuide } from "@/components/IncidentGuide";
import { EmergencyRightsCard } from "@/components/EmergencyRightsCard";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";
import { SEO } from "@/components/SEO";

const DoThisNow = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Do This Now | Rapid response scripts & rights cards"
      description="Fast playbooks for stops, searches, trespass warnings, protest encounters, and a printable pocket rights card with scripts and emergency contacts."
      ogTitle="Do This Now"
      ogDescription="Rapid response scripts, printable rights card, and safety checklists for high-stress moments."
    />
    <Header />
    <main className="flex-1">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm uppercase tracking-wide text-primary font-semibold">Rapid response</p>
          <h1 className="text-4xl font-bold">Do this now when things get tense</h1>
          <p className="text-lg text-muted-foreground">
            Grab the right script, copy it, and follow the do/don't checklist. Print or screenshot the
            pocket rights card so you always have it when it matters. Use the guides below to keep yourself
            and your team safe in the moment.
          </p>
        </div>
        <StatePreferenceBanner />
        <EmergencyRightsCard />
        <ScenarioPlaybooks />
        <IncidentGuide />
      </div>
    </main>
    <Footer />
  </div>
);

export default DoThisNow;
