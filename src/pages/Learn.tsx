import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StateSelector } from "@/components/StateSelector";
import { InteractiveMap } from "@/components/InteractiveMap";
import { Resources } from "@/components/Resources";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";
import { SEO } from "@/components/SEO";
import { useJurisdiction } from "@/hooks/useJurisdiction";

const Learn = () => {
  const { state, setState } = useJurisdiction();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Learn | Law library and state guides"
        description="Explore federal and state civil rights laws, recording rules, and accountability resources tailored to your jurisdiction."
        ogTitle="Learn the law"
        ogDescription="State-by-state guides and maps for filming, ID rules, and public records."
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10 space-y-10">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold">Learn</p>
            <h1 className="text-4xl font-bold">Civil rights law library</h1>
            <p className="text-lg text-muted-foreground">
              Browse state and federal references, recording laws, and safety resources. Use the selector to focus on your
              jurisdiction and jump straight to relevant statutes.
            </p>
          </div>
          <StatePreferenceBanner />
          <InteractiveMap onStateSelect={setState} />
          <StateSelector selectedState={state} onStateChange={setState} />
          <Resources />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
