import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KnowYourRights } from "@/components/KnowYourRights";
import { IncidentGuide } from "@/components/IncidentGuide";
import { StateSelector } from "@/components/StateSelector";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";
import { SEO } from "@/components/SEO";
import { useJurisdiction } from "@/hooks/useJurisdiction";

const Rights = () => {
  const { state, setState } = useJurisdiction();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Know Your Rights | Civil Rights Hub"
        description="State-aware stop-and-identify rules, recording laws, and rapid scripts to assert your rights safely."
        ogTitle="Know Your Rights"
        ogDescription="Tailored guidance for stops, searches, recording, and protests with state-level nuance."
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold">Rights</p>
            <h1 className="text-4xl font-bold">Know your rights with state-aware context</h1>
            <p className="text-lg text-muted-foreground">
              Use the selector below to tailor recording rules, stop-and-identify guidance, and escalation scripts to the state
              you are operating in. Download pocket guides or share scenarios with your team.
            </p>
          </div>
          <StatePreferenceBanner />
          <StateSelector selectedState={state} onStateChange={setState} />
          <KnowYourRights />
          <IncidentGuide />
          <div className="rounded-lg border border-amber-300/50 bg-amber-50 p-4 text-sm text-amber-900">
            This content is for general information only and does not create an attorney-client relationship. Confirm
            applicability with a licensed attorney in your jurisdiction before relying on it.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rights;
