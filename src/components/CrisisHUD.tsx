import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { SITUATIONS } from "@/data/situations";
import type { SituationInfo } from "@/data/situations";
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
  FileText,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const FEDERAL_REFERENCES: Partial<Record<string, { label: string; url: string }>> = {
  traffic: {
    label: "Pennsylvania v. Mimms, 434 U.S. 106 (1977)",
    url: "https://www.law.cornell.edu/supremecourt/text/434/106",
  },
  street: {
    label: "Terry v. Ohio, 392 U.S. 1 (1968)",
    url: "https://www.law.cornell.edu/supremecourt/text/392/1",
  },
  recording: {
    label: "Riley v. California, 573 U.S. 373 (2014)",
    url: "https://www.law.cornell.edu/supremecourt/text/13-132",
  },
  attorney: {
    label: "Edwards v. Arizona, 451 U.S. 477 (1981)",
    url: "https://www.law.cornell.edu/supremecourt/text/451/477",
  },
};

export function CrisisHUD() {
  const { state: activeState } = useJurisdiction();
  const { toast } = useToast();
  const [selectedSit, setSelectedSit] = useState<SituationInfo | null>(SITUATIONS[0]);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "Copied", description: "The suggested wording is ready to paste or read." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy Failed", description: "Please select and copy manually.", variant: "destructive" });
    }
  };

  const toggleSpeech = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast({ title: "Text-to-speech unavailable", description: "This device does not support speech synthesis.", variant: "destructive" });
      return;
    }
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [selectedSit]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const source = selectedSit ? FEDERAL_REFERENCES[selectedSit.id] : null;

  return (
    <section className="py-6 animate-fade-in">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
            </span>
            Civil Defense Command HUD
          </h2>
          <p className="text-sm text-muted-foreground">
            General U.S. encounter references, documentation tools, and safety-oriented checklists. State and local rules can differ.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-red-500/30 text-red-500 font-bold flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5" />
          Reference Mode
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-6">
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

          {selectedSit && (
            <Card className="border-primary/20 bg-gradient-to-b from-card/90 to-background/90 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/10 via-primary to-primary/10" />
              <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedSit.emoji}</span>
                    <CardTitle className="text-lg font-black">{selectedSit.title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-0.5">{selectedSit.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  General Reference
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl border border-border bg-black/40 font-mono text-sm relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1.5">
                      Suggested words — not a legal formula
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button size="icon" variant="ghost" onClick={() => toggleSpeech(selectedSit.script)} className="h-7 w-7 text-green-400 hover:text-green-300 hover:bg-green-500/10" title={isPlaying ? "Stop speaking" : "Read aloud"}>
                        {isPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleCopy(selectedSit.script)} className="h-7 w-7 text-green-400 hover:text-green-300 hover:bg-green-500/10" title="Copy wording">
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>
                  <p className="leading-relaxed select-all text-foreground dark:text-green-400">“{selectedSit.script}”</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Practical Checklist
                  </h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedSit.checklist.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg border border-border/50 bg-card/40 text-xs">
                        <input type="checkbox" id={`check-${selectedSit.id}-${idx}`} className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer" />
                        <label htmlFor={`check-${selectedSit.id}-${idx}`} className="text-muted-foreground leading-tight cursor-pointer select-none">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSit.warning && (
                  <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                    <div className="space-y-2">
                      <p className="text-muted-foreground leading-relaxed">{selectedSit.warning}</p>
                      {source && (
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                          Federal case reference: {source.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="border-t border-border/40 pt-4 flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 font-bold" asChild>
                      <Link to="/do-this-now#golive"><Video className="h-4 w-4 mr-1.5" />Go Live / Cloud Backup</Link>
                    </Button>
                    <Button size="sm" variant="outline" className="border-orange-500/30 hover:bg-orange-500/10 text-orange-500 hover:text-orange-500" asChild>
                      <Link to="/do-this-now#location"><MapPin className="h-4 w-4 mr-1.5" />Share Location</Link>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/rights"><BookOpen className="h-4 w-4 mr-1.5" />Rights References</Link>
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                      <Link to="/do-this-now#report"><FileText className="h-4 w-4 mr-1.5" />Draft Report</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="border-amber-500/25 bg-card/60 backdrop-blur-sm h-full flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-primary" />
                  Jurisdiction Review
                </CardTitle>
                <Badge variant="outline" className="border-primary/30 text-primary">{activeState}</Badge>
              </div>
              <CardDescription className="text-xs">State-specific legal summaries are being re-checked against current primary authority.</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold">50-state risk scores are temporarily disabled.</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      The previous “restrictiveness index,” recording-consent labels, and stop-and-identify labels did not carry sufficient per-state source provenance. They will return only after each rule is linked to current statutes or controlling case law.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground mb-1">Current standard</p>
                <p>
                  Use the encounter cards as general federal-reference material, not a substitute for jurisdiction-specific legal advice. Where a card states a federal rule, it links to the cited case.
                </p>
              </div>
            </CardContent>

            <div className="p-4 border-t border-border/40 bg-muted/10 text-center">
              <Link to="/rights" className="text-xs text-primary hover:underline font-semibold flex items-center justify-center gap-1">
                Review Rights Reference Library <span className="text-xs font-normal">→</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
