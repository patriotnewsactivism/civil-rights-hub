import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { DonationCTA } from "@/components/DonationCTA";
import { LawyerFinder } from "@/components/LawyerFinder";

const Attorneys = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Civil Rights Attorney Directory | Find Pro Bono Lawyers"
        description="Search 1,700+ civil rights attorneys by state and specialty. Find pro bono lawyers for police misconduct, First Amendment, wrongful arrest, FOIA, and more."
        ogTitle="Civil Rights Attorney Directory"
        ogDescription="Find experienced civil rights attorneys near you — searchable by state, specialty, and pro bono status."
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Civil Rights Attorney Directory</h1>
            <p className="text-xl text-muted-foreground">
              Find experienced civil rights attorneys, legal aid organizations, and ACLU chapters in your state ready to help defend your constitutional rights.
            </p>
          </div>
          <LawyerFinder />
        </div>
      </main>
      <DonationCTA variant="banner" />
      <Footer />
    </div>
  );
};

export default Attorneys;
