import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PenLine,
  Scale,
  Shield,
  Globe,
  Code,
  Megaphone,
  Clock,
  CheckCircle,
  Mail,
} from "lucide-react";

const ROLES = [
  {
    icon: PenLine,
    title: "Content Contributor",
    description: "Research and draft rights-reference guides, explainers, and source-backed educational material.",
    commitment: "Flexible",
    skills: "Writing, research, source citation",
  },
  {
    icon: Scale,
    title: "Legal Researcher",
    description: "Verify statutes and cases, audit legal summaries, and flag outdated or unsupported claims.",
    commitment: "Flexible",
    skills: "Legal research experience; law students or attorneys especially useful",
  },
  {
    icon: Shield,
    title: "Community Moderator",
    description: "Help review community content, apply published guidelines, and route urgent safety concerns appropriately.",
    commitment: "Flexible",
    skills: "Patience, moderation, de-escalation",
  },
  {
    icon: Globe,
    title: "Translator",
    description: "Translate reviewed public-interest content while preserving legal nuance and source references.",
    commitment: "Project-based",
    skills: "Fluent bilingual or multilingual",
  },
  {
    icon: Code,
    title: "Developer",
    description: "Build features, fix bugs, improve accessibility, and strengthen testing and data-integrity controls.",
    commitment: "Flexible",
    skills: "TypeScript, React, Supabase or related tooling",
  },
  {
    icon: Megaphone,
    title: "Outreach Contributor",
    description: "Help identify credible organizations, public resources, and subject-matter experts for source-backed collaboration.",
    commitment: "Flexible",
    skills: "Communications, research, relationship building",
  },
];

const CONTACT_EMAIL = "info@civilrightshub.org";

const Volunteer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Volunteer | Civil Rights Hub"
        description="Volunteer with Civil Rights Hub as a legal researcher, content contributor, developer, translator, moderator, or outreach contributor."
        ogTitle="Volunteer with Civil Rights Hub"
        ogDescription="Help improve source verification, legal research, public-interest tools, accessibility, and community resources."
        canonicalUrl="https://civilrightshub.org/volunteer"
      />
      <Header />
      <main className="flex-1">
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-16 max-w-3xl text-center space-y-4">
            <h1 className="text-4xl font-black">Contribute to Civil Rights Hub</h1>
            <p className="text-lg text-muted-foreground">
              Help strengthen source verification, legal-reference accuracy, public-records tools, accessibility, and community resources.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8">Ways to help</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROLES.map(({ icon: Icon, title, description, commitment, skills }) => (
              <Card key={title} className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{description}</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {commitment}
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      {skills}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-16 max-w-2xl">
            <Card className="border-primary/25">
              <CardContent className="p-8 text-center space-y-4">
                <Mail className="h-10 w-10 text-primary mx-auto" />
                <div>
                  <h2 className="text-2xl font-bold">Volunteer intake</h2>
                  <p className="text-muted-foreground mt-2">
                    The on-site application form is temporarily disabled until its submission backend is connected and verified. We will not display a false “received” confirmation for information that was never stored or sent.
                  </p>
                </div>
                <Button asChild>
                  <a href={`mailto:${CONTACT_EMAIL}?subject=Civil%20Rights%20Hub%20Volunteer%20Interest`}>
                    Email Volunteer Interest
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Include the role that interests you and any relevant research, legal, technical, language, moderation, or outreach experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Volunteer;
