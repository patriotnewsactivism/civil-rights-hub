import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { DonationCTA } from "@/components/DonationCTA";
import { Resources } from "@/components/Resources";

const ResourceLibrary = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Civil Rights Resources Library | Guides, Hotlines & Tools"
        description="Comprehensive civil rights resources — constitutional rights guides, legal protections, government transparency tools, hotlines, and advocacy guides."
        ogTitle="Civil Rights Resources Library"
        ogDescription="Free downloadable guides, hotlines, and tools for constitutional rights, legal protections, and government transparency."
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Civil Rights Resources Library</h1>
            <p className="text-xl text-muted-foreground">
              Access comprehensive resources on constitutional rights, legal protections, government transparency tools, and advocacy guides.
            </p>
          </div>
          <Resources />
        </div>
      </main>
      <DonationCTA variant="banner" />
      <Footer />
    </div>
  );
};

export default ResourceLibrary;
