import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { KnowYourRights } from "@/components/KnowYourRights";
import { IncidentGuide } from "@/components/IncidentGuide";
import { ViolationReport } from "@/components/ViolationReport";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { AttorneySeoContent } from "@/components/AttorneySeoContent";
import { SectionQuickNav, type SectionNavItem } from "@/components/SectionQuickNav";
import { ATTORNEY_DIRECTORY } from "@/lib/seoData";
import { FeaturedNews } from "@/components/FeaturedNews";
import { ResourceCommandCenter } from "@/components/ResourceCommandCenter";
import { SocialSpotlight } from "@/components/SocialSpotlight";
import { MonetizationShowcase } from "@/components/MonetizationShowcase";

const attorneyNames = ATTORNEY_DIRECTORY.map((entry) => entry.name);
const organizationNames = ATTORNEY_DIRECTORY.map((entry) => entry.organization).filter(
  (organization): organization is string => Boolean(organization)
);

const SECTION_NAV_ITEMS: SectionNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "rights", label: "Know Your Rights" },
  { id: "incident-guide", label: "Incident Guide" },
  { id: "report-violation", label: "Report a Violation" },
  { id: "news", label: "News Desk" },
  { id: "resource-command", label: "Resource Command" },
  { id: "social", label: "Social Desk" },
  { id: "monetization", label: "Partner Boosts" },
  { id: "footer", label: "Footer" }
];

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
      <SectionQuickNav sections={SECTION_NAV_ITEMS} />
      <Hero />
      <FeaturedNews />
      <ResourceCommandCenter />
      <KnowYourRights />
      <ViolationReport />
      <IncidentGuide />
      <SocialSpotlight />
      <MonetizationShowcase />
      <AttorneySeoContent />
      <Footer />
    </div>
  );
};

export default Index;
