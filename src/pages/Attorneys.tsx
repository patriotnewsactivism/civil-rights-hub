import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LawyerFinder } from "@/components/LawyerFinder";
import { SEO } from "@/components/SEO";

const Attorneys = () => {
  return (
    <>
      <SEO
        title="Civil Rights Attorney Directory - Find Legal Help"
        description="Search our comprehensive directory of civil rights attorneys, law firms, and legal organizations. Find pro bono lawyers specializing in police misconduct, First Amendment rights, wrongful conviction, and more."
        keywords="civil rights attorneys, police misconduct lawyers, ACLU lawyers, innocence project, pro bono attorneys, constitutional rights lawyers, First Amendment attorneys"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  Civil Rights Attorney Directory
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Find experienced civil rights attorneys and legal organizations across all 50 states.
                  Search by location, practice area, and pro bono availability. From police misconduct
                  to wrongful convictions, connect with lawyers who fight for justice.
                </p>
              </div>
              <LawyerFinder />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Attorneys;
