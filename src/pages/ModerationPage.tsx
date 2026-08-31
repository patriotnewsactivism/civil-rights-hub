import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ModeratorDashboard } from "@/components/ModeratorDashboard";
import { SEO } from "@/components/SEO";

export default function ModerationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Moderation | Civil Rights Hub"
        description="Restricted Civil Rights Hub moderation and private incident review console."
        canonicalUrl="https://civilrightshub.org/moderation"
        ogUrl="https://civilrightshub.org/moderation"
      />
      <main className="container mx-auto px-4 py-8">
        <ModeratorDashboard />
      </main>
      <Footer />
    </div>
  );
}
