import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Scale } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";

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
    const text = `KNOW YOUR RIGHTS: ${amendment}\n\n${content.summary}\n\n${content.details.join('\n')}\n\nThis is general legal information, not legal advice. Consult a qualified attorney for specific guidance.\n\nCivil Rights Hub - Protecting Your Constitutional Rights`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KnowYourRights-${amendment.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
