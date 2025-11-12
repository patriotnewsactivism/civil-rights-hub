import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { KnowYourRights } from "@/components/KnowYourRights";
import { IncidentGuide } from "@/components/IncidentGuide";
import { ViolationReport } from "@/components/ViolationReport";
import { ViolationFeed } from "@/components/ViolationFeed";
import { StateSelector } from "@/components/StateSelector";
import { InteractiveMap } from "@/components/InteractiveMap";
import { CaseSearch } from "@/components/CaseSearch";
import { AITools } from "@/components/AITools";
import { PoliceScanner } from "@/components/PoliceScanner";
import { LawyerFinder } from "@/components/LawyerFinder";
import { FOIABuilder } from "@/components/FOIABuilder";
import { FOIATracker } from "@/components/FOIATracker";
import { ActivistDirectory } from "@/components/ActivistDirectory";
import { OfficerAccountability } from "@/components/OfficerAccountability";
import { LegislativeActionCenter } from "@/components/LegislativeActionCenter";
import { Resources } from "@/components/Resources";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { AttorneySeoContent } from "@/components/AttorneySeoContent";
import { ATTORNEY_DIRECTORY } from "@/lib/seoData";

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
  const [selectedState, setSelectedState] = useState("");

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    const element = document.getElementById('states');
    element?.scrollIntoView({ behavior: "smooth" });
  };

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
      <KnowYourRights />
      <IncidentGuide />
      <ViolationReport />
      <ViolationFeed />
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <InteractiveMap onStateSelect={handleStateSelect} />
          </div>
        </div>
      </section>
      <StateSelector selectedState={selectedState} onStateChange={setSelectedState} />
      <PoliceScanner />
      <LawyerFinder />
      <AttorneySeoContent />
      <ActivistDirectory />
      <OfficerAccountability />
      <FOIABuilder />
      <FOIATracker />
      <LegislativeActionCenter />
      <CaseSearch />
      <AITools />
      <Resources />
      <Footer />
    </div>
  );
};

export default Index;
