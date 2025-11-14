import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Resources } from "@/components/Resources";
import { SEO } from "@/components/SEO";

const ResourceLibrary = () => {
  return (
    <>
      <SEO
        title="Civil Rights Resources & Educational Materials"
        description="Access comprehensive civil rights resources including legal guides, educational materials, court watch calendars, FOIA templates, federal laws, and state-specific information."
        keywords="civil rights resources, legal guides, FOIA templates, federal laws, state laws, court watch, police scanner, educational materials"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  Civil Rights Resource Library
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Access a comprehensive collection of civil rights resources, legal guides,
                  FOIA templates, court watch calendars, federal and state laws, and educational
                  materials. Everything you need to know and exercise your constitutional rights.
                </p>
              </div>
              <Resources />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ResourceLibrary;
