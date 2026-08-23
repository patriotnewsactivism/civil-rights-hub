import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";

export default function StateComparisonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="State Rights Comparison Verification Hold | Civil Rights Hub"
        description="The state-rights comparison tool is temporarily withheld while its legal conclusions are re-verified against current primary legal authority."
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <VerifiedDataHold
            title="State rights comparison is temporarily withheld"
            description="This comparison depends on a legal dataset that was applied directly to production without the full deployed SQL being preserved in the repository. Civil Rights Hub will not present state-by-state recording, identification, or police-encounter conclusions as verified until each claim is tied to current statutes, court decisions, or other primary authority."
            detail="The rebuilt comparison will show its sources and verification date so users can distinguish authoritative law from explanatory guidance."
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
