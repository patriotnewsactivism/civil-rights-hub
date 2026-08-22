import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";

export default function AttorneyMatchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Attorney Directory Verification Hold | Civil Rights Hub"
        description="Civil Rights Hub is re-verifying attorney identity, licensing, contact, and practice information against reviewed source evidence before restoring public matching."
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <VerifiedDataHold
            title="Attorney matching is temporarily withheld"
            description="The legacy attorney matcher relies on a database function whose deployed SQL is not preserved in the repository, and the underlying directory contains historical bulk-seeded records. Public matching will return only after attorney identity, licensing, contact details, practice claims, and availability are re-verified field by field."
            detail="No attorney result, pro-bono label, match score, premium placement, or contact-routing promise will be presented as verified until its supporting evidence and matching logic can be audited."
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
