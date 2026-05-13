/**
 * SocialContentStudio.tsx
 * AI-powered social media content generator for civil rights advocacy.
 * Generates threads, accountability cards, campaign posts, appeal updates, etc.
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Twitter, Copy, Share2, Sparkles, FileText, BarChart2,
  Megaphone, CheckCircle, XCircle, RefreshCw, Download,
  Hash, ExternalLink, Clock, Zap, ChevronRight, Globe,
  Instagram, Facebook, Linkedin, AlertTriangle, Trophy
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FOIARequest {
  id: string;
  agency_name: string;
  request_subject: string;
  status: string;
  submitted_date: string | null;
  response_received_date: string | null;
  response_deadline: string | null;
  appeal_filed: boolean;
  denial_reason?: string | null;
}

interface GeneratedContent {
  type: string;
  platform: string;
  title: string;
  text: string;
  hashtags: string[];
  cta?: string;
}

// ─── Template generators (client-side AI simulation) ─────────────────────────
function generateThread(req: FOIARequest): GeneratedContent {
  const agency = req.agency_name;
  const subject = req.request_subject;
  const statusMap: Record<string, string> = {
    fulfilled: "🎉 WON",
    denied: "❌ DENIED",
    pending: "⏳ WAITING",
    overdue: "🚨 OVERDUE",
    submitted: "📬 FILED",
    appeal_filed: "⚖️ APPEALING",
  };
  const statusLabel = statusMap[req.status] || req.status.toUpperCase();

  const tweets = [
    `🧵 THREAD: I filed a public records request with ${agency} and here's what happened. ${statusLabel}`,
    `1/ On ${req.submitted_date ? new Date(req.submitted_date).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'}) : "recently"}, I submitted a FOIA/public records request to ${agency} asking for: "${subject}"`,
    req.status === "fulfilled"
      ? `2/ ${agency} responded and FULFILLED the request. Here's what the documents revealed 👇`
      : req.status === "denied"
      ? `2/ ${agency} DENIED the request. Government agencies can't just hide public records. Here's what I'm doing about it 👇`
      : req.status === "overdue"
      ? `2/ It's been over the legal deadline and ${agency} has NOT responded. Under the law, silence is a violation. Here's what that means 👇`
      : `2/ ${agency} has ${req.status === "pending" ? "not yet responded" : "responded"}. Here's the current status of this request 👇`,
    `3/ Why does this matter? Because public records are YOUR records. ${agency} is funded by taxpayers. Transparency isn't optional — it's the law. 📜`,
    `4/ Want to file your own request with ${agency}? You can do it at CivilRightsHub.org — free, tracked, and automated. 🔗 #FOIA #PublicRecords #Transparency`,
    `5/ Follow for updates on this request and others. If you think this information should be public, RT to spread the word. 🔁`,
  ];

  return {
    type: "thread",
    platform: "twitter",
    title: `FOIA Thread — ${agency}`,
    text: tweets.join("\n\n---\n\n"),
    hashtags: ["FOIA", "PublicRecords", "Transparency", "CivilRights", agency.replace(/\s+/g, "")],
    cta: "Copy all tweets",
  };
}

function generateAccountabilityCard(req: FOIARequest, agencyStats?: { denial_rate: number; avg_response_days: number; total_requests: number; transparency_score: number }): GeneratedContent {
  const agency = req.agency_name;
  const score = agencyStats?.transparency_score ?? 0;
  const denial = agencyStats?.denial_rate ?? 0;
  const avgDays = agencyStats?.avg_response_days ?? 0;
  const total = agencyStats?.total_requests ?? 0;

  const grade = score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : score >= 20 ? "D" : "F";

  return {
    type: "accountability_card",
    platform: "all",
    title: `${agency} Transparency Report`,
    text: `📊 TRANSPARENCY REPORT: ${agency.toUpperCase()}\n\nGrade: ${grade} (${score}/100)\n\n` +
      `📋 Total public records requests: ${total}\n` +
      `❌ Denial rate: ${denial.toFixed(1)}%\n` +
      `⏱️ Avg response time: ${avgDays ? avgDays.toFixed(0) + " days" : "Unknown"}\n\n` +
      `Your government. Your records. Your right to know.\n\n` +
      `Data via @CivilRightsHub | File your own request: civilrightshub.org/public-records`,
    hashtags: ["Accountability", "FOIA", "Transparency", "OpenGovernment", agency.replace(/\s+/g, "")],
  };
}

function generateAppealPost(req: FOIARequest): GeneratedContent {
  return {
    type: "appeal_update",
    platform: "twitter",
    title: `Appeal Filed — ${req.agency_name}`,
    text: `⚖️ UPDATE: I've filed a formal appeal after ${req.agency_name} denied my public records request for "${req.request_subject}."\n\nDenials don't end the process — they start a new one. Here's what the appeal process looks like and why I'm fighting this:\n\n📌 Under FOIA law, agencies must provide a written denial with a specific legal exemption. Vague denials are challengeable.\n\n📌 Appeals must be decided within 20 business days for federal agencies.\n\n📌 If the appeal fails, I can pursue litigation or file with the appropriate oversight body.\n\nWill keep you posted. 🧵 #FOIA #Appeal #Transparency`,
    hashtags: ["FOIA", "Appeal", "PublicRecords", "Transparency", "OpenGovernment"],
  };
}

function generateVictoryPost(req: FOIARequest): GeneratedContent {
  return {
    type: "victory_post",
    platform: "all",
    title: `Victory — Records Released by ${req.agency_name}`,
    text: `🎉 VICTORY: After filing a public records request, ${req.agency_name} has released documents about "${req.request_subject}."\n\nThis is what transparency looks like. Every record released is a win for accountability. 📂\n\nYou have the right to know what your government is doing. File your own request at CivilRightsHub.org — it takes 2 minutes and it's free.\n\n#FOIA #PublicRecords #OpenGovernment #CivilRights #Transparency`,
    hashtags: ["FOIA", "Victory", "PublicRecords", "OpenGovernment", "Transparency"],
  };
}

function generateDenialAlert(req: FOIARequest): GeneratedContent {
  return {
    type: "denial_alert",
    platform: "twitter",
    title: `Denial Alert — ${req.agency_name}`,
    text: `🚨 DENIAL ALERT: ${req.agency_name} just denied a public records request for "${req.request_subject}."\n\nThis is a pattern. Government agencies deny records to hide misconduct, mismanagement, and wrongdoing.\n\n❓ What are they hiding?\n📋 The denial has been logged in the CivilRightsHub public database.\n⚖️ An appeal is being prepared.\n\nRT to hold them accountable. 🔁\n\nTrack this case: civilrightshub.org/public-records #FOIA #Denied #Accountability`,
    hashtags: ["FOIA", "Denied", "Accountability", "Transparency", req.agency_name.replace(/\s+/g, "")],
  };
}

// ─── Platform icons ───────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "twitter", label: "X / Twitter", icon: Twitter, charLimit: 280, threadNote: "Split into thread" },
  { id: "instagram", label: "Instagram", icon: Instagram, charLimit: 2200, threadNote: "Single caption" },
  { id: "facebook", label: "Facebook", icon: Facebook, charLimit: 63000, threadNote: "Post" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, charLimit: 3000, threadNote: "Article" },
];

const CONTENT_TYPES = [
  { id: "thread", label: "🧵 FOIA Thread", desc: "Turn a request into a full Twitter thread", icon: Twitter },
  { id: "accountability_card", label: "📊 Accountability Card", desc: "Agency transparency report card to share", icon: BarChart2 },
  { id: "victory_post", label: "🎉 Victory Post", desc: "Celebrate a fulfilled request", icon: Trophy },
  { id: "denial_alert", label: "🚨 Denial Alert", desc: "Expose a denied request publicly", icon: AlertTriangle },
  { id: "appeal_update", label: "⚖️ Appeal Update", desc: "Share that you're fighting back", icon: Zap },
  { id: "campaign_post", label: "📢 Campaign Post", desc: "Rally others to file the same request", icon: Megaphone },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SocialContentStudio() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FOIARequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<FOIARequest | null>(null);
  const [selectedType, setSelectedType] = useState<string>("thread");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("twitter");
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [editedText, setEditedText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState<any[]>([]);
  const [customContext, setCustomContext] = useState("");
  const [agencyStats, setAgencyStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"create" | "saved">("create");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("foia_requests")
      .select("id, agency_name, request_subject, status, submitted_date, response_received_date, response_deadline, appeal_filed")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRequests(data || []));

    supabase.from("social_content_studio")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setSaved(data || []));
  }, [user]);

  const loadAgencyStats = async (req: FOIARequest) => {
    const { data } = await supabase
      .from("foia_agencies")
      .select("transparency_score, denial_rate, avg_response_days, total_requests")
      .ilike("name", req.agency_name)
      .single();
    if (data) setAgencyStats(data);
  };

  const handleGenerate = async () => {
    if (!selectedRequest) { toast.error("Select a FOIA request first"); return; }
    setGenerating(true);
    await loadAgencyStats(selectedRequest);

    await new Promise(r => setTimeout(r, 800)); // brief delay for UX

    let content: GeneratedContent;
    switch (selectedType) {
      case "thread": content = generateThread(selectedRequest); break;
      case "accountability_card": content = generateAccountabilityCard(selectedRequest, agencyStats); break;
      case "victory_post": content = generateVictoryPost(selectedRequest); break;
      case "denial_alert": content = generateDenialAlert(selectedRequest); break;
      case "appeal_update": content = generateAppealPost(selectedRequest); break;
      case "campaign_post":
        content = {
          type: "campaign_post", platform: selectedPlatform,
          title: `Campaign: File With ${selectedRequest.agency_name}`,
          text: `📢 CALLING ALL ACTIVISTS: We need YOUR help holding ${selectedRequest.agency_name} accountable.\n\nI've filed a public records request for "${selectedRequest.request_subject}" — and you should too.\n\nWhen dozens of people file the same request, agencies CAN'T ignore us. There's power in numbers.\n\n👉 File YOUR request in 2 minutes: civilrightshub.org/public-records\n\nTag someone who should know about this. RT to spread the word. 🔁\n\n#FOIA #PublicRecords #Accountability #CivilRights`,
          hashtags: ["FOIA", "PublicRecords", "Accountability", "CivilRights"],
        };
        break;
      default: content = generateThread(selectedRequest);
    }

    // Add custom context if provided
    if (customContext.trim()) {
      content.text += `\n\n📌 Additional context: ${customContext.trim()}`;
    }

    setGenerated(content);
    setEditedText(content.text);
    setGenerating(false);
  };

  const handleSave = async () => {
    if (!user || !generated) return;
    const { error } = await supabase.from("social_content_studio").insert({
      user_id: user.id,
      content_type: generated.type,
      title: generated.title,
      generated_text: editedText,
      platform: selectedPlatform,
      reference_type: "foia_request",
      reference_id: selectedRequest?.id,
      hashtags: generated.hashtags,
      status: "draft",
    });
    if (!error) {
      toast.success("Saved to your content library!");
      const { data } = await supabase.from("social_content_studio").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
      setSaved(data || []);
    }
  };

  const copyTweet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(editedText);
    toast.success("Copied to clipboard!");
  };

  // Split thread into individual tweets
  const tweets = editedText.split("\n\n---\n\n").filter(Boolean);
  const isThread = selectedType === "thread" && tweets.length > 1;

  if (!user) return (
    <Card><CardContent className="py-8 text-center text-muted-foreground">Sign in to use the Social Content Studio</CardContent></Card>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Social Content Studio
          </h2>
          <p className="text-sm text-muted-foreground">Turn your FOIA results into viral accountability content</p>
        </div>
        <div className="flex gap-2">
          <Button variant={activeTab === "create" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("create")}>
            <Sparkles className="h-3.5 w-3.5 mr-1" /> Create
          </Button>
          <Button variant={activeTab === "saved" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("saved")}>
            <FileText className="h-3.5 w-3.5 mr-1" /> Saved ({saved.length})
          </Button>
        </div>
      </div>

      {activeTab === "saved" ? (
        <div className="space-y-3">
          {saved.length === 0 && (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No saved content yet. Create your first post!</CardContent></Card>
          )}
          {saved.map(item => (
            <Card key={item.id}>
              <CardContent className="py-3 px-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()} · {item.platform} · {item.content_type.replace("_"," ")}</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => { setEditedText(item.generated_text); setActiveTab("create"); }}>
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 bg-muted rounded p-2">{item.generated_text?.slice(0,200)}…</p>
                <div className="flex gap-1 flex-wrap">
                  {(item.hashtags || []).map((h: string) => (
                    <span key={h} className="text-xs text-primary">#{h}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Left: Builder */}
          <div className="space-y-4">
            {/* Step 1: Pick request */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> 1. Select a FOIA Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={id => {
                  const r = requests.find(r => r.id === id);
                  setSelectedRequest(r || null);
                  setGenerated(null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder={requests.length === 0 ? "No requests yet" : "Choose a request…"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {requests.map(r => (
                      <SelectItem key={r.id} value={r.id}>
                        <div>
                          <span className="font-medium">{r.agency_name}</span>
                          <span className="text-xs text-muted-foreground ml-2">— {r.request_subject?.slice(0,40)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRequest && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">{selectedRequest.status}</Badge>
                    {selectedRequest.submitted_date && (
                      <Badge variant="outline" className="text-xs">Filed {new Date(selectedRequest.submitted_date).toLocaleDateString()}</Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Content type */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> 2. Choose Content Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {CONTENT_TYPES.map(ct => {
                    const Icon = ct.icon;
                    return (
                      <button
                        key={ct.id}
                        onClick={() => { setSelectedType(ct.id); setGenerated(null); }}
                        className={`p-2.5 rounded-lg border text-left transition-all ${selectedType === ct.id ? "border-primary bg-primary/10" : "hover:bg-muted"}`}
                      >
                        <p className="text-xs font-semibold">{ct.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{ct.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Platform */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" /> 3. Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {PLATFORMS.map(p => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPlatform(p.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${selectedPlatform === p.id ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted"}`}
                      >
                        <Icon className="h-3.5 w-3.5" /> {p.label}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Optional context */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">4. Add Context (optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any specific facts, quotes, or context you want included in the post…"
                  value={customContext}
                  onChange={e => setCustomContext(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </CardContent>
            </Card>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={!selectedRequest || generating}
            >
              {generating
                ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Generating…</>
                : <><Sparkles className="h-4 w-4 mr-2" /> Generate Content</>
              }
            </Button>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4">
            {!generated ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center space-y-3">
                  <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-medium">Your content will appear here</p>
                  <p className="text-xs text-muted-foreground">Select a request, choose a content type, and hit Generate</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{generated.title}</CardTitle>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" onClick={copyAll}>
                          <Copy className="h-3.5 w-3.5 mr-1" /> Copy All
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                          <Download className="h-3.5 w-3.5 mr-1" /> Save
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {generated.hashtags.map(h => (
                        <span key={h} className="text-xs text-primary font-medium">#{h}</span>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isThread ? (
                      <div className="space-y-3">
                        {tweets.map((tweet, idx) => (
                          <div key={idx} className="border rounded-lg p-3 bg-muted/30 relative group">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex gap-2 items-start flex-1">
                                <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded shrink-0">{idx + 1}/{tweets.length}</span>
                                <p className="text-sm whitespace-pre-wrap flex-1">{tweet}</p>
                              </div>
                              <button
                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                onClick={() => copyTweet(tweet, idx)}
                              >
                                {copiedIdx === idx
                                  ? <CheckCircle className="h-4 w-4 text-green-500" />
                                  : <Copy className="h-4 w-4 text-muted-foreground" />
                                }
                              </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1 text-right">
                              {tweet.length}/280 chars
                              {tweet.length > 280 && <span className="text-red-500 font-medium"> (too long)</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Textarea
                        value={editedText}
                        onChange={e => setEditedText(e.target.value)}
                        rows={12}
                        className="text-sm font-mono"
                      />
                    )}

                    {/* Platform share buttons */}
                    <div className="flex gap-2 pt-2 border-t flex-wrap">
                      <p className="text-xs text-muted-foreground w-full">Share directly:</p>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweets[0] || editedText.slice(0,280))}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <Twitter className="h-3.5 w-3.5" /> Tweet
                        </Button>
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=https://civilrightshub.org/public-records&quote=${encodeURIComponent(editedText.slice(0,500))}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <Facebook className="h-3.5 w-3.5" /> Share
                        </Button>
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=https://civilrightshub.org/public-records&summary=${encodeURIComponent(editedText.slice(0,500))}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline" className="gap-1.5">
                          <Linkedin className="h-3.5 w-3.5" /> Post
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>

                {/* Regenerate */}
                <Button variant="outline" className="w-full" onClick={handleGenerate} disabled={generating}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Regenerate
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
