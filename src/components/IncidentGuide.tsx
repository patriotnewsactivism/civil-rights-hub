import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Camera, Shield, AlertCircle, CheckCircle, Video, Scale } from "lucide-react";

const guideSteps = [
  {
    title: "Before Recording",
    icon: Shield,
    color: "text-blue-500",
    steps: [
      "Know your state's recording laws (one-party vs two-party consent)",
      "Ensure you're in a public space or have permission to be there",
      "Position yourself at a safe distance (generally 10-15 feet minimum)",
      "Make sure your device is charged and has storage space",
      "Turn off flash to avoid being seen as aggressive or interfering"
    ]
  },
  {
    title: "During Recording",
    icon: Video,
    color: "text-green-500",
    steps: [
      "Hold your phone/camera steady and at a safe distance",
      "Record continuously - don't stop and start",
      "Capture the full scene, including badge numbers and patrol car numbers",
      "Narrate key details: location, time, officers present, what's happening",
      "Do NOT interfere with police activity or cross police lines",
      "Remain calm and silent, or clearly state you're exercising your First Amendment rights",
      "If asked to move, comply but continue recording from the new location"
    ]
  },
  {
    title: "Your Rights While Recording",
    icon: Scale,
    color: "text-purple-500",
    steps: [
      "Officers cannot order you to stop recording in public",
      "You don't need to show ID unless you're being detained",
      "Police cannot search your phone without a warrant",
      "Officers cannot delete your footage or demand you hand over your device",
      "You can refuse to answer questions - invoke your Fifth Amendment right",
      "If threatened with arrest, ask 'Am I free to leave?' and 'What crime am I suspected of?'"
    ]
  },
  {
    title: "After Recording",
    icon: CheckCircle,
    color: "text-emerald-500",
    steps: [
      "Immediately back up the footage to cloud storage (Google Drive, iCloud, Dropbox)",
      "Do NOT post on social media until you've made secure backups",
      "Note the exact time, date, and location of the incident",
      "Write down names and contact info of witnesses",
      "If you witnessed a violation, report it through this platform",
      "Contact civil rights organizations (ACLU, NLG) if serious violations occurred",
      "Consider consulting an attorney before sharing footage publicly"
    ]
  },
  {
    title: "If Your Rights Are Violated",
    icon: AlertCircle,
    color: "text-red-500",
    steps: [
      "Do NOT physically resist - state clearly that you do not consent",
      "Remember or record officer names, badge numbers, and patrol car numbers",
      "Request a supervising officer immediately",
      "Say clearly: 'I do not consent to this search/seizure. I am invoking my rights.'",
      "If arrested, invoke your right to remain silent and request a lawyer",
      "Document everything as soon as safe: injuries, witnesses, what was said",
      "File a complaint with the department's internal affairs division",
      "Contact ACLU, National Lawyers Guild, or local civil rights attorneys"
    ]
  }
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
              Step-by-step guide to legally and safely recording police interactions
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {guideSteps.map((section, idx) => {
              const Icon = section.icon;
              return (
                <AccordionItem key={idx} value={`item-${idx}`}>
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
                            <li key={stepIdx} className="flex gap-3">
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
                Safety First
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Your safety is paramount.</strong> Never put yourself in danger to get footage. 
                Maintain a safe distance and comply if officers order you to move back.
              </p>
              <p>
                If you feel threatened or unsafe, leave the area and report what you witnessed later. 
                No recording is worth risking your life.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
