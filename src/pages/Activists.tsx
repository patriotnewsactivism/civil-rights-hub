import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ActivistDirectory } from "@/components/ActivistDirectory";

const Activists = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">First Amendment Auditors & Civil Rights Activists</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive directory of First Amendment auditors, investigative journalists, and civil rights activists fighting for transparency and accountability.
            </p>
          </div>
          <ActivistDirectory />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Activists;
