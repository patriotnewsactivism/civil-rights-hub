import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Resources } from "@/components/Resources";

const ResourceLibrary = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
      <Footer />
    </div>
  );
};

export default ResourceLibrary;
