import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { KnowYourRights } from "@/components/KnowYourRights";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ATTORNEY_DIRECTORY } from "@/lib/seoData";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";
import { DonationBanner } from "@/components/DonationBanner";
import { FeaturedAttorney } from "@/components/FeaturedAttorney";
import { EmergencyFAB } from "@/components/EmergencyActionSheet";
import { Skeleton } from "@/components/ui/skeleton";

const CrisisHUD = lazy(() =>
  import("@/components/CrisisHUD").then((module) => ({ default: module.CrisisHUD }))
);

const ResourceCommandCenter = lazy(() =>
  import("@/components/ResourceCommandCenter").then((module) => ({
    default: module.ResourceCommandCenter,
  }))
);

const OfficerAccountability = lazy(() =>
  import("@/components/OfficerAccountability").then((module) => ({
    default: module.OfficerAccountability,
  }))
);

const attorneyNames = ATTORNEY_DIRECTORY.map((entry) => entry.name);
const organizationNames = ATTORNEY_DIRECTORY.map((entry) => entry.organization).filter(
  (o): o is string => Boolean(o)
);

const seoKeywords = [
  "civil rights hub",
  "We The People News attorneys",
  "constitutional rights legal resources",
  "civil rights pro bono network",
  "attorney directory for protest defense",
  "media freedom legal help",
  "FOIA litigation lawyers",
  "report police misconduct",
  "know your rights",
  "civil rights violations",
  "police accountability",
  ...attorneyNames,
  ...organizationNames,
].join(", ");

const seoTitle = "Civil Rights Hub | Know Your Rights · Report Violations · Find Attorneys";
const seoDescription =
  "Civil Rights Hub is the nation's most comprehensive civil rights platform. Report violations, find pro bono attorneys, track FOIA requests, access Know Your Rights guides, and connect with your community.";

const legalServicesStructuredData = {
  "@context": "https://schema.org",
  "@graph": ATTORNEY_DIRECTORY.map((entry) => {
    const keywords = [...entry.practiceAreas, ...(entry.specialties ?? [])];
    const service: Record<string, unknown> = {
      "@type": "LegalService",
      name: entry.name,
      description: entry.description,
      areaServed: entry.state,
      keywords: keywords.join(", "),
    };
    if (entry.website) { service.url = entry.website; service.sameAs = entry.website; }
    if (entry.phone) service.telephone = entry.phone;
    if (entry.email) service.email = entry.email;
    if (entry.organization) {
      service.parentOrganization = {
        "@type": "Organization",
        name: entry.organization,
        ...(entry.website ? { url: entry.website } : {}),
      };
    }
    return service;
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        ogTitle={seoTitle}
        ogDescription={seoDescription}
        twitterTitle={seoTitle}
        twitterDescription={seoDescription}
        structuredData={legalServicesStructuredData}
      />
      <Header />
      <Hero />
      <div className="container mx-auto px-4 py-6 space-y-4">
        <StatePreferenceBanner />
        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          <CrisisHUD />
        </Suspense>
        <FeaturedAttorney />
      </div>
      <KnowYourRights />
      <Suspense fallback={<div className="container mx-auto px-4 py-10 space-y-4"><Skeleton className="h-8 w-1/3" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div></div>}>
        <OfficerAccountability />
      </Suspense>
      <Suspense fallback={<div className="container mx-auto px-4 py-10 space-y-4"><Skeleton className="h-8 w-1/3" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}</div></div>}>
        <ResourceCommandCenter />
      </Suspense>
      <DonationBanner />
      <Footer />
      <EmergencyFAB />
    </div>
  );
};

export default Index;
