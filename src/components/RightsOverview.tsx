import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Camera, FileText, Home, Download } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import jsPDF from "jspdf";

export const RightsOverview = () => {
  const { state, loading } = useGeolocation();

  const downloadPDF = (title: string, description: string, details: string[]) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPos = margin;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('KNOW YOUR RIGHTS', margin, yPos);
    yPos += 10;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(59, 130, 246);
    doc.text(title, margin, yPos);
    yPos += 10;

    // Description
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 0, 0);
    const descLines = doc.splitTextToSize(description, maxWidth);
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 7 + 10;

    // Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    details.forEach((detail) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = margin;
      }
      doc.text('•', margin, yPos);
      const detailLines = doc.splitTextToSize(detail, maxWidth - 10);
      doc.text(detailLines, margin + 5, yPos);
      yPos += detailLines.length * 6 + 3;
    });

    yPos += 15;
    if (yPos > 240) {
      doc.addPage();
      yPos = margin;
    }

    // State info
    if (state) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`State: ${state}`, margin, yPos);
      yPos += 7;
    }

    // Disclaimer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    const disclaimer = 'This is general legal information, not legal advice. Consult a qualified attorney for specific guidance.';
    const disclaimerLines = doc.splitTextToSize(disclaimer, maxWidth);
    doc.text(disclaimerLines, margin, yPos);
    yPos += disclaimerLines.length * 5 + 5;

    // Footer
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Civil Rights Hub - Protecting Your Constitutional Rights', margin, yPos);

    doc.save(`KnowYourRights-${title.replace(/\s+/g, '-')}.pdf`);
  };

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
            Know Your Rights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding your rights is the first step to protecting them. Download pocket guides or view details for each constitutional protection.
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
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl">{right.title}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadPDF(right.title, right.description, right.details)}
                        className="gap-1 shrink-0"
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                    </div>
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
