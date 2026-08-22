import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";

export default function SolCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Limitations Data Verification Hold | Civil Rights Hub"
        description="The statute-of-limitations calculator is temporarily withheld while its state-by-state legal dataset is re-verified against primary legal authority."
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <VerifiedDataHold
            title="Statute-of-limitations calculator is temporarily withheld"
            description="The calculator depends on a state-by-state limitations dataset that was applied directly to the production database without its full SQL being preserved in the repository. Because limitations periods can be claim-specific and legally consequential, Civil Rights Hub will not display those legacy calculations until every published rule is tied to current primary authority."
            detail="Do not rely on a cached or previously displayed deadline from this tool. Filing deadlines can depend on jurisdiction, claim type, accrual rules, tolling, notice requirements, and current law."
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
