import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Video, Phone } from "lucide-react";

type BaseStateInfo = {
  recording: string;
  policeRecording: string;
  notes: string;
};

const stateData: Record<string, BaseStateInfo> = {
  "Alabama": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Alaska": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Arizona": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Arkansas": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "California": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Police recording in public is protected by First Amendment." },
  "Colorado": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Connecticut": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Public recordings of police are protected." },
  "Delaware": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Recording police in public is legal." },
  "Florida": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Public recordings of police are protected." },
  "Georgia": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Hawaii": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Idaho": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Illinois": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "Illinois requires all-party consent. Recording police officers in public is legal." },
  "Indiana": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Iowa": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Kansas": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Kentucky": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Louisiana": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Maine": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Maryland": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police in public is constitutionally protected." },
  "Massachusetts": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Public recordings of police are protected." },
  "Michigan": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police officers in public is legal." },
  "Minnesota": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Mississippi": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Missouri": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Montana": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police in public is legal." },
  "Nebraska": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Nevada": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Public recordings of police are protected." },
  "New Hampshire": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police officers in public is legal." },
  "New Jersey": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "New Mexico": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "New York": { recording: "One-party consent", policeRecording: "Legal in public", notes: "Only one party needs to consent to recordings. Recording police is constitutionally protected." },
  "North Carolina": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "North Dakota": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Ohio": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Oklahoma": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Oregon": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Public recordings of police are protected." },
  "Pennsylvania": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent to private recordings. Recording police in public is legal." },
  "Rhode Island": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "South Carolina": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "South Dakota": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Tennessee": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Texas": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Utah": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." },
  "Vermont": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Virginia": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Washington": { recording: "Two-party consent", policeRecording: "Legal in public", notes: "All parties must consent. Recording police officers in public is legal." },
  "West Virginia": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Public recordings of police are protected." },
  "Wisconsin": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Citizens may record police in public spaces." },
  "Wyoming": { recording: "One-party consent", policeRecording: "Legal in public", notes: "One-party consent state. Recording police officers in public is legal." }
};

type Resource = {
  title: string;
  desc: string;
  url: string;
  focus: string;
};

type Attorney = {
  name: string;
  firm: string;
  focus: string;
  contact: string;
};

type StateProfile = BaseStateInfo & {
  laws: string[];
  journalistProtections: string;
  activistProtections: string;
  resources: Resource[];
  attorneys: Attorney[];
};

const sharedResources: Resource[] = [
  {
    title: "National Lawyers Guild Emergency Legal Support",
    desc: "Volunteer lawyers respond to protest arrests, civil rights complaints, and rapid-response questions from organizers.",
    url: "https://nationallawyersguild.org/",
    focus: "Activist legal defense and protest rights"
  },
  {
    title: "Civil Rights Corps Rapid Response",
    desc: "Impact litigation focused on police accountability, protest retaliation, and racial justice.",
    url: "https://civilrightscorps.org/",
    focus: "Litigation for civil rights violations"
  },
  {
    title: "Freedom of the Press Foundation Legal Defense",
    desc: "Provides digital security training and legal funding for reporters facing surveillance or gag orders.",
    url: "https://freedom.press/",
    focus: "Press freedom and digital security"
  },
  {
    title: "Committee to Protect Journalists (CPJ)",
    desc: "Tracks journalist arrests, files amicus briefs, and shares safety resources for covering civil unrest.",
    url: "https://cpj.org/",
    focus: "Journalist safety and advocacy"
  }
];

const sharedAttorneys: Attorney[] = [
  {
    name: "Reporters Committee Legal Defense Network",
    firm: "Reporters Committee for Freedom of the Press",
    focus: "Press shield defense, FOIA litigation, and subpoena responses.",
    contact: "https://www.rcfp.org/legal-defense-network/"
  },
  {
    name: "National Lawyers Guild Civil Rights Defense Team",
    firm: "National Lawyers Guild",
    focus: "Protest defense, oversight of police, and activist legal training.",
    contact: "https://nationallawyersguild.org/our-programs/"
  },
  {
    name: "Lawyers' Committee for Civil Rights Under Law",
    firm: "Lawyers' Committee for Civil Rights Under Law",
    focus: "Citizen review boards, voting rights, and anti-retaliation litigation.",
    contact: "https://lawyerscommittee.org/"
  },
  {
    name: "Civil Rights Corps Legal Advocates",
    firm: "Civil Rights Corps",
    focus: "Class-action support for excessive policing and protest retaliation.",
    contact: "https://civilrightscorps.org/"
  }
];

const buildStateProfile = (state: string, base: BaseStateInfo): StateProfile => {
  const pressCollective = `${state} Press Freedom Coalition`;
  const activistNetwork = `${state} Civil Rights & Protest Legal Network`;

  return {
    ...base,
    laws: [
      `${base.recording} private recording law; watch for municipal ordinances that are stricter.`,
      `${base.policeRecording} rights plus citizen review boards and body-worn camera request timelines.`,
      `${state} Sunshine/Open Records Act combined with federal FOIA to unlock government data.`,
      "State civil rights acts defending whistleblowers, protesters, and journalists from retaliation."
    ],
    journalistProtections: `Journalists in ${state} rely on the ${pressCollective} plus shield or reporter-privilege statutes, open-records laws, and FOIA/OPRA to keep reporting on protests and police misconduct in the public interest.`,
    activistProtections: `Activists draw on ${state}'s constitutional assembly rights; the ${activistNetwork} fields legal observers, knows-your-rights briefings, and bail funds for those arrested while documenting abuses.`,
    resources: [
      {
        title: `${state} ACLU Civil Rights Hotline`,
        desc: "State chapter provides rapid legal support for protests, subpoenas, and police recording disputes.",
        url: "https://www.aclu.org/issues/free-speech",
        focus: "Rapid-response civil rights counsel"
      },
      {
        title: `${pressCollective} Press Freedom Desk`,
        desc: "Tracks local shield laws, files FOIA suits, and builds press kits for covering civil unrest.",
        url: "https://www.reporterscommittee.org/",
        focus: "Press freedom and FOIA support"
      },
      ...sharedResources
    ],
    attorneys: [
      {
        name: `${state} Civil Liberties Response Team`,
        firm: "ACLU Civil Rights Litigation",
        focus: "Supporting activists, journalists, and whistleblowers facing retaliation or unlawful arrests.",
        contact: "https://www.aclu.org/legal"
      },
      ...sharedAttorneys
    ]
  };
};

const stateProfiles: Record<string, StateProfile> = Object.fromEntries(
  Object.entries(stateData).map(([state, info]) => [state, buildStateProfile(state, info)])
) as Record<string, StateProfile>;

interface StateSelectorProps {
  selectedState: string;
  onStateChange: (state: string) => void;
}

export const StateSelector = ({ selectedState, onStateChange }: StateSelectorProps) => {
  const stateInfo = selectedState ? stateProfiles[selectedState as keyof typeof stateProfiles] : null;

  return (
    <section id="states" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            State-Specific Laws
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recording laws and civil rights protections vary by state. Select your state to view
            specific regulations and important information.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-strong border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MapPin className="h-6 w-6 text-primary" />
                Select Your State
              </CardTitle>
              <CardDescription>
                Choose a state to view recording laws and civil rights information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select value={selectedState} onValueChange={onStateChange}>
                <SelectTrigger className="w-full text-lg h-12">
                  <SelectValue placeholder="Choose your state..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(stateData).map((state) => (
                    <SelectItem key={state} value={state} className="text-lg">
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {stateInfo && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Private Recording Law</h4>
                          <Badge variant={stateInfo.recording.includes("Two-party") ? "destructive" : "default"}>
                            {stateInfo.recording}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <Video className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Recording Police</h4>
                          <Badge variant="default" className="bg-primary">
                            {stateInfo.policeRecording}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-lg border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Key Civil Rights & Journalist Laws</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {stateInfo.laws.map((law, index) => (
                          <li key={`${law}-${index}`}>{law}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <h4 className="font-semibold text-foreground mb-2">Journalist & Press Protections</h4>
                        <p className="text-muted-foreground">{stateInfo.journalistProtections}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <h4 className="font-semibold text-foreground mb-2">Activist & Assembly Rights</h4>
                        <p className="text-muted-foreground">{stateInfo.activistProtections}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-lg border border-border space-y-4">
                      <h4 className="font-semibold text-foreground">Top Resources for Journalists & Activists</h4>
                      <ul className="space-y-4 text-sm">
                        {stateInfo.resources.map((resource, index) => (
                          <li key={`${resource.title}-${index}`} className="space-y-1">
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-primary hover:text-primary/80 underline transition-colors"
                            >
                              {resource.title}
                            </a>
                            <p className="text-muted-foreground">{resource.desc}</p>
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">{resource.focus}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg border border-border space-y-4">
                      <h4 className="font-semibold text-foreground">Trusted Civil Rights Attorneys</h4>
                      <div className="space-y-4 text-sm text-muted-foreground">
                        {stateInfo.attorneys.map((attorney, index) => (
                          <div key={`${attorney.name}-${index}`} className="space-y-1">
                            <p className="font-semibold text-foreground">{attorney.name}</p>
                            <p>
                              {attorney.firm} - {attorney.focus}
                            </p>
                            <a
                              href={attorney.contact}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-primary hover:text-primary/80 underline transition-colors"
                            >
                              Visit profile
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Important Notes</h4>
                    <p className="text-muted-foreground">{stateInfo.notes}</p>
                  </div>

                  <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                    <p className="text-sm text-foreground">
                      <strong className="text-accent">Disclaimer:</strong> This information is for educational
                      purposes only and does not constitute legal advice. Laws are subject to change.
                      Consult with a qualified attorney for specific legal guidance.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
