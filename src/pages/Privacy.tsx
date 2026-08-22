import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Database, MapPin, Shield, Mail } from "lucide-react";

const Privacy = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Privacy Notice | Civil Rights Hub"
      description="Privacy notice describing the current observable data flows in Civil Rights Hub."
      canonicalUrl="https://civilrightshub.org/privacy"
    />
    <Header />
    <main className="flex-1">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
            <Shield className="h-4 w-4" />
            Privacy notice
          </div>
          <h1 className="text-4xl font-black">What the current app collects and uses</h1>
          <p className="text-muted-foreground leading-relaxed">
            Effective August 22, 2026. This notice describes data flows that are visible in the current Civil Rights Hub application and public source repository. It intentionally does not promise retention periods, deletion workflows, security guarantees, or data practices that have not been independently verified.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Information you provide</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p><strong className="text-foreground">Accounts:</strong> account creation uses Supabase Auth and may include your email address, password, and optional display name. Authentication data is processed through Supabase.</p>
              <p><strong className="text-foreground">Digest signup:</strong> the public digest form currently stores an email address and, if supplied, a U.S. state and topic preferences in the site database as an unconfirmed signup record.</p>
              <p><strong className="text-foreground">Incident reports:</strong> report forms may store a title, description, state, city, submission time, account identifier, and—when location permission is available—latitude and longitude.</p>
              <p><strong className="text-foreground">Other tools:</strong> community, public-records, and account features may store information you deliberately submit to the application. Do not enter information you are not comfortable providing to the service.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Location data</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Location-aware features can use browser geolocation, when you grant permission, to estimate a U.S. state and city. Coordinates may be sent to OpenStreetMap/Nominatim for reverse geocoding.</p>
              <p>The jurisdiction selector can also use IP-based location services, including ipapi.co and ip-api.com, to suggest a U.S. state or city. A manually selected jurisdiction and city can be stored in your browser's local storage.</p>
              <p>Some incident-reporting flows can attach the device coordinates available to the app at submission time. Review report contents carefully before submitting.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold">Infrastructure and third parties</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Civil Rights Hub currently uses Supabase for application data/authentication and includes Vercel Analytics in the web application. Location features can contact OpenStreetMap/Nominatim, ipapi.co, and ip-api.com. External resource, donation, scanner, social, and research links may take you to other services with their own privacy practices.</p>
              <p>Email-delivery code exists for a separate digest workflow and can use Resend when configured. The public digest-signup path and that delivery path are not currently represented as a verified end-to-end production flow.</p>
              <p>Because these providers process requests needed to operate features, Civil Rights Hub does not make a blanket representation that user data is never processed by third-party infrastructure.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold">Reports, publication, and confidentiality</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Incident and community submissions are not privileged communications and do not create an attorney-client, journalist-source, or other confidential relationship merely by being submitted through the site.</p>
              <p>Public attorney, activist, incident, and accountability datasets are currently withheld while legacy records are being re-verified. A submitted report does not establish that misconduct occurred and may remain unverified unless supported by adequate source evidence.</p>
              <p>Avoid submitting private identifiers, medical information, passwords, confidential legal communications, or other sensitive information unless a feature specifically requires it and you understand how it will be used.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold">Retention, deletion, and security</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The current public source does not establish a single verified retention schedule, automatic deletion workflow, or universal account-data export/deletion process for every table and feature. Civil Rights Hub therefore does not publish a fixed retention promise here. No internet service can guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Questions or correction requests</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For privacy questions, data-correction requests, or concerns about information displayed by Civil Rights Hub, contact{" "}
              <a href="mailto:info@civilrightshub.org" className="text-primary underline underline-offset-2">info@civilrightshub.org</a>.
              A request does not imply a particular response deadline or deletion capability unless and until that workflow is verified.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
    <Footer />
  </div>
);

export default Privacy;
