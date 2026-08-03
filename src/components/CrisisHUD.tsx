import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION } from "@/data/usStates";
import { STATE_THREAT_DATA } from "@/data/stateThreatData";
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
  Scale,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export function CrisisHUD() {
  const { state: activeState } = useJurisdiction();
  const { toast } = useToast();

  const [selectedSit, setSelectedSit] = useState<SituationInfo | null>(SITUATIONS[0]);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const stateInfo = activeState in STATE_THREAT_DATA ? STATE_THREAT_DATA[activeState] : null;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "Script Copied", description: "Ready to paste or read in emergency." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy Failed", description: "Please select and copy manually.", variant: "destructive" });
    }
  };

  const toggleSpeech = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast({ title: "TTS Unusable", description: "Text-to-speech is not supported on this device.", variant: "destructive" });
      return;
    }
    if (isPlaying) { window.speechSynthesis.cancel(); setIsPlaying(false); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.95;
    u.onend = () => setIsPlaying(false);
    u.onerror = () => setIsPlaying(false);
    setSpeechUtterance(u);
    setIsPlaying(true);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [selectedSit]);

  useEffect(() => {
    return () => { if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, []);

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
                  <CardDescription className="text-xs mt-0.5">
                    {selectedSit.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Tactical Plan
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    Immediate Physical Checklist
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
                  <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-500 flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold uppercase tracking-wide">Critical Limit: </span>
                      {selectedSit.warning}
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
                      <Link to="/attorneys"><Scale className="h-4 w-4 mr-1.5" />Attorney Map</Link>
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
              <CardDescription className="text-xs">Analyzing civil liberty risks in your current area</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              {stateInfo ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground">Restrictiveness Index</span>
                      <span className="font-mono text-muted-foreground">{stateInfo.threatScore}/100</span>
                    </div>
                    <div className="relative">
                      <Progress value={stateInfo.threatScore} className="h-2.5 bg-muted" />
                      <span className={`absolute top-0 -mt-1 h-4 w-4 rounded-full border-2 border-background ${getAlertColor(stateInfo.threatScore)}`} style={{ left: `calc(${stateInfo.threatScore}% - 8px)` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-snug">{getAlertLevelText(stateInfo.threatScore)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center pt-1">
                    <div className="p-2 rounded-lg border border-border/50 bg-card/30">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Recording Consent</p>
                      <p className="text-xs font-black text-foreground mt-0.5">{stateInfo.recording}</p>
                    </div>
                    <div className="p-2 rounded-lg border border-border/50 bg-card/30">
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Stop &amp; Identify</p>
                      <p className="text-xs font-black text-foreground mt-0.5">
                        {stateInfo.stopAndIdentify === "yes" ? "Required" : stateInfo.stopAndIdentify === "no" ? "Not Required" : "Arrest Only"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border bg-muted/30 text-xs">
                    <h5 className="font-bold text-foreground mb-1 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      ID Obligation
                    </h5>
                    <p className="text-muted-foreground leading-snug">{stateInfo.identifyRule}</p>
                  </div>

                  <div className="p-3 rounded-lg border border-border/40 bg-card/30 text-xs">
                    <p className="text-muted-foreground leading-relaxed">{stateInfo.details}</p>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground space-y-3">
                  <BookOpen className="h-8 w-8 mx-auto text-primary opacity-60" />
                  <div className="text-xs">
                    <p className="font-semibold text-foreground">Federal baseline active.</p>
                    <p className="mt-1 leading-relaxed">Select your state in the location selector above to load localized civil defense index and police-interaction rules.</p>
                  </div>
                </div>
              )}
            </CardContent>

            <div className="p-4 border-t border-border/40 bg-muted/10 text-center">
              <Link to="/rights" className="text-xs text-primary hover:underline font-semibold flex items-center justify-center gap-1">
                View Full State Rights Library <span className="text-xs font-normal">→</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
