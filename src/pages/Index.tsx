import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RightsOverview } from "@/components/RightsOverview";
import { StateSelector } from "@/components/StateSelector";
import { InteractiveMap } from "@/components/InteractiveMap";
import { CaseSearch } from "@/components/CaseSearch";
import { AITools } from "@/components/AITools";
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
      <Hero />
      <RightsOverview />
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <InteractiveMap onStateSelect={handleStateSelect} />
          </div>
        </div>
      </section>
      <StateSelector selectedState={selectedState} />
      <CaseSearch />
      <AITools />
      <Resources />
      <Footer />
    </div>
  );
};

export default Index;
