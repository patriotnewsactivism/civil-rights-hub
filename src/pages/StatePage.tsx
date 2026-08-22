import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";
import { SEO } from "@/components/SEO";

export default function StatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="State Civil Rights Data Verification | Civil Rights Hub"
        description="State-level attorney and incident datasets are temporarily withheld while Civil Rights Hub re-verifies legacy records against source evidence."
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <VerifiedDataHold />
      </main>
      <Footer />
    </div>
  );
}
