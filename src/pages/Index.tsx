import { Hero } from "@/components/Hero";
import { RightsOverview } from "@/components/RightsOverview";
import { StateSelector } from "@/components/StateSelector";
import { Resources } from "@/components/Resources";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <RightsOverview />
      <StateSelector />
      <Resources />
      <Footer />
    </div>
  );
};

export default Index;
