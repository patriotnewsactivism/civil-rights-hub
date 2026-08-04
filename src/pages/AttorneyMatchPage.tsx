import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AttorneyMatch } from "@/components/AttorneyMatch";

export default function AttorneyMatchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AttorneyMatch />
      </main>
      <Footer />
    </div>
  );
}
