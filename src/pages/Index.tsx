import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { KnowYourRights } from "@/components/KnowYourRights";
import { IncidentGuide } from "@/components/IncidentGuide";
import { ViolationReport } from "@/components/ViolationReport";
import { ViolationFeed } from "@/components/ViolationFeed";
import { StateSelector } from "@/components/StateSelector";
import { InteractiveMap } from "@/components/InteractiveMap";
import { CaseSearch } from "@/components/CaseSearch";
import { AITools } from "@/components/AITools";
import { PoliceScanner } from "@/components/PoliceScanner";
import { LawyerFinder } from "@/components/LawyerFinder";
import { FOIABuilder } from "@/components/FOIABuilder";
import { ActivistDirectory } from "@/components/ActivistDirectory";
import { Resources } from "@/components/Resources";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [selectedState, setSelectedState] = useState("");

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    const element = document.getElementById('states');
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <KnowYourRights />
      <IncidentGuide />
      <ViolationReport />
      <ViolationFeed />
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <InteractiveMap onStateSelect={handleStateSelect} />
          </div>
        </div>
      </section>
      <StateSelector selectedState={selectedState} onStateChange={setSelectedState} />
      <PoliceScanner />
      <LawyerFinder />
      <ActivistDirectory />
      <FOIABuilder />
      <CaseSearch />
      <AITools />
      <Resources />
      <Footer />
    </div>
  );
};

export default Index;
