import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AttorneyPremium } from "@/components/AttorneyPremium";

export default function AttorneyPremiumPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AttorneyPremium />
      </main>
      <Footer />
    </div>
  );
}
