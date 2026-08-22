import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Scale, FileText, Shield } from "lucide-react";

const Terms = () => (
  <div className="min-h-screen flex flex-col">
    <SEO
      title="Terms of Use | Civil Rights Hub"
      description="Plain-language terms for using Civil Rights Hub tools, research resources, accounts, and submission features."
      canonicalUrl="https://civilrightshub.org/terms"
    />
    <Header />
    <main className="flex-1">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
            <FileText className="h-4 w-4" />
            Terms of use
          </div>
          <h1 className="text-4xl font-black">Use the tools carefully and verify important facts</h1>
          <p className="text-muted-foreground leading-relaxed">
            Effective August 22, 2026. These terms describe the current intended use of Civil Rights Hub. They are written to match the actual product rather than promise features, legal outcomes, or data practices that have not been verified.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Information, not legal advice</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Civil Rights Hub provides general information, research references, documentation tools, public-records tools, and encounter checklists. It is not a law firm and use of the site does not create an attorney-client relationship. Laws and procedures vary by jurisdiction and facts. Verify current authority or consult a licensed attorney for a specific legal matter.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold">Emergency and encounter tools</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Emergency-mode scripts and checklists are general reference material, not guaranteed legal formulas. State and local rules may differ, and the facts of an encounter matter.</p>
              <p>Do not physically interfere with officers, resist an arrest or search, or put yourself or others in danger based on anything displayed by the site. Where immediate emergency assistance is needed, use the emergency services available in your location.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold">User submissions</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>You are responsible for the accuracy and lawfulness of material you submit. Do not knowingly submit false information, impersonate another person, upload material you do not have a right to provide, or use the service to harass, threaten, dox, or unlawfully target someone.</p>
              <p>An incident report is a report or allegation unless supported by adequate source evidence; submission alone does not establish misconduct or wrongdoing. Civil Rights Hub may withhold, label, moderate, correct, or remove material that does not meet publication or provenance standards.</p>
              <p>Do not assume submissions are confidential. Avoid including private identifiers, confidential legal communications, passwords, medical information, or other sensitive material unless you understand the consequences of providing it.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold">Accounts and acceptable use</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Keep account credentials secure and use the service only for lawful purposes. Do not attempt to bypass access controls, disrupt the service, abuse automated endpoints, or interfere with other users.</p>
              <p>Features may be changed, suspended, restricted, or removed when they are unreliable, unsafe, unsupported by source evidence, or unavailable because of third-party service changes.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold">Third-party resources</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Civil Rights Hub links to outside resources such as government sites, legal research sources, scanner services, social platforms, donation providers, and other organizations. A link is not a guarantee of accuracy, availability, endorsement, or a continuing relationship. Third-party services have their own terms and privacy practices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Source code and content</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Civil Rights Hub source repository is publicly viewable on GitHub. Public visibility of source code does not, by itself, grant a software license or permission to reuse code beyond rights provided by applicable law. If a license is added to the repository later, that license will control reuse of the covered code.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold">No guarantee of completeness or availability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Civil Rights Hub is provided as a public-interest resource and may contain incomplete, outdated, unavailable, or temporarily withheld material. The project does not guarantee a particular legal result, uninterrupted service, complete geographic coverage, successful email delivery, or the continued availability of any third-party resource.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-xl font-bold">Questions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Questions about these terms can be sent to{" "}
              <a href="mailto:info@civilrightshub.org" className="text-primary underline underline-offset-2">info@civilrightshub.org</a>.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
    <Footer />
  </div>
);

export default Terms;
