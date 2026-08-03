import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StateComparison } from "@/components/StateComparison";

export default function StateComparisonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <StateComparison />
      </main>
      <Footer />
    </div>
  );
}
