import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { KnowYourRights } from "@/components/KnowYourRights";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ATTORNEY_DIRECTORY } from "@/lib/seoData";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";
import { QuickAccessHub } from "@/components/QuickAccessHub";

const ResourceCommandCenter = lazy(() =>
  import("@/components/ResourceCommandCenter").then((module) => ({
    default: module.ResourceCommandCenter
  }))
);

const attorneyNames = ATTORNEY_DIRECTORY.map((entry) => entry.name);
const organizationNames = ATTORNEY_DIRECTORY.map((entry) => entry.organization).filter(
  (organization): organization is string => Boolean(organization)
);

const seoKeywords = [
  "civil rights hub",
  "We The People News attorneys",
  "constitutional rights legal resources",
  "civil rights pro bono network",
  "attorney directory for protest defense",
  "media freedom legal help",
  "FOIA litigation lawyers",
  ...attorneyNames,
  ...organizationNames
].join(", ");

const seoTitle = "Civil Rights Hub | Nationwide Civil Rights Attorneys by We The People News";
const seoDescription =
  "Access every civil rights attorney, legal collective, and We The People News investigation in one searchable hub with pro bono, protest defense, FOIA, and police accountability resources.";

const legalServicesStructuredData = {
  "@context": "https://schema.org",
  "@graph": ATTORNEY_DIRECTORY.map((entry) => {
    const keywords = [...entry.practiceAreas, ...(entry.specialties ?? [])];
    const service: Record<string, unknown> = {
      "@type": "LegalService",
      name: entry.name,
      description: entry.description,
      areaServed: entry.state,
      keywords: keywords.join(", ")
    };

    if (entry.website) {
      service.url = entry.website;
      service.sameAs = entry.website;
    }

    if (entry.phone) {
      service.telephone = entry.phone;
    }

    if (entry.email) {
      service.email = entry.email;
    }

    if (entry.organization) {
      service.parentOrganization = {
        "@type": "Organization",
        name: entry.organization,
        ...(entry.website ? { url: entry.website } : {})
      };
    }

    return service;
  })
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
      <div className="container mx-auto px-4 py-6">
        <StatePreferenceBanner />
        <QuickAccessHub />
      </div>
      <KnowYourRights />
      <Suspense
        fallback={<div className="py-8 text-center text-muted-foreground text-sm">Loading resources...</div>}
      >
        <ResourceCommandCenter />
      </Suspense>
      <Footer />
    </div>
  );
};

export default Index;
