import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LawyerFinder } from "@/components/LawyerFinder";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { Resources } from "@/components/Resources";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const seoTitle = "Get Help | Civil Rights Hub";
const seoDescription = "Find attorneys, legal aid, and emergency contacts with clear next steps.";

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonicalUrl="https://civilrightshub.org/help"
        ogTitle={seoTitle}
        ogDescription={seoDescription}
      />
      <Header />
      <main className="container mx-auto px-4 py-10 space-y-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Get help</p>
          <h1 className="text-4xl font-bold leading-tight">Legal help and emergency support</h1>
          <p className="text-muted-foreground">
            Search the attorney directory, contact legal aid partners, and keep critical hotlines close. Use anonymous
            contact options when submitting violation reports if you need privacy.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attorney directory</CardTitle>
            <CardDescription>Filter by practice area, state, and specialty to request support.</CardDescription>
          </CardHeader>
          <CardContent>
            <LawyerFinder />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency contacts</CardTitle>
            <CardDescription>Hotlines and rapid-response resources for urgent situations.</CardDescription>
          </CardHeader>
          <CardContent>
            <EmergencyContacts />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource library</CardTitle>
            <CardDescription>Legal aid organizations, templates, and accountability partners.</CardDescription>
          </CardHeader>
          <CardContent>
            <Resources />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
