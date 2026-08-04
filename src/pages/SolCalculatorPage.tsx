import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SolCalculator } from "@/components/SolCalculator";

export default function SolCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SolCalculator />
      </main>
      <Footer />
    </div>
  );
}
