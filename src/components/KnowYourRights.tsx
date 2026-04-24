import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Download, Scale, AlertCircle, Shield, HelpCircle, ChevronRight } from "lucide-react";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION } from "@/data/usStates";
import jsPDF from "jspdf";

const rightsData: Record<string, { summary: string; color: string; details: string[] }> = {
  "First Amendment": {
    summary: "Freedom of speech, press, religion, assembly & petition",
    color: "from-blue-600 to-blue-800",
    details: [
      "You have the right to freedom of speech — express opinions without government censorship.",
      "Freedom of the press — gather and report news without credentials in most public spaces.",
      "Right to peacefully assemble and protest. Permits may be required for large gatherings.",
      "Right to petition the government for redress of grievances.",
      "You can record police officers performing their duties in public spaces.",
      "Congress shall make no law abridging freedom of religion — free exercise protected.",
    ],
  },
  "Second Amendment": {
    summary: "Right to keep and bear arms",
    color: "from-green-700 to-green-900",
    details: [
      "The right to keep and bear arms shall not be infringed.",
      "States can regulate firearm possession and carrying to varying degrees.",
      "Concealed carry permits may be required depending on your state.",
      "Always inform police officers if you are legally carrying a firearm.",
      "Federal law prohibits certain individuals from possessing firearms.",
      "Know your local laws — carry laws vary significantly by state.",
    ],
  },
  "Fourth Amendment": {
    summary: "Protection against unreasonable searches & seizures",
    color: "from-red-600 to-red-800",
    details: [
      "Police generally need probable cause and a warrant to search you, your home, or vehicle.",
      "You have the right to refuse consent to warrantless searches — say: 'I do not consent.'",
      "You have privacy rights in your phone, computer, and all digital devices.",
      "Terry stops require only reasonable suspicion — warrants are needed for full searches.",
      "Evidence obtained through illegal searches may be excluded in court.",
      "Your home has the highest 4th Amendment protection — demand to see the warrant.",
    ],
  },
  "Fifth Amendment": {
    summary: "Right to remain silent & due process",
    color: "from-orange-600 to-orange-800",
    details: [
      "You have the right to remain silent during police questioning — use it.",
      "Clearly invoke: 'I am exercising my right to remain silent.'",
      "Request an attorney immediately: 'I want to speak to a lawyer before answering questions.'",
      "No person shall be tried twice for the same crime (double jeopardy).",
      "Government cannot take private property without just compensation.",
      "No person shall be deprived of life, liberty, or property without due process of law.",
    ],
  },
  "Sixth Amendment": {
    summary: "Right to a speedy trial, jury & legal counsel",
    color: "from-purple-600 to-purple-800",
    details: [
      "You have the right to a speedy and public trial by an impartial jury.",
      "You have the right to be informed of charges against you.",
      "You have the right to confront witnesses testifying against you.",
      "You have the right to compel witnesses to testify on your behalf.",
      "You have the right to an attorney — if you cannot afford one, one must be appointed.",
      "Invoke clearly: 'I am invoking my right to counsel. I will not answer questions without an attorney.'",
    ],
  },
  "Eighth Amendment": {
    summary: "Protection against cruel & unusual punishment",
    color: "from-rose-700 to-rose-900",
    details: [
      "Excessive bail shall not be required, nor excessive fines imposed.",
      "Cruel and unusual punishments are prohibited.",
      "Courts have interpreted this to limit harsh prison conditions and treatment.",
      "Applies to conditions of confinement — solitary confinement, medical denial, physical abuse.",
      "Death penalty cases require heightened procedural protections under the 8th Amendment.",
      "If mistreated in custody, document everything and contact a civil rights attorney immediately.",
    ],
  },
  "Tenth Amendment": {
    summary: "Powers reserved to states & the people",
    color: "from-teal-600 to-teal-800",
    details: [
      "Powers not delegated to the federal government are reserved to the states or the people.",
      "This is the foundation of federalism — states have broad regulatory authority.",
      "State laws on marijuana, abortion, voting, and policing differ widely under this principle.",
      "Federal supremacy clause still overrides state law in areas of exclusive federal authority.",
      "Know your state's specific civil rights protections — many exceed federal minimums.",
      "Local governments are created by states and have only the powers granted to them by state law.",
    ],
  },
  "Fourteenth Amendment": {
    summary: "Equal protection, due process & citizenship rights",
    color: "from-indigo-600 to-indigo-800",
    details: [
      "All persons born or naturalized in the US are citizens — birthright citizenship.",
      "No state shall deprive any person of life, liberty, or property without due process of law.",
      "No state shall deny any person equal protection of the laws.",
      "This amendment applies the Bill of Rights to state and local governments — not just federal.",
      "Racial, gender, and other classifications by government are subject to judicial review.",
      "Section 1983 lawsuits against police use this amendment as their constitutional foundation.",
    ],
  },
};

const whatToDoScenarios = [
  {
    title: "Pulled Over by Police",
    icon: <AlertCircle className="h-5 w-5" />,
    steps: [
      "Pull over safely and keep hands visible on the steering wheel.",
      "Provide license, registration, and insurance — you are required to do this.",
      "Inform the officer calmly if you are legally carrying a firearm.",
      "You can refuse consent to search your vehicle: 'I do not consent to a search.'",
      "Stay calm, do not argue. You can challenge anything in court later.",
    ],
  },
  {
    title: "Police at Your Door",
    icon: <Shield className="h-5 w-5" />,
    steps: [
      "Ask through the closed door: 'Do you have a warrant?'",
      "Ask them to slide the warrant under the door to verify it.",
      "Do NOT open the door without a valid warrant signed by a judge.",
      "If they force entry, do not resist — document everything afterward.",
      "Say clearly: 'I do not consent to this entry' even if you cannot stop it.",
    ],
  },
  {
    title: "Stopped on the Street",
    icon: <Shield className="h-5 w-5" />,
    steps: [
      "Ask calmly: 'Am I free to go?' If yes, leave immediately.",
      "If detained, ask: 'Why am I being detained? What is your reasonable suspicion?'",
      "You may be required to identify yourself in stop-and-identify states.",
      "Do not physically resist, even if the stop is unlawful.",
      "Invoke: 'I am exercising my right to remain silent.'",
    ],
  },
  {
    title: "Recording Police",
    icon: <AlertCircle className="h-5 w-5" />,
    steps: [
      "You have a First Amendment right to record police in public spaces.",
      "Stand at a safe distance — do not physically interfere with their duties.",
      "If ordered to stop: 'I am exercising my First Amendment right to record.'",
      "Do not delete footage even if asked — that may be evidence tampering.",
      "Back up footage immediately to cloud storage as a safety measure.",
    ],
  },
];

const idLawsByState = {
  stop_and_identify: [
    "Alabama","Arizona","Arkansas","Colorado","Delaware","Florida","Georgia",
    "Illinois","Indiana","Kansas","Louisiana","Missouri","Montana","Nebraska",
    "Nevada","New Hampshire","New Mexico","New York","North Dakota","Ohio",
    "Rhode Island","Utah","Vermont","Wisconsin",
  ],
};

export const KnowYourRights = () => {
  const { state: jurisdictionState } = useJurisdiction();
  const state = jurisdictionState === DEFAULT_JURISDICTION ? null : jurisdictionState;

  const downloadPDF = (amendment: string) => {
    const doc = new jsPDF();
    const data = rightsData[amendment];
    doc.setFontSize(18);
    doc.text(`KNOW YOUR RIGHTS: ${amendment}`, 10, 20);
    doc.setFontSize(12);
    doc.text(data.summary, 10, 32);
    doc.setFontSize(10);
    let y = 48;
    data.details.forEach((detail, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${detail}`, 180);
      doc.text(lines, 10, y);
      y += lines.length * 7 + 4;
    });
    doc.setFontSize(8);
    doc.text("CivilRightsHub.org — This is for general information only, not legal advice.", 10, 280);
    doc.save(`${amendment.replace(/\s+/g, "-")}.pdf`);
  };

  const isStopAndIdentifyState = state && idLawsByState.stop_and_identify.includes(state);

  return (
    <section id="rights" className="py-20 relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[140px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-14">

          {/* Header */}
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-widest uppercase">
              <Scale className="h-4 w-4" />
              Constitutional Intelligence
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Know Your <span className="text-blue-400">Rights</span>.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              Knowledge is your first line of defense. Access verified legal guides for every constitutional protection.
            </p>
            {state && isStopAndIdentifyState && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-medium">
                ⚠️ <strong>{state}</strong> is a Stop-and-Identify state — you may be required to provide your name when lawfully detained.
              </div>
            )}
          </div>

          {/* Amendment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Object.entries(rightsData).map(([amendment, content]) => (
              <Sheet key={amendment}>
                <SheetTrigger asChild>
                  <Card className="cursor-pointer group border border-white/8 bg-slate-900 hover:bg-slate-800 hover:border-blue-500/40 transition-all duration-200 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge
                          variant="outline"
                          className="text-blue-400 border-blue-500/40 bg-blue-500/10 mb-2 text-xs font-semibold"
                        >
                          {amendment}
                        </Badge>
                        <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 transition-colors mt-0.5" />
                      </div>
                      <CardTitle className="text-lg text-white group-hover:text-blue-300 transition-colors leading-snug">
                        {amendment}
                      </CardTitle>
                      <CardDescription className="text-slate-400 text-sm leading-relaxed">
                        {content.summary}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </SheetTrigger>

                {/* Detail Sheet */}
                <SheetContent side="right" className="bg-slate-950 border-white/10 text-white w-full sm:max-w-xl overflow-y-auto">
                  <SheetHeader className="text-left space-y-3 pb-2">
                    <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${content.color} items-center justify-center`}>
                      <Scale className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="w-fit bg-blue-600 text-white border-0">{amendment}</Badge>
                    <SheetTitle className="text-2xl font-bold text-white leading-tight">{amendment}</SheetTitle>
                    <SheetDescription className="text-slate-400 text-base italic">{content.summary}</SheetDescription>
                  </SheetHeader>

                  <div className="mt-8 space-y-5">
                    <div className="space-y-3">
                      {content.details.map((detail, idx) => (
                        <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/8 items-start">
                          <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-slate-300 leading-relaxed text-sm">{detail}</p>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => downloadPDF(amendment)}
                      className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Defense Guide
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ))}
          </div>

          {/* Scenario Playbooks */}
          <div className="pt-4 space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-blue-400" />
              Scenario Playbooks
            </h3>
            <Accordion type="single" collapsible className="space-y-3">
              {whatToDoScenarios.map((scenario, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-none">
                  <Card className="border border-white/8 bg-slate-900 overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
                          {scenario.icon}
                        </div>
                        <span className="text-base font-bold text-white">{scenario.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5">
                      <ul className="space-y-2.5 mt-1">
                        {scenario.steps.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-3 text-slate-300 text-sm">
                            <span className="text-blue-400 mt-1 shrink-0 font-bold">{sIdx + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
    </section>
  );
};
