import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Shield,
  Phone,
  Copy,
  Printer,
  Download,
  AlertTriangle,
  Scale,
  Camera,
  HandMetal,
  Lock,
  Mic,
  Users,
} from "lucide-react";
import jsPDF from "jspdf";

const RIGHTS_QUICK_REF = [
  {
    icon: Mic,
    right: "Right to Remain Silent",
    say: "I am exercising my right to remain silent.",
    note: "5th Amendment — you never have to answer police questions",
  },
  {
    icon: Scale,
    right: "Right to an Attorney",
    say: "I want to speak to a lawyer before answering any questions.",
    note: "6th Amendment — interrogation must stop once invoked",
  },
  {
    icon: Lock,
    right: "Right to Refuse Searches",
    say: "I do not consent to a search.",
    note: "4th Amendment — say it clearly, even if they search anyway",
  },
  {
    icon: Camera,
    right: "Right to Record Police",
    say: "I am exercising my First Amendment right to record in a public place.",
    note: "1st Amendment — Glik v. Cunniffe (2011) established this right",
  },
  {
    icon: HandMetal,
    right: "Right to Peacefully Protest",
    say: "I am engaged in a peaceful, lawful demonstration.",
    note: "1st Amendment — cannot be arrested for exercising assembly rights",
  },
  {
    icon: Users,
    right: "Right to Know Why You're Detained",
    say: "Am I being detained? If so, what is your reasonable suspicion?",
    note: "4th Amendment — officers must articulate specific facts",
  },
];

const EMERGENCY_NUMBERS = [
  { name: "ACLU Emergency", number: "1-212-549-2500", note: "National hotline" },
  { name: "National Lawyers Guild", number: "1-212-679-5100", note: "Legal observer support" },
  { name: "DOJ Civil Rights", number: "1-202-514-4609", note: "Report federal violations" },
  { name: "FBI Civil Rights", number: "1-800-CALL-FBI", note: "Report hate crimes" },
];

export const EmergencyRightsCard = () => {
  const [expanded, setExpanded] = useState(false);

  const copyAll = () => {
    const text = RIGHTS_QUICK_REF.map(
      (r) => `${r.right}: "${r.say}"`
    ).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("All rights scripts copied");
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: [85.6, 200] }); // Credit card width

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 85.6, 200, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("KNOW YOUR RIGHTS", 42.8, 10, { align: "center" });
    doc.text("POCKET CARD", 42.8, 16, { align: "center" });

    doc.setDrawColor(59, 130, 246);
    doc.line(10, 19, 75.6, 19);

    doc.setFontSize(6);
    let y = 26;
    RIGHTS_QUICK_REF.forEach((r) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(96, 165, 250);
      doc.text(r.right.toUpperCase(), 5, y);
      y += 4;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(255, 255, 255);
      const sayLines = doc.splitTextToSize(`SAY: "${r.say}"`, 75);
      doc.text(sayLines, 5, y);
      y += sayLines.length * 3.5 + 2;
      doc.setTextColor(148, 163, 184);
      doc.text(r.note, 5, y);
      y += 6;
    });

    doc.setDrawColor(59, 130, 246);
    doc.line(10, y, 75.6, y);
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(239, 68, 68);
    doc.text("EMERGENCY CONTACTS", 5, y);
    y += 5;
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    EMERGENCY_NUMBERS.forEach((n) => {
      doc.text(`${n.name}: ${n.number}`, 5, y);
      y += 3.5;
    });

    y += 3;
    doc.setFontSize(4.5);
    doc.setTextColor(100, 116, 139);
    doc.text("CivilRightsHub.org — For educational purposes only.", 42.8, y, { align: "center" });
    doc.text("Not a substitute for legal advice.", 42.8, y + 3, { align: "center" });

    doc.save("rights-pocket-card.pdf");
    toast.success("Pocket card downloaded");
  };

  const handlePrint = () => {
    const printContent = document.getElementById("rights-card-print");
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Know Your Rights Pocket Card</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0f172a; color: white; padding: 20px; max-width: 400px; margin: auto; }
            .right-item { margin-bottom: 12px; }
            .right-title { color: #60a5fa; font-weight: bold; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
            .right-say { font-size: 12px; margin: 4px 0; }
            .right-note { color: #94a3b8; font-size: 10px; }
            .emergency { color: #ef4444; font-weight: bold; font-size: 12px; margin-top: 16px; }
            .contact { font-size: 11px; margin: 4px 0; }
            hr { border-color: #3b82f6; margin: 12px 0; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <h2 style="text-align:center; margin-bottom: 4px;">KNOW YOUR RIGHTS</h2>
          <p style="text-align:center; color: #94a3b8; font-size: 11px;">CivilRightsHub.org Pocket Card</p>
          <hr/>
          ${RIGHTS_QUICK_REF.map(r => `
            <div class="right-item">
              <div class="right-title">${r.right}</div>
              <div class="right-say">SAY: "${r.say}"</div>
              <div class="right-note">${r.note}</div>
            </div>
          `).join("")}
          <hr/>
          <div class="emergency">EMERGENCY CONTACTS</div>
          ${EMERGENCY_NUMBERS.map(n => `<div class="contact">${n.name}: ${n.number}</div>`).join("")}
          <hr/>
          <p style="font-size: 9px; color: #64748b; text-align: center;">Educational purposes only. Not legal advice.</p>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Emergency Rights Card</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Screenshot, print, or save — know exactly what to say in any encounter
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={copyAll}>
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copy All
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-3.5 w-3.5 mr-1.5" />
                Print
              </Button>
              <Button size="sm" onClick={downloadPDF}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Pocket Card PDF
              </Button>
            </div>
          </div>

          {/* Rights Cards */}
          <div id="rights-card-print" className="space-y-3">
            {RIGHTS_QUICK_REF.slice(0, expanded ? undefined : 4).map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.right}
                  className="border-border/50 bg-gradient-to-r from-background to-primary/[0.02] hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-sm">{item.right}</h3>
                        </div>
                        <div className="rounded-md bg-muted/50 border border-border/50 px-3 py-2 mb-2">
                          <p className="text-sm font-medium text-foreground">
                            <span className="text-muted-foreground mr-1">SAY:</span>
                            &ldquo;{item.say}&rdquo;
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(item.say);
                          toast.success(`Copied: ${item.right}`);
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {!expanded && RIGHTS_QUICK_REF.length > 4 && (
              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setExpanded(true)}
              >
                Show {RIGHTS_QUICK_REF.length - 4} more rights →
              </Button>
            )}
          </div>

          {/* Emergency Numbers */}
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="font-bold text-sm text-red-400">Emergency Contacts</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EMERGENCY_NUMBERS.map((contact) => (
                <div
                  key={contact.name}
                  className="flex items-center justify-between gap-2 rounded-lg bg-background/50 border border-border/30 px-3 py-2"
                >
                  <div>
                    <p className="text-xs font-semibold">{contact.name}</p>
                    <p className="text-[10px] text-muted-foreground">{contact.note}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 shrink-0"
                    asChild
                  >
                    <a href={`tel:${contact.number.replace(/[^0-9+]/g, "")}`}>
                      <Phone className="h-3 w-3" />
                      {contact.number}
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            This card is for educational purposes only and does not constitute legal advice. 
            Laws vary by jurisdiction — consult an attorney for specific situations.
          </p>
        </div>
      </div>
    </section>
  );
};
