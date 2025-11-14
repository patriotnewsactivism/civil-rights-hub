import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ActivistDirectory } from "@/components/ActivistDirectory";
import { SEO } from "@/components/SEO";

const Activists = () => {
  return (
    <>
      <SEO
        title="First Amendment Auditors & Civil Rights Activists Directory"
        description="Comprehensive directory of First Amendment auditors, civil rights activists, and organizers fighting for justice and constitutional rights across America."
        keywords="first amendment auditors, civil rights activists, BLM organizers, police accountability activists, constitutional rights advocates, transparency activists"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  First Amendment Auditors & Civil Rights Activists
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Connect with First Amendment auditors documenting government accountability
                  and civil rights activists fighting for justice across America. Find activists
                  by location, platform, and areas of focus.
                </p>
              </div>
              <ActivistDirectory />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Activists;
