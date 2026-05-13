/**
 * FOIACampaigns.tsx
 * Collaborative mass-filing campaigns — one template filed to many agencies at once.
 * Users can join existing campaigns or start their own.
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Megaphone, Users, FileText, Plus, ChevronRight, CheckCircle,
  RefreshCw, Share2, Twitter, Copy, ArrowLeft, Hash, Zap,
  Building2, Globe, TrendingUp, Clock
} from "lucide-react";

interface Campaign {
  id: string;
  created_by: string;
  title: string;
  description: string;
  hashtag: string;
  request_subject: string;
  request_body: string;
  target_agency_names: string[];
  participant_count: number;
  request_count: number;
  status: string;
  featured: boolean;
  created_at: string;
}

interface CampaignParticipant {
  campaign_id: string;
  requests_filed: number;
}

export default function FOIACampaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [myParticipation, setMyParticipation] = useState<CampaignParticipant[]>([]);
  const [view, setView] = useState<"browse" | "create" | "detail">("browse");
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [filing, setFiling] = useState(false);

  // Create form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newHashtag, setNewHashtag] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newAgencies, setNewAgencies] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("foia_campaigns")
      .select("*")
      .eq("status", "active")
      .order("featured", { ascending: false })
      .order("participant_count", { ascending: false });
    setCampaigns(data || []);

    if (user) {
      const { data: parts } = await supabase
        .from("foia_campaign_participants")
        .select("campaign_id, requests_filed")
        .eq("user_id", user.id);
      setMyParticipation(parts || []);
    }
    setLoading(false);
  };

  const joinAndFile = async (campaign: Campaign) => {
    if (!user) { toast.error("Sign in to join campaigns"); return; }
    setFiling(true);
    try {
      const agencies = campaign.target_agency_names.length > 0
        ? campaign.target_agency_names
        : ["All Relevant Agencies"];

      // File a request for the first agency (or a general one if no specific targets)
      const targetAgency = agencies[0];
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 20);

      const { error: reqError } = await supabase.from("foia_requests").insert({
        user_id: user.id,
        agency_name: targetAgency,
        agency_type: "Federal",
        state: "Federal",
        request_subject: campaign.request_subject,
        request_body: campaign.request_body.replace("[YOUR_NAME]", user.user_metadata?.full_name || "").replace("[YOUR_EMAIL]", user.email || ""),
        status: "draft",
        campaign_id: campaign.id,
        priority: "normal",
        follow_up_count: 0,
        appeal_filed: false,
        response_deadline: deadline.toISOString(),
      });
      if (reqError) throw reqError;

      // Upsert participation
      const { error: partError } = await supabase.from("foia_campaign_participants").upsert({
        campaign_id: campaign.id,
        user_id: user.id,
        requests_filed: 1,
        joined_at: new Date().toISOString(),
      }, { onConflict: "campaign_id,user_id" });

      // Increment counters
      await supabase.from("foia_campaigns").update({
        participant_count: campaign.participant_count + 1,
        request_count: campaign.request_count + 1,
      }).eq("id", campaign.id);

      toast.success("Joined campaign & request created as draft!", {
        description: "Review it in your Public Records tracker, then send when ready.",
        duration: 5000,
      });
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to join campaign");
    } finally {
      setFiling(false);
    }
  };

  const createCampaign = async () => {
    if (!user) { toast.error("Sign in to create campaigns"); return; }
    if (!newTitle.trim() || !newSubject.trim() || !newBody.trim()) {
      toast.error("Title, subject, and request body are required");
      return;
    }
    setCreating(true);
    try {
      const agencies = newAgencies.split("\n").map(a => a.trim()).filter(Boolean);
      const hashtag = newHashtag.trim().replace(/^#/, "");
      const { error } = await supabase.from("foia_campaigns").insert({
        created_by: user.id,
        title: newTitle.trim(),
        description: newDesc.trim(),
        hashtag,
        request_subject: newSubject.trim(),
        request_body: newBody.trim(),
        target_agency_names: agencies,
        status: "active",
        is_public: true,
      });
      if (error) throw error;
      toast.success("Campaign launched! Others can now join and file.", { duration: 5000 });
      setView("browse");
      setNewTitle(""); setNewDesc(""); setNewHashtag(""); setNewSubject(""); setNewBody(""); setNewAgencies("");
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to create campaign");
    } finally {
      setCreating(false);
    }
  };

  const isParticipating = (id: string) => myParticipation.some(p => p.campaign_id === id);

  const shareCampaign = (campaign: Campaign) => {
    const text = `I just filed a public records request as part of the "${campaign.title}" campaign on @CivilRightsHub. Join me — ${campaign.participant_count + 1} people are already demanding answers. civilrightshub.org/public-records${campaign.hashtag ? ` #${campaign.hashtag}` : ""}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (view === "create") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setView("browse")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h2 className="font-semibold">Launch a Campaign</h2>
            <p className="text-xs text-muted-foreground">Rally others to file the same request</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Campaign Info</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Campaign Title *</Label>
                  <Input placeholder="e.g. Demand ICE Detention Records" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea placeholder="What are you trying to uncover and why does it matter?" value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3} className="text-sm" />
                </div>
                <div>
                  <Label className="text-xs">Hashtag (optional)</Label>
                  <div className="relative">
                    <Hash className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-8" placeholder="ICEFOIABlitz" value={newHashtag} onChange={e => setNewHashtag(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Target Agencies (one per line, optional)</Label>
                  <Textarea
                    placeholder={"FBI\nDepartment of Homeland Security\nICE"}
                    value={newAgencies}
                    onChange={e => setNewAgencies(e.target.value)}
                    rows={4} className="text-sm font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Leave blank to let participants choose their own agency</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Request Template</CardTitle>
                <CardDescription className="text-xs">This is the request that participants will file. Use [YOUR_NAME] and [YOUR_EMAIL] as placeholders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Subject / Records Being Requested *</Label>
                  <Input placeholder="e.g. All records related to detainee transfers..." value={newSubject} onChange={e => setNewSubject(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Request Body *</Label>
                  <Textarea
                    placeholder={"Dear Records Officer,\n\nPursuant to the Freedom of Information Act...\n\nI, [YOUR_NAME], hereby request...\n\nSincerely,\n[YOUR_NAME]\n[YOUR_EMAIL]"}
                    value={newBody}
                    onChange={e => setNewBody(e.target.value)}
                    rows={10} className="text-sm font-mono"
                  />
                </div>
              </CardContent>
            </Card>
            <Button className="w-full" onClick={createCampaign} disabled={creating}>
              {creating ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Launching…</> : <><Megaphone className="h-4 w-4 mr-2" /> Launch Campaign</>}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" /> Campaigns
          </h2>
          <p className="text-sm text-muted-foreground">Join forces with other activists — file together, win together</p>
        </div>
        <Button onClick={() => setView("create")}>
          <Plus className="h-4 w-4 mr-2" /> Start Campaign
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active Campaigns", value: campaigns.length, icon: Megaphone },
          { label: "Total Participants", value: campaigns.reduce((s, c) => s + c.participant_count, 0), icon: Users },
          { label: "Requests Filed", value: campaigns.reduce((s, c) => s + c.request_count, 0), icon: FileText },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <Icon className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">Loading campaigns…</div>
      ) : campaigns.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center space-y-3">
            <Megaphone className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="font-medium">No active campaigns yet</p>
            <p className="text-sm text-muted-foreground">Be the first to launch a campaign and rally others</p>
            <Button onClick={() => setView("create")}><Plus className="h-4 w-4 mr-2" /> Start First Campaign</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map(campaign => {
            const joined = isParticipating(campaign.id);
            return (
              <Card key={campaign.id} className={`transition-all ${campaign.featured ? "border-primary" : ""}`}>
                <CardContent className="py-4 px-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {campaign.featured && <Badge className="text-xs">Featured</Badge>}
                        {joined && <Badge variant="secondary" className="text-xs flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Joined</Badge>}
                        {campaign.hashtag && <span className="text-xs text-primary font-medium">#{campaign.hashtag}</span>}
                      </div>
                      <h3 className="font-semibold">{campaign.title}</h3>
                      {campaign.description && <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>}

                      {/* Target agencies */}
                      {campaign.target_agency_names.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          {campaign.target_agency_names.slice(0, 3).map(a => (
                            <span key={a} className="text-xs bg-muted px-2 py-0.5 rounded-full">{a}</span>
                          ))}
                          {campaign.target_agency_names.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{campaign.target_agency_names.length - 3} more</span>
                          )}
                        </div>
                      )}

                      {/* Progress */}
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" /> <strong className="text-foreground">{campaign.participant_count}</strong> participants
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" /> <strong className="text-foreground">{campaign.request_count}</strong> requests filed
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(campaign.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Progress bar */}
                      {campaign.request_count > 0 && (
                        <div className="space-y-1">
                          <Progress value={Math.min(100, (campaign.request_count / 100) * 100)} className="h-1.5" />
                          <p className="text-[10px] text-muted-foreground">{campaign.request_count}/100 requests milestone</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {!joined ? (
                        <Button size="sm" onClick={() => joinAndFile(campaign)} disabled={filing || !user}>
                          {filing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <><Zap className="h-3.5 w-3.5 mr-1" /> Join & File</>}
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" /> Joined
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => shareCampaign(campaign)}>
                        <Twitter className="h-3.5 w-3.5 mr-1" /> Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
