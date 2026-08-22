import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Shield, AlertCircle, CheckCircle, Video, Scale, ExternalLink } from "lucide-react";

const CONSTITUTION_ANNOTATED = "https://constitution.congress.gov/";

const guideSteps = [
  {
    title: "Before Recording",
    icon: Shield,
    color: "text-blue-500",
    steps: [
      "Use a place where you are lawfully allowed to be; private-property rules and restricted areas can differ from public streets and sidewalks.",
      "Leave enough distance that you do not physically interfere with officers, emergency personnel, evidence, traffic, or other people.",
      "Make sure your device is charged, has storage space, and is configured to preserve an original copy when practical.",
      "If audio recording is important, check current state recording/privacy law rather than relying on a generic one-party/all-party label.",
      "Think about an exit route and your own safety before focusing on the camera.",
    ],
  },
  {
    title: "During Recording",
    icon: Video,
    color: "text-green-500",
    steps: [
      "Record from a lawful vantage point without physically obstructing police, emergency response, or bystanders.",
      "Capture context when safe: location, visible unit numbers, identifying information, and the sequence of events.",
      "Avoid escalating the encounter. You can document without arguing about the law on scene.",
      "If an officer gives a movement, perimeter, traffic, or safety instruction, do not physically resist; whether a particular order is lawful can depend on the facts and governing law.",
      "If you continue recording after moving, do so only from a place where you may lawfully remain and without interference.",
    ],
  },
  {
    title: "Legal Cautions While Recording",
    icon: Scale,
    color: "text-teal-500",
    steps: [
      "The First Amendment can protect recording government officials performing duties in public, but the scope of that right and permissible restrictions can depend on the forum, conduct, and controlling appellate law.",
      "Identification duties vary by state and circumstance. Do not rely on the blanket rule that ID is required—or never required—whenever an officer speaks with you.",
      "Digital-device searches receive strong Fourth Amendment protection, but warrant requirements have recognized exceptions. You can clearly state that you do not consent to a search.",
      "Police may sometimes lawfully seize a device or other property even when you do not consent. Do not physically resist; document the seizure and request a receipt or property record when available.",
      "If questioning becomes custodial or potentially incriminating, the rules governing silence, Miranda, and counsel are fact-specific. A clear request for legal counsel is safer than debating the case on scene.",
      "Ask whether you are free to leave when that is relevant, but do not assume the answer itself resolves every legal issue about the encounter.",
    ],
  },
  {
    title: "After Recording",
    icon: CheckCircle,
    color: "text-emerald-500",
    steps: [
      "Preserve the original recording and make a separate backup before editing, compressing, or posting it.",
      "Write down the time, date, location, names or identifying details, witnesses, and what happened while your memory is fresh.",
      "Keep copies of related citations, property receipts, medical records, public-records responses, messages, and other documents.",
      "If you submit an incident report to Civil Rights Hub, describe what you observed and distinguish your allegation from any later official finding.",
      "Consider legal advice before publishing sensitive footage when privacy, minors, medical information, confidential sources, or pending litigation are involved.",
    ],
  },
  {
    title: "If You Believe Your Rights Were Violated",
    icon: AlertCircle,
    color: "text-red-500",
    steps: [
      "Do not physically resist an arrest, search, seizure, or movement order solely because you believe it is unlawful.",
      "State non-consent clearly when appropriate, then preserve the issue for later review rather than escalating physically.",
      "Record or remember officer names, badge numbers, unit numbers, witnesses, injuries, property taken, and exact statements when you safely can.",
      "If arrested or questioned about suspected criminal conduct, request a lawyer and avoid volunteering an explanation of the case on scene.",
      "Preserve evidence promptly and obtain medical care when needed.",
      "Complaint procedures and civil filing deadlines vary. Verify the current rules for the relevant jurisdiction and claim before relying on a deadline.",
    ],
  },
];

export const IncidentGuide = () => {
  return (
    <section id="incident-guide" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Camera className="h-8 w-8 text-primary" />
              <h2 className="text-4xl font-bold">How to Document Incidents</h2>
            </div>
            <p className="text-muted-foreground text-lg">
              A conservative documentation workflow that prioritizes safety, evidence preservation, and later legal review.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {guideSteps.map((section, idx) => {
              const Icon = section.icon;
              return (
                <AccordionItem key={section.title} value={`item-${idx}`}>
                  <Card className="border-border">
                    <AccordionTrigger className="hover:no-underline px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-6 w-6 ${section.color}`} />
                        <span className="font-semibold text-lg">{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-2">
                        <ul className="space-y-3">
                          {section.steps.map((step, stepIdx) => (
                            <li key={step} className="flex gap-3">
                              <Badge variant="outline" className="mt-1 h-6 w-6 rounded-full p-0 flex items-center justify-center flex-shrink-0">
                                {stepIdx + 1}
                              </Badge>
                              <span className="text-sm leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              );
            })}
          </Accordion>

          <Card className="mt-8 border-amber-500/50 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Safety and legal context first
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                This is documentation guidance, not a promise that a particular police order, search, detention, arrest, or recording restriction is lawful or unlawful. Those questions can turn on facts, state law, and controlling federal appellate precedent.
              </p>
              <p>
                Preserve the evidence and challenge disputed conduct through counsel, complaint procedures, public-records requests, or court rather than physical resistance on scene.
              </p>
              <Button asChild variant="outline">
                <a href={CONSTITUTION_ANNOTATED} target="_blank" rel="noopener noreferrer">
                  Research the Constitution in Congress.gov
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
