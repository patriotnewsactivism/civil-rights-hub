import { SEO } from "@/components/SEO";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";

export function AttorneyDashboard() {
  return (
    <>
      <SEO
        title="Attorney Dashboard Verification Hold | Civil Rights Hub"
        description="Attorney dashboard access is temporarily withheld while authenticated profile ownership and private lead access are rebuilt and verified."
      />
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <VerifiedDataHold
          title="Attorney dashboard access is temporarily withheld"
          description="The legacy dashboard used an email-address lookup as its access mechanism and then queried private legal-intake leads. An email address is not authentication or proof of profile ownership, so that flow has been disabled."
          detail="Attorney analytics and lead access will return only through an authenticated, server-enforced ownership or organization-membership relationship. Civil Rights Hub will not expose lead names, contact information, or case descriptions through a public email lookup."
        />
      </div>
    </>
  );
}
