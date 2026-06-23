import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION } from "@/data/usStates";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  ShieldAlert,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Video,
  MapPin,
  Phone,
  FileText,
  Scale,
  Zap,
  Play,
  Square,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

// State data for quick visual threat calculations and specific rules
const STATE_THREAT_DATA: Record<
  string,
  {
    recording: string;
    type: "one-party" | "two-party";
    stopAndIdentify: "yes" | "no" | "partial";
    identifyRule: string;
    threatScore: number; // 0 (safest) to 100 (most strict)
    details: string;
  }
> = {
  "Alabama": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 30, details: "One-party consent for recording private conversations. However, Alabama has a Stop-and-Identify statute requiring your name, address, and explanation of actions if lawfully stopped in public." },
  "Alaska": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No state-wide law requiring ID on a stop, but you must produce driver's license if driving, or carrying a concealed weapon." },
  "Arizona": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 35, details: "One-party consent. Under AZ law, you must provide your true full name when lawfully detained. Failure to do so is a misdemeanor." },
  "Arkansas": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 30, details: "One-party consent. Requires identifying yourself upon request if there is reasonable suspicion of criminal activity." },
  "California": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 45, details: "Strict two-party (all-party) consent for private recordings. Recording police in public is fully protected under the 1st Amendment. You do not have to show ID or state your name unless arrested or driving." },
  "Colorado": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 25, details: "One-party consent. Colorado has a stop-and-identify law requiring you to show ID or give name and address if lawfully detained on reasonable suspicion." },
  "Connecticut": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 40, details: "All-party consent for private recording. No general stop-and-identify law, but drivers must show license." },
  "Delaware": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 50, details: "Strict recording consent laws. Delaware has a stop-and-identify law allowing police to demand your name, address, and destination if lawfully stopped." },
  "Florida": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 55, details: "All-party consent for private wire/oral recordings. Florida requires you to identify yourself if stopped under circumstances that reasonably indicate you committed, are committing, or are about to commit a crime." },
  "Georgia": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 30, details: "One-party consent. While there is no specific stop-and-identify statute, failure to identify yourself during a lawful stop can be charged as obstruction." },
  "Hawaii": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No statewide stop-and-identify law." },
  "Idaho": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 20, details: "One-party consent. No general stop-and-identify law, but resisting/delaying an officer by refusing identity when lawfully detained can occasionally be prosecuted." },
  "Illinois": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 45, details: "All-party consent required. Illinois stop-and-identify law states a peace officer may demand the name and address of any person stopped on reasonable suspicion." },
  "Indiana": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if stopped for infraction.", threatScore: 30, details: "One-party consent. Indiana requires you to provide name, address, and birthdate if stopped for an infraction or ordinance violation." },
  "Iowa": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No statewide stop-and-identify law." },
  "Kansas": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 30, details: "One-party consent. Kansas stop-and-identify statute allows officers to demand name, address, and explanation of actions." },
  "Kentucky": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No general stop-and-identify statute." },
  "Louisiana": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 35, details: "One-party consent. Louisiana requires any person stopped in public on reasonable suspicion to state their name, address, and actions." },
  "Maine": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No statewide stop-and-identify statute." },
  "Maryland": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 40, details: "Strict all-party consent. No stop-and-identify law, but public recording of police is fully legal if non-disruptive." },
  "Massachusetts": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 45, details: "Requires all-party consent. No general stop-and-identify law, but secret recording is illegal; keep recordings of police fully open and visible." },
  "Michigan": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 40, details: "Two-party consent state. No statewide stop-and-identify statute." },
  "Minnesota": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No general stop-and-identify law." },
  "Mississippi": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 20, details: "One-party consent. No stop-and-identify statute, but local ordinances may vary." },
  "Missouri": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if stopped for infraction.", threatScore: 30, details: "One-party consent. Must provide identification if stopped on suspicion of a municipal infraction or driving." },
  "Montana": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 45, details: "Two-party consent. Montana allows officers to request identification, name, and address of anyone lawfully stopped." },
  "Nebraska": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 30, details: "One-party consent. Nebraska requires giving your name and address if stopped on reasonable suspicion." },
  "Nevada": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 50, details: "Strict wiretapping laws. Nevada has a stop-and-identify law requiring you to provide your name if lawfully detained on reasonable suspicion." },
  "New Hampshire": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 45, details: "All-party consent for recordings. Must identify yourself, including name and address, if stopped in public." },
  "New Jersey": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 20, details: "One-party consent. No statewide stop-and-identify law, and recording officers is highly protected." },
  "New Mexico": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 30, details: "One-party consent. New Mexico requires providing identity if there is reasonable suspicion of a crime." },
  "New York": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. NY has no stop-and-identify statute. You do not have to state your name or show ID unless arrested or driving." },
  "North Carolina": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No statewide stop-and-identify statute." },
  "North Dakota": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 25, details: "One-party consent. Must identify if stopped under reasonable suspicion." },
  "Ohio": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 35, details: "One-party consent. Under Ohio law, you must provide your name, address, and date of birth if lawfully detained. Failure to do so is a misdemeanor." },
  "Oklahoma": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 20, details: "One-party consent. No general stop-and-identify law, but lying about identity is a crime." },
  "Oregon": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 35, details: "All parties must consent to in-person oral recordings. Public recordings of police are legal and protected." },
  "Pennsylvania": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 40, details: "Strict all-party consent. No general stop-and-identify law, but secret recordings are heavily prosecuted. Keep your device fully visible." },
  "Rhode Island": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 30, details: "One-party consent. Rhode Island has a stop-and-identify law for up to two hours of detention under reasonable suspicion." },
  "South Carolina": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No statewide stop-and-identify statute." },
  "South Dakota": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No statewide stop-and-identify statute." },
  "Tennessee": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 20, details: "One-party consent. No statewide stop-and-identify statute, though drivers must identify." },
  "Texas": { recording: "One-party consent", type: "one-party", stopAndIdentify: "partial", identifyRule: "Must identify only if lawfully ARRESTED.", threatScore: 25, details: "One-party consent. In Texas, you are only legally required to give your name/ID if you have been lawfully arrested. Merely being detained does not trigger the requirement, though refusing to show ID while driving is illegal." },
  "Utah": { recording: "One-party consent", type: "one-party", stopAndIdentify: "yes", identifyRule: "Must identify if lawfully detained.", threatScore: 30, details: "One-party consent. Utah has a stop-and-identify law requiring your name and explanation of actions if stopped on reasonable suspicion." },
  "Vermont": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No general stop-and-identify law." },
  "Virginia": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 20, details: "One-party consent. No statewide stop-and-identify law, but obstruction charges can occasionally occur if you actively hinder an officer." },
  "Washington": { recording: "Two-party consent", type: "two-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 40, details: "Requires all-party consent. No general stop-and-identify law." },
  "West Virginia": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No general stop-and-identify law." },
  "Wisconsin": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No statewide stop-and-identify statute." },
  "Wyoming": { recording: "One-party consent", type: "one-party", stopAndIdentify: "no", identifyRule: "No general stop & identify law.", threatScore: 15, details: "One-party consent. No statewide stop-and-identify statute." },
};

// Situations content
interface SituationInfo {
  id: string;
  title: string;
  emoji: string;
  description: string;
  script: string;
  checklist: string[];
  warning: string;
}

const SITUATIONS: SituationInfo[] = [
  {
    id: "traffic",
    title: "Pulled Over",
    emoji: "🚗",
    description: "You have been pulled over while driving a vehicle.",
    script: "Officer, I am keeping my hands on the wheel where they are visible. I am happy to provide my driver's license, registration, and insurance. However, I am exercising my right to remain silent, and I do not consent to any searches of myself, my passenger cabin, or my vehicle's trunk.",
    checklist: [
      "Pull over immediately and safely in a well-lit area.",
      "Turn off the engine, open your window, and turn on the dome light if it's dark.",
      "Place both hands clearly on the steering wheel.",
      "Provide license, registration, and proof of insurance when asked (legally required).",
      "Do NOT consent to a vehicle search ('I do not consent to a search').",
      "If the officer asks you to step out, do so calmly. Lock your doors as you exit.",
    ],
    warning: "Refusing to step out of the car when ordered is illegal. Comply with orders to exit, but continue to refuse consent to searches.",
  },
  {
    id: "door",
    title: "Police at Door",
    emoji: "🚪",
    description: "Officers are knocking or standing outside your home.",
    script: "Officer, I will not open the door. If you have a search warrant, please slide it under the door or hold it up to the window so I can inspect it. Otherwise, I am exercising my right to privacy and will not allow you inside without a warrant signed by a judge.",
    checklist: [
      "Keep the door closed. Do NOT open it to talk—speak through the door or a window.",
      "Ask clearly: 'Do you have a warrant signed by a judge?'",
      "If they say yes, have them slide it under the door or hold it to a window.",
      "Verify the warrant has your exact address, today's date, and a judge's signature.",
      "If they force entry, do NOT physically resist. Say loudly: 'I do not consent to this entry!' and document the officers' names and badge numbers.",
    ],
    warning: "Opening the door, even a crack, can be interpreted by courts as 'consent to enter' or allow officers to claim they smelled/saw something illegal.",
  },
  {
    id: "street",
    title: "Stopped on Street",
    emoji: "🛑",
    description: "An officer stops or detains you while walking in public.",
    script: "Officer, am I free to go, or am I being detained? If I am free to go, I will be on my way. If I am being detained, please state your reasonable articulable suspicion. I am invoking my right to remain silent and will not answer questions without an attorney.",
    checklist: [
      "Ask immediately: 'Am I free to go?'",
      "If free to go, walk away calmly. Do not run.",
      "If detained, ask: 'What is your reasonable suspicion?'",
      "Keep your hands visible and do not reach into pockets or make sudden movements.",
      "State clearly: 'I am exercising my right to remain silent.' You do not have to answer questions about where you are going or what you are doing.",
      "Check state guidelines below to see if you are legally required to provide your name/ID.",
    ],
    warning: "You can be patted down on the outside of your clothing if officers reasonably suspect you have a weapon. Say: 'I do not consent to a search, but I will not physically resist.'",
  },
  {
    id: "recording",
    title: "Recording Police",
    emoji: "📹",
    description: "You are documenting/filming officers or an incident in public.",
    script: "Officer, I have a constitutionally protected First Amendment right to record police officers performing their duties in public spaces. I am standing at a safe distance and am not interfering with your operations in any way.",
    checklist: [
      "Stand at a safe, non-obstructive distance (typically 10-15 feet away).",
      "Do NOT stand between officers and a suspect or interfere with their movements.",
      "Keep your hands visible; do not make sudden gestures with your phone.",
      "If ordered to move back, comply while continuing to record. Do not argue.",
      "Do NOT hide that you are recording; secret recording can violate wiretapping laws in two-party states.",
      "Lock your phone with a passcode, NOT biometric (FaceID/TouchID), so it cannot be forced open.",
    ],
    warning: "An officer cannot legally delete or inspect your footage without a warrant. If they seize your device, say: 'I do not consent to you searching my phone.'",
  },
  {
    id: "attorney",
    title: "Arrest/Detainment",
    emoji: "⚖️",
    description: "You have been placed under arrest or taken into custody.",
    script: "I am invoking my Fifth Amendment right to remain silent. I want to speak to an attorney immediately. I will not answer any questions, sign any documents, or make any statements without my lawyer present.",
    checklist: [
      "Do NOT resist physically, even if you believe the arrest is completely unlawful.",
      "Say nothing else. Do NOT engage in casual conversation, make excuses, or try to 'explain' yourself.",
      "Demand an attorney immediately and repeatedly: 'I want a lawyer.'",
      "Do NOT sign any statements, confession drafts, or waiver forms.",
      "If you are booked, you have a right to make local phone calls. Call a lawyer or trusted emergency contact.",
      "Do not talk about your case on jail phones—they are recorded.",
    ],
    warning: "Once you ask for an attorney, police must stop questioning you. If they continue, simply repeat: 'I want a lawyer, and I am staying silent.'",
  },
];

export function CrisisHUD() {
  const { state: activeState } = useJurisdiction();
  const { toast } = useToast();

  const [selectedSit, setSelectedSit] = useState<SituationInfo | null>(SITUATIONS[0]);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Retrieve current state threat info
  const stateInfo = activeState in STATE_THREAT_DATA ? STATE_THREAT_DATA[activeState] : null;

  // Copy speech script to clipboard
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Script Copied",
        description: "Ready to paste or read in emergency.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  // Text-To-Speech (TTS) script player using SpeechSynthesis
  const toggleSpeech = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast({
        title: "TTS Unusable",
        description: "Text-to-speech is not supported on this device.",
        variant: "destructive",
      });
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // clear previous
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.95; // slightly slower for high stress clarity
    u.onend = () => setIsPlaying(false);
    u.onerror = () => setIsPlaying(false);

    setSpeechUtterance(u);
    setIsPlaying(true);
    window.speechSynthesis.speak(u);
  };

  // Stop speech if we switch situations
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, [selectedSit]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Alert level colors
  const getAlertColor = (score: number) => {
    if (score <= 20) return "bg-green-500 hover:bg-green-600";
    if (score <= 35) return "bg-amber-500 hover:bg-amber-600";
    return "bg-red-500 hover:bg-red-600";
  };

  const getAlertLevelText = (score: number) => {
    if (score <= 20) return "Level: Standard Protections (Low Restrictiveness)";
    if (score <= 35) return "Level: Medium Restrictiveness (Stop-and-Identify / One-Party)";
    return "Level: High Restrictiveness (Two-Party / Stop-and-Identify)";
  };

  return (
    <section className="py-6 animate-fade-in">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            Civil Defense Command HUD
          </h2>
          <p className="text-sm text-muted-foreground">
            Instant tactical scripts, state-specific alerts, and emergency tools
          </p>
        </div>
        <Badge variant="outline" className="border-red-500/30 text-red-500 font-bold flex items-center gap-1.5 animate-pulse-slow">
          <ShieldAlert className="h-3.5 w-3.5" />
          Active Shield Mode
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
        {/* Main Interface Console */}
        <div className="space-y-6">
          {/* Situation Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {SITUATIONS.map((sit) => {
              const active = selectedSit?.id === sit.id;
              return (
                <button
                  key={sit.id}
                  onClick={() => setSelectedSit(sit)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                    active
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-[1.02] font-semibold"
                      : "border-border/60 bg-card/60 hover:bg-muted/50 hover:border-border"
                  }`}
                >
                  <span className="text-2xl mb-1.5">{sit.emoji}</span>
                  <span className="text-xs text-foreground truncate max-w-full">{sit.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Situation Terminal Panel */}
          {selectedSit && (
            <Card className="border-primary/20 bg-gradient-to-b from-card/90 to-background/90 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/10 via-primary to-primary/10" />

              <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedSit.emoji}</span>
                    <CardTitle className="text-lg font-black">{selectedSit.title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-0.5">
                    {selectedSit.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Tactical Plan
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Speaking Script Console (Large Readout) */}
                <div className="p-4 rounded-xl border border-border bg-black/40 text-green-400 font-mono text-sm relative group overflow-hidden">
                  <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      Read Aloud Script (Legal Formula)
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => toggleSpeech(selectedSit.script)}
                        className="h-7 w-7 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        title={isPlaying ? "Stop Speaking" : "Speak Script"}
                      >
                        {isPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy(selectedSit.script)}
                        className="h-7 w-7 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        title="Copy Script"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                  <p className="leading-relaxed select-all text-foreground dark:text-green-400">
                    "{selectedSit.script}"
                  </p>
                </div>

                {/* Checklist Section */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Immediate Physical Checklist
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedSit.checklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2.5 rounded-lg border border-border/50 bg-card/40 text-xs"
                      >
                        <input
                          type="checkbox"
                          id={`check-${selectedSit.id}-${idx}`}
                          className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                        />
                        <label htmlFor={`check-${selectedSit.id}-${idx}`} className="text-muted-foreground leading-tight cursor-pointer select-none">
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Legal Warning Banner */}
                {selectedSit.warning && (
                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-500 flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold uppercase tracking-wide">Critical Limit: </span>
                      {selectedSit.warning}
                    </div>
                  </div>
                )}

                {/* Live Actions Bar */}
                <div className="border-t border-border/40 pt-4 flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 font-bold" asChild>
                      <Link to="/do-this-now#golive">
                        <Video className="h-4 w-4 mr-1.5" />
                        Go Live / Cloud Backup
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-500/30 hover:bg-orange-500/10 text-orange-500 hover:text-orange-500" asChild>
                      <Link to="/do-this-now#location">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        Share Location
                      </Link>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/attorneys">
                        <Scale className="h-4 w-4 mr-1.5" />
                        Attorney Map
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                      <Link to="/do-this-now#report">
                        <FileText className="h-4 w-4 mr-1.5" />
                        Draft Report
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dynamic State Shield Panel */}
        <div className="space-y-4">
          <Card className="border-primary/20 bg-card/60 backdrop-blur-sm h-full flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-primary" />
                  Jurisdiction Shield
                </CardTitle>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {activeState === DEFAULT_JURISDICTION ? "Federal Baseline" : activeState}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Analyzing civil liberty risks in your current area
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {stateInfo ? (
                <>
                  {/* Threat Level Index */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground">Restrictiveness Index</span>
                      <span className="font-mono text-muted-foreground">{stateInfo.threatScore}/100</span>
                    </div>
                    <div className="relative">
                      <Progress value={stateInfo.threatScore} className="h-2.5 bg-muted" />
                      {/* Floating Indicator */}
                      <span
                        className={`absolute top-0 -mt-1 h-4 w-4 rounded-full border-2 border-background ${getAlertColor(
                          stateInfo.threatScore
                        )}`}
                        style={{ left: `calc(${stateInfo.threatScore}% - 8px)` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-snug">
                      {getAlertLevelText(stateInfo.threatScore)}
                    </p>
                  </div>

                  {/* Quick Rule Badges */}
                  <div className="grid grid-cols-2 gap-2 text-center pt-1">
                    <div className="p-2 rounded-lg border border-border/50 bg-card/30">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Recording Consent</p>
                      <p className="text-xs font-black text-foreground mt-0.5">{stateInfo.recording}</p>
                    </div>
                    <div className="p-2 rounded-lg border border-border/50 bg-card/30">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Stop &amp; Identify</p>
                      <p className="text-xs font-black text-foreground mt-0.5">
                        {stateInfo.stopAndIdentify === "yes"
                          ? "Required"
                          : stateInfo.stopAndIdentify === "no"
                          ? "Not Required"
                          : "Arrest Only"}
                      </p>
                    </div>
                  </div>

                  {/* Identification Rule Details */}
                  <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs">
                    <h5 className="font-bold text-foreground mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      ID Obligation
                    </h5>
                    <p className="text-muted-foreground leading-snug">
                      {stateInfo.identifyRule}
                    </p>
                  </div>

                  {/* Full Details */}
                  <div className="p-3 rounded-lg border border-border/40 bg-card/30 text-xs">
                    <p className="text-muted-foreground leading-relaxed">
                      {stateInfo.details}
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground space-y-3">
                  <BookOpen className="h-8 w-8 mx-auto text-primary opacity-60" />
                  <div className="text-xs">
                    <p className="font-semibold text-foreground">Federal baseline active.</p>
                    <p className="mt-1 leading-relaxed">
                      Select your state in the location selector above to load localized civil defense index and police-interaction rules.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <div className="p-4 border-t border-border/40 bg-muted/10 text-center">
              <Link to="/rights" className="text-xs text-primary hover:underline font-semibold flex items-center justify-center gap-1">
                View Full State Rights Library
                <span className="text-xs font-normal">→</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
