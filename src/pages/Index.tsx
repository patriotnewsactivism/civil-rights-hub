import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { HomeCommandHero } from "@/components/HomeCommandHero";
import { KnowYourRights } from "@/components/KnowYourRights";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { StatePreferenceBanner } from "@/components/StatePreferenceBanner";
import { DonationBanner } from "@/components/DonationBanner";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";
import { EmergencyFAB } from "@/components/EmergencyActionSheet";
import { Skeleton } from "@/components/ui/skeleton";
import { VerifiedDataHold } from "@/components/VerifiedDataHold";

const CrisisHUD = lazy(() =>
  import("@/components/CrisisHUD").then((module) => ({ default: module.CrisisHUD }))
);

const ResourceCommandCenter = lazy(() =>
  import("@/components/ResourceCommandCenter").then((module) => ({
    default: module.ResourceCommandCenter,
  }))
);

const seoKeywords = [
  "civil rights hub",
  "constitutional rights references",
  "incident documentation",
  "FOIA request tools",
  "public records",
  "legal research",
  "police scanner resources",
  "government transparency",
  "civil liberties",
].join(", ");

const seoTitle = "Civil Rights Hub | Rights · Records · Research · Response";
const seoDescription =
  "Civil Rights Hub is a public-interest toolkit for rights references, emergency encounter tools, incident documentation, FOIA and public-records work, legal research, scanner resources, and community collaboration. Legacy attorney and accountability datasets are being re-verified against source evidence.";

const LoadingCards = () => (
  <div className="container mx-auto px-4 py-10 space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  </div>
);

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
      />
      <Header />
      <HomeCommandHero />

      <main>
        <div className="container mx-auto px-4 py-6 space-y-4">
          <StatePreferenceBanner />
          <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
            <CrisisHUD />
          </Suspense>
        </div>

        <KnowYourRights />

        <div className="container mx-auto px-4 py-6">
          <VerifiedDataHold />
        </div>

        <Suspense fallback={<LoadingCards />}>
          <ResourceCommandCenter />
        </Suspense>

        <div className="container mx-auto max-w-2xl px-4 py-8">
          <NewsletterSubscribe variant="compact" />
        </div>
        <DonationBanner />
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
};

export default Index;
