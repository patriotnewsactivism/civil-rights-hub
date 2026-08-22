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
  "constitutional rights resources",
  "report civil rights violations",
  "know your rights",
  "FOIA request tools",
  "police accountability resources",
  "public records",
  "civil liberties",
].join(", ");

const seoTitle = "Civil Rights Hub | Know Your Rights · Document · Take Action";
const seoDescription =
  "Civil Rights Hub provides Know Your Rights guides, emergency encounter tools, FOIA resources, scanner links, incident reporting, and civil-rights research tools. Public attorney and accountability datasets are being re-verified against source evidence.";

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
