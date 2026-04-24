import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { KnowYourRights } from "@/components/KnowYourRights";
import { CommunityCarousel } from "@/components/CommunityCarousel";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ATTORNEY_DIRECTORY } from "@/lib/seoData";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";
import { QuickAccessHub } from "@/components/QuickAccessHub";
import { TodayNearYou } from "@/components/TodayNearYou";
import { DigestSubscribeBanner } from "@/components/DigestSubscribeBanner";
import { EmergencyFAB } from "@/components/EmergencyActionSheet";

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

const CivicScore = lazy(() =>
  import("@/components/CivicScore").then((module) => ({ default: module.CivicScore }))
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
      <TodayNearYou />
      <DigestSubscribeBanner />
      <div className="container mx-auto px-4 py-6">
        <StatePreferenceBanner />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mt-4">
          <div>
            <QuickAccessHub />
          </div>
          <div className="space-y-4">
            <Suspense fallback={null}>
              <CivicScore />
            </Suspense>
          </div>
        </div>
      </div>
      <KnowYourRights />
      <Suspense fallback={<div className="py-8 text-center text-muted-foreground text-sm">Loading accountability data…</div>}>
        <OfficerAccountability />
      </Suspense>
      <CommunityCarousel />
      <Suspense fallback={<div className="py-8 text-center text-muted-foreground text-sm">Loading resources…</div>}>
        <ResourceCommandCenter />
      </Suspense>
      <Footer />
      <EmergencyFAB />
    </div>
  );
};

export default Index;
