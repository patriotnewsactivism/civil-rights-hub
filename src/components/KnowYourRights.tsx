import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Download, FileText, Scale, AlertCircle, Phone, Shield, HelpCircle, ExternalLink } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import jsPDF from "jspdf";

type EmergencyContactLink = {
  label: string;
  url: string;
  external?: boolean;
};

type EmergencyContactResource = {
  name: string;
  number: string;
  description: string;
  website?: string;
  links?: EmergencyContactLink[];
};

type EmergencyContactCategory = {
  category: string;
  contacts: EmergencyContactResource[];
};

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
      "Federal law prohibits certain individuals from possessing firearms (felons, domestic violence offenders)",
      "Laws vary significantly by state - know your local regulations"
    ]
  },
  "Fourth Amendment": {
    summary: "Protection against unreasonable searches and seizures",
    details: [
      "Police generally need probable cause and a warrant to search you, your home, or your vehicle",
      "You have the right to refuse consent to warrantless searches - clearly state: 'I do not consent to this search'",
      "You have privacy rights in your phone, computer, and digital devices",
      "Stop and frisk requires reasonable suspicion of criminal activity",
      "Certain exceptions exist: plain view doctrine, exigent circumstances, search incident to arrest",
      "Evidence obtained through illegal searches may be excluded in court"
    ]
  },
  "Fifth Amendment": {
    summary: "Right to remain silent, due process, and protection against self-incrimination",
    details: [
      "You have the right to remain silent during police questioning - use it!",
      "You cannot be compelled to incriminate yourself in any criminal case",
      "Clearly invoke your right: 'I am exercising my right to remain silent'",
      "Request an attorney immediately if questioned: 'I want to speak to a lawyer'",
      "You cannot be tried twice for the same offense (double jeopardy protection)",
      "Government cannot take private property without just compensation",
      "No person shall be deprived of life, liberty, or property without due process of law"
    ]
  },
  "Sixth Amendment": {
    summary: "Right to a speedy trial, impartial jury, and legal counsel",
    details: [
      "You have the right to a speedy and public trial by an impartial jury",
      "You must be informed of criminal charges against you",
      "You have the right to confront witnesses testifying against you",
      "You can compel witnesses to testify on your behalf",
      "You have the right to legal counsel - if you cannot afford a lawyer, one will be appointed",
      "Request a lawyer immediately upon arrest - do not answer questions without one present",
      "These rights apply to all criminal prosecutions, including misdemeanors"
    ]
  },
  "Eighth Amendment": {
    summary: "Protection against cruel and unusual punishment and excessive bail",
    details: [
      "Excessive bail shall not be required",
      "Excessive fines shall not be imposed",
      "Cruel and unusual punishments are prohibited",
      "Punishment must be proportionate to the crime committed",
      "Protections against torture and inhumane prison conditions",
      "Death penalty restrictions and procedures vary by state"
    ]
  },
  "Fourteenth Amendment": {
    summary: "Equal protection, due process, and citizenship rights",
    details: [
      "All persons born or naturalized in the United States are citizens",
      "No state shall make or enforce any law which abridges the privileges or immunities of citizens",
      "No state shall deprive any person of life, liberty, or property without due process of law",
      "No state shall deny any person equal protection of the laws",
      "Protects against discrimination based on race, gender, religion, national origin",
      "Applies most Bill of Rights protections to state and local governments",
      "Foundation for civil rights legislation and anti-discrimination laws"
    ]
  },
  "Recording Rights": {
    summary: "Your constitutional right to record police and public officials",
    details: [
      "Recording police in public is constitutionally protected under the First Amendment",
      "Officers cannot lawfully demand you stop recording in public spaces",
      "Officers cannot confiscate, delete, or demand to see your recordings without a warrant",
      "You can record from any public space with clear view - maintain a reasonable distance",
      "State laws vary on recording private conversations (one-party vs. two-party consent states)",
      "No reasonable expectation of privacy exists in public spaces",
      "Always maintain a safe distance that doesn't interfere with police operations"
    ]
  }
};

const idLawsByState = {
  "stop_and_identify": [
    "Alabama", "Arizona", "Arkansas", "Colorado", "Delaware", "Florida", "Georgia",
    "Illinois", "Indiana", "Kansas", "Louisiana", "Missouri", "Montana", "Nebraska",
    "Nevada", "New Hampshire", "New Mexico", "New York", "North Dakota", "Ohio",
    "Rhode Island", "Utah", "Vermont", "Wisconsin"
  ],
  "description": "Stop and Identify states require you to provide your name to police if they have reasonable suspicion you're involved in criminal activity. You do NOT have to show physical ID, and you do NOT have to answer any other questions."
};

const whatToDoScenarios = [
  {
    title: "If You're Pulled Over by Police",
    steps: [
      "Pull over safely and turn off your engine",
      "Keep your hands visible on the steering wheel",
      "Turn on interior light if it's dark outside",
      "Inform the officer if you have a legal firearm in the vehicle",
      "Provide driver's license, registration, and insurance when asked",
      "You have the right to remain silent beyond providing these documents",
      "You can refuse consent to search your vehicle - say: 'I do not consent to searches'",
      "If you feel your rights are violated, do not argue - comply and file a complaint later"
    ]
  },
  {
    title: "If Police Come to Your Home",
    steps: [
      "You do not have to open the door or let them in without a warrant",
      "Ask: 'Do you have a warrant?' through the closed door",
      "If they have a warrant, ask them to slide it under the door or show it through a window",
      "Check that the warrant has the correct address and is signed by a judge",
      "If there's no warrant and no emergency, you can tell them to leave",
      "Do not consent to a search even if they ask - say: 'I do not consent'",
      "If they force entry anyway, do not physically resist - comply and document everything",
      "Write down officer names, badge numbers, and details immediately after"
    ]
  },
  {
    title: "If You're Stopped on the Street",
    steps: [
      "Stay calm and keep your hands visible",
      "Ask: 'Am I free to leave?' If yes, calmly walk away",
      "You only have to identify yourself in 'stop and identify' states if they have reasonable suspicion",
      "You do NOT have to answer questions about where you're going or what you're doing",
      "You can decline searches - say: 'I do not consent to any searches'",
      "If they pat you down (frisk), they need reasonable suspicion you're armed",
      "Do not run, argue, or physically resist even if you believe the stop is unlawful",
      "If arrested, invoke your rights: 'I'm exercising my right to remain silent and I want a lawyer'"
    ]
  },
  {
    title: "If You're Arrested",
    steps: [
      "Do not resist arrest even if you believe it's unjust",
      "Immediately say: 'I am exercising my right to remain silent'",
      "Immediately say: 'I want to speak to a lawyer'",
      "Do NOT answer any questions without a lawyer present, no matter what they promise",
      "Do not sign anything without reading it carefully or consulting a lawyer",
      "You have the right to make a phone call - use it to contact a lawyer or trusted person",
      "Document everything you remember as soon as you're able",
      "Avoid discussing your case with cellmates or on recorded jail phones"
    ]
  },
  {
    title: "If Police Want to Search Your Phone",
    steps: [
      "Police need a warrant to search your phone in most circumstances",
      "Do not unlock your phone or provide your passcode",
      "Clearly state: 'I do not consent to a search of my phone'",
      "They cannot force you to provide biometric unlock (fingerprint/face) in many states - check local law",
      "If they seize your phone, they still need a warrant to search its contents",
      "Modern encryption protections make warrantless phone searches illegal in most cases",
      "Turn off your phone if possible - powered-off phones have stronger legal protections"
    ]
  },
  {
    title: "If You Witness Police Misconduct",
    steps: [
      "You have the constitutional right to record police in public - use it",
      "Record from a safe distance that doesn't interfere with police operations",
      "Keep recording even if officers tell you to stop",
      "Livestream or automatically backup recordings to cloud storage if possible",
      "Do not physically interfere, even if you believe someone's rights are being violated",
      "Get names and badge numbers of officers involved",
      "Collect contact information from other witnesses",
      "File a complaint with the department's internal affairs and civilian oversight board",
      "Contact civil rights organizations like ACLU, NAACP, or local legal aid"
    ]
  }
];

const emergencyContacts: EmergencyContactCategory[] = [
  {
    category: "Legal Assistance",
    contacts: [
      { name: "National Lawyer Referral Service", number: "1-800-285-2221", description: "Find attorneys in your area" },
      { name: "ACLU", number: "Call state chapter", description: "Civil liberties legal support", website: "www.aclu.org/about/affiliates" },
      { name: "Legal Aid", number: "Call local office", description: "Free legal services for low-income", website: "www.lawhelp.org" },
      { name: "National Lawyers Guild", number: "Call local chapter", description: "Progressive legal support", website: "www.nlg.org" }
    ]
  },
  {
    category: "Civil Rights Organizations",
    contacts: [
      { name: "NAACP Legal Defense Fund", number: "212-965-2200", description: "Racial justice litigation" },
      { name: "Southern Poverty Law Center", number: "334-956-8200", description: "Civil rights advocacy" },
      { name: "National Immigration Law Center", number: "213-639-3900", description: "Immigrant rights" },
      { name: "Transgender Law Center", number: "510-380-8229", description: "Trans rights advocacy" }
    ]
  },
  {
    category: "Emergency Hotlines",
    contacts: [
      { name: "Police Misconduct Hotline", number: "1-844-762-8483", description: "Report police abuse" },
      { name: "Immigrant Defense Hotline", number: "1-844-363-1423", description: "ICE encounters" },
      { name: "National Bail Fund Network", number: "Visit website", description: "Bail assistance", website: "www.communityjusticeexchange.org" },
      { name: "Know Your Rights Hotline", number: "1-888-897-3731", description: "Immediate rights advice (Spanish available)" }
    ]
  },
  {
    category: "Documentation & Support",
    contacts: [
      {
        name: "Cop Recorder App",
        number: "Built-in & External",
        description: "Start the Civil Rights Hub emergency recorder or download trusted mobile recorder apps.",
        links: [
          { label: "Use Emergency Recorder", url: "/community#panic-button", external: false },
          {
            label: "iOS App Store",
            url: "https://apps.apple.com/us/app/cop-watch-video-recorder/id757572626",
          },
          {
            label: "Android (ProofMode)",
            url: "https://play.google.com/store/apps/details?id=org.witness.proofmode",
          },
        ],
      },
      {
        name: "Cop Block App (Citizen)",
        number: "iOS & Android",
        description: "Real-time safety alerts and community incident reporting with location sharing.",
        links: [
          {
            label: "Download on iOS",
            url: "https://apps.apple.com/us/app/citizen-protect-the-world/id1039889567",
          },
          {
            label: "Download on Android",
            url: "https://play.google.com/store/apps/details?id=sp0n.citizen",
          },
        ],
      },
      { name: "Witness LA", number: "Visit website", description: "Criminal justice reform", website: "www.witnessla.com" },
      { name: "Cop Watch", number: "Find local chapter", description: "Community police monitoring", website: "www.berkeleycopwatch.org" }
    ]
  }
];

export const KnowYourRights = () => {
  const { state, loading } = useGeolocation();
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

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

      // Check if it's a stop and identify state
      if (idLawsByState.stop_and_identify.includes(state)) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(200, 0, 0);
        const idNote = doc.splitTextToSize(`${state} is a "Stop and Identify" state. You must provide your name to police if they have reasonable suspicion of criminal activity.`, maxWidth);
        doc.text(idNote, margin, yPos);
        yPos += idNote.length * 5 + 5;
        doc.setTextColor(0, 0, 0);
      }
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

  const isStopAndIdentifyState = state && idLawsByState.stop_and_identify.includes(state);

  const selectedContent = selectedRight ? rightsData[selectedRight as keyof typeof rightsData] : null;

  return (
    <section id="rights" className="py-12 md:py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <Scale className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Know Your Rights</h2>
            </div>
            <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">
              Quick-access constitutional guides, scenario playbooks, and emergency contacts.
            </p>
            {!loading && state && (
              <Badge variant="outline" className="mt-3 md:mt-4 text-xs md:text-sm">
                <FileText className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                Showing information for: {state}
              </Badge>
            )}
          </div>

          {/* Constitutional Rights - Compact Cards */}
          <div className="mb-10 md:mb-12">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Your Constitutional Rights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {Object.entries(rightsData).map(([amendment, content]) => (
                <Sheet key={amendment}>
                  <SheetTrigger asChild>
                    <Card className="border-border hover:shadow-strong transition-all cursor-pointer hover:border-primary/50 h-full">
                      <CardHeader className="p-4 md:p-6 space-y-2">
                        <CardTitle className="text-base md:text-lg flex items-start justify-between gap-2">
                          <span className="line-clamp-2">{amendment}</span>
                          <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm line-clamp-3">{content.summary}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs md:text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPDF(amendment);
                          }}
                        >
                          <Download className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="text-xl md:text-2xl">{amendment}</SheetTitle>
                      <SheetDescription className="text-sm md:text-base">{content.summary}</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div className="space-y-3">
                        {content.details.map((detail, idx) => (
                          <div key={idx} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                            <span className="text-primary font-bold flex-shrink-0">•</span>
                            <span className="text-sm md:text-base">{detail}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => downloadPDF(amendment)}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF Guide
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              ))}
            </div>
          </div>

          {/* ID Laws Section - Compact */}
          <div className="mb-10 md:mb-12">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              When Do You Have to Show ID?
            </h3>
            <Card className={isStopAndIdentifyState ? "border-amber-500 bg-amber-500/5" : ""}>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">
                  {isStopAndIdentifyState ? `${state} is a "Stop and Identify" State` : "ID Requirements"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0 space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <strong className="text-primary">When Driving:</strong> Must show license, registration, insurance.
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <strong className="text-primary">When Walking:</strong> {isStopAndIdentifyState ? "Must give name if reasonable suspicion" : "Generally NOT required"}
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <strong className="text-primary">When Arrested:</strong> ID during booking process.
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <strong className="text-primary">Federal Buildings:</strong> May be required for entry.
                  </div>
                </div>

                {isStopAndIdentifyState && (
                  <div className="p-3 md:p-4 bg-amber-100 dark:bg-amber-900/20 rounded-lg border border-amber-300">
                    <p className="text-xs md:text-sm font-semibold text-amber-900 dark:text-amber-100">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      {state} "Stop and Identify" Law
                    </p>
                    <p className="text-xs md:text-sm mt-2">
                      {idLawsByState.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* What To Do If Scenarios - Keep Accordion */}
          <div className="mb-10 md:mb-12">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              What To Do If...
            </h3>
            <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
              {whatToDoScenarios.map((scenario, index) => (
                <Card key={index}>
                  <AccordionItem value={`scenario-${index}`} className="border-none">
                    <CardHeader className="p-4 md:p-6">
                      <AccordionTrigger className="hover:no-underline">
                        <CardTitle className="text-base md:text-lg text-left">{scenario.title}</CardTitle>
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent>
                      <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                        <ol className="space-y-2 md:space-y-3">
                          {scenario.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex gap-2 md:gap-3 text-xs md:text-sm p-2 md:p-3 rounded-lg bg-muted/30">
                              <span className="text-primary font-bold min-w-[24px] md:min-w-[30px]">{stepIndex + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              ))}
            </Accordion>
          </div>

          {/* Emergency Contacts - More Compact */}
          <div className="mb-8 md:mb-10">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2">
              <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Important Numbers & Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {emergencyContacts.map((category, index) => (
                <Card key={index}>
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                    <div className="space-y-3 md:space-y-4">
                      {category.contacts.map((contact, contactIndex) => (
                        <div key={contactIndex} className="border-l-2 border-primary pl-3 text-xs md:text-sm">
                          <div className="font-semibold">{contact.name}</div>
                          <div className="text-primary">
                            {contact.number.match(/^\d/) || contact.number.includes('-') && contact.number.match(/\d/) ? (
                              <a href={`tel:${contact.number.replace(/[^\d]/g, '')}`} className="hover:underline">
                                {contact.number}
                              </a>
                            ) : (
                              contact.number
                            )}
                          </div>
                          <div className="text-muted-foreground">{contact.description}</div>
                          {contact.links?.length ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {contact.links.map((link) => {
                                const isExternal = link.external !== false;
                                return (
                                  <a
                                    key={`${contact.name}-${link.label}`}
                                    href={link.url}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    className="inline-flex items-center gap-1 rounded border border-primary px-2 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
                                  >
                                    {link.label}
                                  </a>
                                );
                              })}
                            </div>
                          ) : contact.website ? (
                            <div className="text-xs mt-1">
                              <a
                                href={`https://${contact.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {contact.website}
                              </a>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Legal Disclaimer */}
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardContent className="p-4 md:p-6">
              <p className="text-xs md:text-sm text-center">
                <strong>Important Legal Disclaimer:</strong> This is general legal information, not legal advice.
                Laws vary significantly by state, county, and situation. This information does not create an attorney-client relationship.
                Always consult with a qualified attorney licensed in your state for specific legal guidance about your situation.
                In emergency situations, prioritize your safety over asserting your rights.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
