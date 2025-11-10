import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mic, Camera, FileText, Home } from "lucide-react";

export const RightsOverview = () => {
  const rights = [
    {
      icon: Mic,
      title: "First Amendment Rights",
      description: "Freedom of religion, speech, press, assembly, and petition",
      details: [
        "Freedom of religion protects your right to practice any faith or no religion",
        "Your speech is protected unless it incites immediate lawless action",
        "The press has the right to gather and report news",
        "Freedom of peaceful protest and assembly is protected",
        "You have the right to petition the government for redress of grievances"
      ]
    },
    {
      icon: Camera,
      title: "Recording Rights",
      description: "Your right to record in public spaces",
      details: [
        "Recording police officers performing their duties in public is constitutionally protected",
        "You can record from a safe distance that doesn't interfere with police work",
        "State laws vary on recording private conversations (one-party vs. two-party consent)",
        "No reasonable expectation of privacy exists in public spaces"
      ]
    },
    {
      icon: FileText,
      title: "Fifth Amendment Rights",
      description: "Protection against self-incrimination",
      details: [
        "You have the right to remain silent during police questioning",
        "You cannot be forced to testify against yourself",
        "Clearly invoke your right: 'I am exercising my right to remain silent'",
        "Request an attorney if questioned: 'I want to speak to a lawyer'"
      ]
    },
    {
      icon: Home,
      title: "Fourth Amendment Rights",
      description: "Protection from unreasonable searches",
      details: [
        "Police need a warrant or probable cause to search your property",
        "You can refuse consent to searches without a warrant",
        "State clearly: 'I do not consent to this search'",
        "Certain exceptions exist (plain view, exigent circumstances)"
      ]
    }
  ];

  return (
    <section id="rights" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Constitutional Rights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding your rights is the first step to protecting them. Here are the key constitutional
            protections every citizen should know.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {rights.map((right, index) => (
            <Card key={index} className="border-border shadow-soft hover:shadow-strong transition-all duration-300">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <right.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">{right.title}</CardTitle>
                    <CardDescription className="text-base">{right.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="details" className="border-none">
                    <AccordionTrigger className="text-primary hover:text-primary/80 py-2">
                      View Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 mt-2">
                        {right.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
