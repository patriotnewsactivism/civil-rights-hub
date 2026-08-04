import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AttorneyDashboard } from "@/components/AttorneyDashboard";

export default function AttorneyDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AttorneyDashboard />
      </main>
      <Footer />
    </div>
  );
}
