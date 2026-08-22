import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";

export default function AttorneyPremiumPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Attorney Premium Program Verification Hold | Civil Rights Hub"
        description="Civil Rights Hub is temporarily withholding premium attorney enrollment while the attorney directory and lead-routing system are re-verified."
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <VerifiedDataHold
            title="Premium attorney enrollment is temporarily withheld"
            description="Civil Rights Hub is not currently selling directory placement, ranking boosts, verified badges, or lead-routing benefits while the underlying attorney directory and matching system are being re-verified."
            detail="Enrollment can reopen only after the directory, bar-status verification workflow, pricing, placement rules, and lead-routing behavior are confirmed against the production system. No premium application is collected from this page while the hold is active."
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
