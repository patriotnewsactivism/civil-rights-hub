import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Scale } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import jsPDF from "jspdf";

const rightsData = {
  "First Amendment": {
    summary: "Freedom of speech, press, assembly, and petition",
    details: [
      "You have the right to photograph/record in public spaces",
      "You can document police activity from a safe distance",
      "You can protest peacefully without a permit in most cases",
      "Media credentials are NOT required to act as press"
    ]
  },
  "Fourth Amendment": {
    summary: "Protection against unreasonable searches and seizures",
    details: [
      "Police need probable cause or a warrant to search you",
      "You can refuse consent to searches",
      "You have privacy rights in your phone and digital devices",
      "Stop and frisk requires reasonable suspicion"
    ]
  },
  "Fifth Amendment": {
    summary: "Right to remain silent and due process",
    details: [
      "You can remain silent during police questioning",
      "You cannot be compelled to incriminate yourself",
      "Clearly state: 'I am invoking my right to remain silent'",
      "Ask for a lawyer immediately if arrested"
    ]
  },
  "Recording Rights": {
    summary: "Your right to record police and public officials",
    details: [
      "Recording police in public is constitutionally protected",
      "Officers cannot demand you stop recording",
      "Officers cannot confiscate or delete your recordings",
      "You can record from any public space with clear view"
    ]
  }
};

export const KnowYourRights = () => {
  const { state, loading } = useGeolocation();

  const downloadPDF = (amendment: string) => {
    const content = rightsData[amendment as keyof typeof rightsData];

    // Create new PDF document
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

    // Amendment Title
    doc.setFontSize(18);
    doc.setTextColor(59, 130, 246); // Primary color
    doc.text(amendment, margin, yPos);
    yPos += 10;

    // Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(0, 0, 0);
    const summaryLines = doc.splitTextToSize(content.summary, maxWidth);
    doc.text(summaryLines, margin, yPos);
    yPos += summaryLines.length * 7 + 10;

    // Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    content.details.forEach((detail, idx) => {
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = margin;
      }

      // Bullet point
      doc.text('•', margin, yPos);

      // Detail text with wrapping
      const detailLines = doc.splitTextToSize(detail, maxWidth - 10);
      doc.text(detailLines, margin + 5, yPos);
      yPos += detailLines.length * 6 + 3;
    });

    // Add some spacing before footer
    yPos += 15;
    if (yPos > 240) {
      doc.addPage();
      yPos = margin;
    }

    // State-specific note
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
    const disclaimerText = 'This is general legal information, not legal advice. Consult a qualified attorney for specific guidance.';
    const disclaimerLines = doc.splitTextToSize(disclaimerText, maxWidth);
    doc.text(disclaimerLines, margin, yPos);
    yPos += disclaimerLines.length * 5 + 5;

    // Footer
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('Act Now Hub - Protecting Your Constitutional Rights', margin, yPos);

    // Save the PDF
    doc.save(`KnowYourRights-${amendment.replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <section id="know-your-rights" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Scale className="h-8 w-8 text-primary" />
              <h2 className="text-4xl font-bold">Know Your Rights</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Download pocket guides for your constitutional rights. Always available, always free.
            </p>
            {!loading && state && (
              <Badge variant="outline" className="mt-4">
                <FileText className="h-4 w-4 mr-2" />
                Showing rights for: {state}
              </Badge>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(rightsData).map(([amendment, content]) => (
              <Card key={amendment} className="border-border hover:shadow-strong transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{amendment}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPDF(amendment)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </CardTitle>
                  <CardDescription>{content.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {content.details.map((detail, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 border-amber-500/50 bg-amber-500/5">
            <CardContent className="pt-6">
              <p className="text-sm text-center">
                <strong>Important:</strong> This is general legal information, not legal advice. 
                Laws vary by state and situation. Always consult with a qualified attorney for specific legal guidance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
