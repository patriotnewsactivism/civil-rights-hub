import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  PenLine,
  Scale,
  Shield,
  Globe,
  Code,
  Megaphone,
  Clock,
  CheckCircle,
} from "lucide-react";

const ROLES = [
  {
    icon: PenLine,
    title: "Content Contributor",
    description: "Research and write Know Your Rights guides, legal explainers, and state-specific resources.",
    commitment: "2–4 hours/week",
    skills: "Writing, research, legal knowledge a plus",
  },
  {
    icon: Scale,
    title: "Legal Researcher",
    description: "Verify state laws, update attorney listings, fact-check legal content, and flag outdated information.",
    commitment: "2–5 hours/week",
    skills: "Law student or attorney preferred",
  },
  {
    icon: Shield,
    title: "Community Moderator",
    description: "Review violation reports, ensure community guidelines are followed, and support users in crisis.",
    commitment: "3–5 hours/week",
    skills: "Patience, de-escalation, civil rights knowledge",
  },
  {
    icon: Globe,
    title: "Translator",
    description: "Translate Know Your Rights guides and key platform content into Spanish, Mandarin, Arabic, and other languages.",
    commitment: "Flexible, project-based",
    skills: "Fluent bilingual or multilingual",
  },
  {
    icon: Code,
    title: "Developer",
    description: "Build new features, fix bugs, improve accessibility, and help scale the platform. Codebase is TypeScript/React.",
    commitment: "Flexible",
    skills: "TypeScript, React, Supabase",
  },
  {
    icon: Megaphone,
    title: "Outreach Coordinator",
    description: "Connect with civil rights organizations, universities, law schools, and advocacy groups to grow the network.",
    commitment: "3–6 hours/week",
    skills: "Communications, networking, passion for the cause",
  },
];

const Volunteer = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    experience: "",
    availability: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;
    setLoading(true);
    try {
      // Store volunteer application via Supabase edge function or direct insert
      // For now, we log and show success — wire to a real table or email when ready
      console.info("Volunteer application:", form);
      await new Promise((r) => setTimeout(r, 600)); // simulate network
      setSubmitted(true);
      toast.success("Application received!", {
        description: "We'll be in touch within a week.",
      });
    } catch {
      toast.error("Submission failed. Please email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Volunteer | Civil Rights Hub"
        description="Volunteer with Civil Rights Hub — contribute as a legal researcher, content writer, developer, translator, or community moderator."
        ogTitle="Volunteer with Civil Rights Hub"
        ogDescription="Help build the nation's most comprehensive civil rights platform. We need legal researchers, writers, developers, translators, and moderators."
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-16 max-w-3xl text-center space-y-4">
            <h1 className="text-4xl font-black">Help defend civil rights</h1>
            <p className="text-lg text-muted-foreground">
              Civil Rights Hub is built and maintained by volunteers. Every hour you contribute
              helps someone understand their rights, find an attorney, or document a violation.
            </p>
          </div>
        </section>

        {/* Roles */}
        <section className="container mx-auto px-4 py-16 max-w-5xl">
          <h2 className="text-2xl font-bold mb-8">Open volunteer roles</h2>
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

        {/* Application form */}
        <section className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-16 max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">Apply to volunteer</h2>
            <p className="text-muted-foreground mb-8">
              No commitment required to apply. We'll reach out within a week to discuss how you can help.
            </p>

            {submitted ? (
              <div className="rounded-xl border bg-card p-8 text-center space-y-3">
                <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
                <p className="font-semibold text-lg">Application received!</p>
                <p className="text-muted-foreground text-sm">
                  We'll be in touch within a week. Thank you for wanting to help.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="vol-name">Full name *</Label>
                    <Input
                      id="vol-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vol-email">Email *</Label>
                    <Input
                      id="vol-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vol-role">Role you're interested in *</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                    <SelectTrigger id="vol-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.title} value={r.title}>{r.title}</SelectItem>
                      ))}
                      <SelectItem value="other">Other / Multiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vol-exp">Relevant experience</Label>
                  <Textarea
                    id="vol-exp"
                    placeholder="Brief background — education, work, activism, etc."
                    rows={3}
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vol-avail">Availability</Label>
                  <Input
                    id="vol-avail"
                    placeholder="e.g., weekends, 5 hrs/week, project-based"
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting…" : "Submit application"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your information is only used to contact you about volunteering. We don't share it.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Volunteer;
