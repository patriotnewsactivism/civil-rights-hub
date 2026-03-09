import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Download, FileText, Scale, AlertCircle, Phone, Shield, HelpCircle, ExternalLink, ChevronRight, Info } from "lucide-react";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION } from "@/data/usStates";
import jsPDF from "jspdf";

const rightsData = {
  "First Amendment": {
    summary: "Freedom of religion, speech, press, assembly, and petition",
    details: [
      "Congress shall make no law respecting an establishment of religion or prohibiting the free exercise thereof",
      "You have the right to freedom of speech - express opinions without government censorship",
      "Freedom of the press - right to gather and report news without media credentials",
      "Right to peacefully assemble and protest without a permit in most public spaces",
      "Right to petition the government for redress of grievances",
      "You can record police officers performing their duties in public spaces"
    ]
  },
  "Second Amendment": {
    summary: "Right to keep and bear arms",
    details: [
      "The right to keep and bear arms shall not be infringed",
      "States can regulate firearm possession and carrying to varying degrees",
      "Concealed carry permits may be required depending on your state",
      "Always inform police officers if you are legally carrying a firearm during any interaction",
      "Federal law prohibits certain individuals from possessing firearms",
      "Laws vary significantly by state - know your local regulations"
    ]
  },
  "Fourth Amendment": {
    summary: "Protection against unreasonable searches and seizures",
    details: [
      "Police generally need probable cause and a warrant to search you, your home, or your vehicle",
      "You have the right to refuse consent to warrantless searches - state: 'I do not consent'",
      "You have privacy rights in your phone, computer, and digital devices",
      "Stop and frisk requires reasonable suspicion of criminal activity",
      "Evidence obtained through illegal searches may be excluded in court"
    ]
  },
  "Fifth Amendment": {
    summary: "Right to remain silent and due process",
    details: [
      "You have the right to remain silent during police questioning - use it!",
      "Clearly invoke your right: 'I am exercising my right to remain silent'",
      "Request an attorney immediately if questioned: 'I want to speak to a lawyer'",
      "Government cannot take private property without just compensation",
      "No person shall be deprived of life, liberty, or property without due process of law"
    ]
  }
};

const idLawsByState = {
  "stop_and_identify": [
    "Alabama", "Arizona", "Arkansas", "Colorado", "Delaware", "Florida", "Georgia",
    "Illinois", "Indiana", "Kansas", "Louisiana", "Missouri", "Montana", "Nebraska",
    "Nevada", "New Hampshire", "New Mexico", "New York", "North Dakota", "Ohio",
    "Rhode Island", "Utah", "Vermont", "Wisconsin"
  ]
};

const whatToDoScenarios = [
  {
    title: "Pulled Over by Police",
    icon: <AlertCircle className="h-5 w-5" />,
    steps: [
      "Keep hands visible on the steering wheel at all times.",
      "Inform officer if you have a legal firearm.",
      "Provide license, registration, and insurance.",
      "You can refuse consent to search your vehicle."
    ]
  },
  {
    title: "Police at Your Home",
    icon: <Shield className="h-5 w-5" />,
    steps: [
      "Ask 'Do you have a warrant?' through the closed door.",
      "Ask them to slide the warrant under the door.",
      "Do not open the door without a valid warrant.",
      "Document everything if they force entry."
    ]
  }
];

export const KnowYourRights = () => {
  const { state: jurisdictionState } = useJurisdiction();
  const state = jurisdictionState === DEFAULT_JURISDICTION ? null : jurisdictionState;

  const downloadPDF = (amendment: string) => {
    // PDF Logic remains same, potentially updated styles in actual app
    const doc = new jsPDF();
    doc.text(`KNOW YOUR RIGHTS: ${amendment}`, 10, 10);
    doc.save(`${amendment}.pdf`);
  };

  const isStopAndIdentifyState = state && idLawsByState.stop_and_identify.includes(state);

  return (
    <section id="rights" className="py-24 relative overflow-hidden bg-slate-950 text-white">
      {/* Background decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Section Header */}
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
              <Scale className="h-4 w-4" />
              Constitutional Intelligence
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Know Your <span className="text-primary">Rights</span>.
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              Knowledge is your first line of defense. Access verified legal guides and protocol playbooks for every encounter.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(rightsData).map(([amendment, content]) => (
              <Sheet key={amendment}>
                <SheetTrigger asChild>
                  <Card className="glass-card border-none hover:bg-white/10 transition-all cursor-pointer group">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="text-primary border-primary/30 mb-2">{amendment}</Badge>
                        <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-primary transition-colors">{amendment}</CardTitle>
                      <CardDescription className="text-slate-400 leading-relaxed">
                        {content.summary}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </SheetTrigger>
                <SheetContent side="right" className="bg-slate-950 border-white/10 text-white w-full sm:max-w-xl">
                  <SheetHeader className="text-left space-y-4">
                    <Badge className="w-fit">{amendment}</Badge>
                    <SheetTitle className="text-3xl font-bold text-white">{amendment}</SheetTitle>
                    <SheetDescription className="text-slate-400 text-lg italic">
                      {content.summary}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-12 space-y-6">
                    <div className="space-y-4">
                      {content.details.map((detail, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 items-start">
                          <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</div>
                          <p className="text-slate-300 leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => downloadPDF(amendment)} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20">
                      <Download className="mr-2 h-5 w-5" />
                      Download Defense Guide
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ))}
          </div>

          {/* Jurisdiction Focus */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-primary" />
                Scenario Playbooks
              </h3>
              <Accordion type="single" collapsible className="space-y-4">
                {whatToDoScenarios.map((scenario, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border-none">
                    <Card className="glass-card border-none overflow-hidden">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {scenario.icon}
                          </div>
                          <span className="text-lg font-bold text-white">{scenario.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 text-slate-400">
                        <ul className="space-y-3">
                          {scenario.steps.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-3">
                              <span className="text-primary mt-1.5">•</span>
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

            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Info className="h-6 w-6 text-primary" />
                Jurisdiction
              </h3>
              <Card className={`glass-card border-none ${isStopAndIdentifyState ? 'ring-1 ring-amber-500/50' : ''}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {state ? state.substring(0, 2).toUpperCase() : 'US'}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Target State</div>
                      <div className="font-bold">{state || 'Nationwide'}</div>
                    </div>
                  </div>
                  
                  {isStopAndIdentifyState ? (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                      <div className="text-amber-500 font-bold text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        STOP & IDENTIFY STATE
                      </div>
                      <p className="text-xs text-amber-200/70 leading-relaxed">
                        In {state}, you are legally required to provide your name if police have reasonable suspicion.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Standard constitutional protocols apply. No specific stop-and-identify statute detected for this jurisdiction.
                      </p>
                    </div>
                  )}

                  <div className="pt-4 space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase">Emergency Defense</div>
                    <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5" asChild>
                      <a href="tel:1-888-897-3731">
                        <Phone className="mr-2 h-4 w-4 text-primary" />
                        Legal Rights Hotline
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
