import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";
import { SEO } from "@/components/SEO";

const CityPage = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <SEO
      title="City Civil Rights Data Verification | Civil Rights Hub"
      description="City-level attorney and incident datasets are temporarily withheld while Civil Rights Hub re-verifies legacy records against source evidence."
      robots="noindex, follow"
    />
    <Header />
    <main className="flex-1 container mx-auto px-4 py-12">
      <VerifiedDataHold />
    </main>
    <Footer />
  </div>
);

export default CityPage;
