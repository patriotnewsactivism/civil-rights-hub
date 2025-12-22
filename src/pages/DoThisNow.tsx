import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IncidentGuide } from "@/components/IncidentGuide";
import { SEO } from "@/components/SEO";

const seoTitle = "Do This Now | Civil Rights Hub";
const seoDescription =
  "Rapid response playbooks with 30-second scripts, do/don't checklists, and emergency guidance.";

export default function DoThisNow() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalUrl="https://civilrightshub.org/do-this-now"
        ogTitle={seoTitle}
        ogDescription={seoDescription}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Do this now</p>
          <h1 className="text-4xl font-bold leading-tight">Scenario playbooks for urgent situations</h1>
          <p className="text-muted-foreground">
            Copy-ready scripts, checklists, and safety steps for stops, searches, filming police, and protest encounters.
            Keep these handy and share them with your team before heading into the field.
          </p>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            Stay calm, stay safe, and remember that these scripts are informational only. If you are in danger or need
            legal advice, contact a licensed attorney or emergency hotline immediately.
          </div>
        </div>
        <IncidentGuide />
      </main>
      <Footer />
    </div>
  );
}
