import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText, Clock, CheckCircle, XCircle, AlertCircle, Send, Plus, Eye,
  Mail, MailOpen, Calendar, Building2, ArrowLeft, ChevronRight,
  RefreshCw, Download, Bell, Search, Filter, Inbox, AlertTriangle,
  Shield, Zap, TrendingUp, MoreVertical, MessageSquare, ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { format, differenceInBusinessDays, differenceInDays, addBusinessDays, isPast } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatusKey = "draft" | "submitted" | "acknowledged" | "processing" | "completed" | "denied" | "appealed";

interface FOIARequest {
  id: string;
  user_id: string;
  agency_name: string;
  agency_type: string;
  state: string;
  request_subject: string;
  request_body: string;
  status: StatusKey;
  submitted_date: string | null;
  response_deadline: string | null;
  acknowledgment_received_date: string | null;
  response_received_date: string | null;
  tracking_number: string | null;
  contact_email: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  follow_up_count: number;
  appeal_filed: boolean;
  notes: string | null;
  email_sent_at: string | null;
  email_opened_at: string | null;
  agency_email: string | null;
  priority: "urgent" | "normal" | "low" | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  agency_id: string | null;
}

interface FOIAUpdate {
  id: string;
  request_id: string;
  update_type: string;
  old_status: string | null;
  new_status: string | null;
  message: string;
  created_at: string;
}

interface FOIAAgency {
  id: string;
  name: string;
  agency_type: string;
  state: string | null;
  city: string | null;
  foia_email: string | null;
  foia_phone: string | null;
  foia_address: string | null;
  response_days: number | null;
}

interface FOIATemplate {
  id: string;
  title: string;
  category: string;
  subject_template: string;
  body_template: string;
  description: string | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATE_RESPONSE_DAYS: Record<string, number> = {
  "Federal": 20, "California": 10, "New York": 5, "Texas": 10, "Florida": 10,
  "Illinois": 5, "Pennsylvania": 5, "Ohio": 10, "Georgia": 3, "North Carolina": 10,
  "Michigan": 5, "New Jersey": 7, "Virginia": 5, "Washington": 5, "Arizona": 5,
  "Massachusetts": 10, "Tennessee": 7, "Indiana": 7, "Missouri": 3, "Maryland": 10,
  "Wisconsin": 10, "Colorado": 3, "Minnesota": 10, "South Carolina": 15, "Alabama": 10,
  "Louisiana": 3, "Kentucky": 3, "Oregon": 5, "Oklahoma": 3, "Connecticut": 4,
  "Utah": 10, "Iowa": 10, "Nevada": 5, "Arkansas": 3, "Mississippi": 7, "Kansas": 3,
  "New Mexico": 15, "Nebraska": 4, "West Virginia": 5, "Idaho": 3, "Hawaii": 10,
  "New Hampshire": 5, "Maine": 5, "Montana": 5, "Rhode Island": 10, "Delaware": 15,
  "South Dakota": 5, "North Dakota": 5, "Alaska": 10, "Vermont": 3, "Wyoming": 5,
};

const STATUS_CONFIG: Record<StatusKey, { label: string; color: string; bg: string; icon: typeof FileText }> = {
  draft:        { label: "Draft",        color: "text-slate-600",  bg: "bg-slate-100",  icon: FileText    },
  submitted:    { label: "Submitted",    color: "text-blue-600",   bg: "bg-blue-50",    icon: Send        },
  acknowledged: { label: "Acknowledged", color: "text-green-600",  bg: "bg-green-50",   icon: CheckCircle },
  processing:   { label: "Processing",   color: "text-yellow-600", bg: "bg-yellow-50",  icon: Clock       },
  completed:    { label: "Completed",    color: "text-emerald-600",bg: "bg-emerald-50", icon: CheckCircle },
  denied:       { label: "Denied",       color: "text-red-600",    bg: "bg-red-50",     icon: XCircle     },
  appealed:     { label: "Appealed",     color: "text-orange-600", bg: "bg-orange-50",  icon: AlertCircle },
};

const PRIORITY_CONFIG = {
  urgent: { label: "Urgent",  color: "text-red-600",    bg: "bg-red-50"    },
  normal: { label: "Normal",  color: "text-blue-600",   bg: "bg-blue-50"   },
  low:    { label: "Low",     color: "text-slate-500",  bg: "bg-slate-100" },
};

// ─── Deadline helpers ─────────────────────────────────────────────────────────

function getDeadline(req: FOIARequest): Date | null {
  if (req.response_deadline) return new Date(req.response_deadline);
  if (req.submitted_date) {
    const days = STATE_RESPONSE_DAYS[req.state] || 20;
    return addBusinessDays(new Date(req.submitted_date), days);
  }
  return null;
}

function getDeadlineStatus(req: FOIARequest) {
  const deadline = getDeadline(req);
  if (!deadline || ["completed", "denied"].includes(req.status)) return null;
  const now = new Date();
  const daysLeft = differenceInDays(deadline, now);
  if (daysLeft < 0)  return { daysLeft, label: `${Math.abs(daysLeft)}d overdue`, color: "text-red-600",    bg: "bg-red-50",     urgent: true  };
  if (daysLeft <= 3) return { daysLeft, label: `${daysLeft}d left`,             color: "text-orange-600", bg: "bg-orange-50",  urgent: true  };
  if (daysLeft <= 7) return { daysLeft, label: `${daysLeft}d left`,             color: "text-yellow-600", bg: "bg-yellow-50",  urgent: false };
  return               { daysLeft, label: `${daysLeft}d left`,             color: "text-slate-500",  bg: "bg-slate-100",  urgent: false };
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: number; sub?: string; color: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            {sub && <p className="text-xs text-orange-600 font-medium">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Request Card ─────────────────────────────────────────────────────────────

function RequestCard({ request, onSelect }: { request: FOIARequest; onSelect: () => void }) {
  const status = STATUS_CONFIG[request.status] || STATUS_CONFIG.draft;
  const StatusIcon = status.icon;
  const deadline = getDeadlineStatus(request);
  const emailSent = !!request.email_sent_at;
  const emailOpened = !!request.email_opened_at;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all border hover:border-primary/30"
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </span>
              {request.priority === "urgent" && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                  <Zap className="h-3 w-3" /> Urgent
                </span>
              )}
              {deadline && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${deadline.bg} ${deadline.color}`}>
                  {deadline.label}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-sm truncate">{request.request_subject || "(No subject)"}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              <Building2 className="h-3 w-3 inline mr-1" />
              {request.agency_name} · {request.state}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1.5 justify-end mb-1">
              {emailSent && (
                <span title={emailOpened ? "Agency opened email" : "Email sent"}>
                  {emailOpened
                    ? <MailOpen className="h-3.5 w-3.5 text-green-500" />
                    : <Mail className="h-3.5 w-3.5 text-blue-400" />}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              {request.submitted_date
                ? format(new Date(request.submitted_date), "MMM d")
                : format(new Date(request.created_at), "MMM d")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── New Request Form ─────────────────────────────────────────────────────────

function NewRequestForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const { user } = useAuth();
  const [step, setStep] = useState<"agency" | "template" | "review">("agency");
  const [agencies, setAgencies] = useState<FOIAAgency[]>([]);
  const [templates, setTemplates] = useState<FOIATemplate[]>([]);
  const [agencySearch, setAgencySearch] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<FOIAAgency | null>(null);
  const [customAgencyName, setCustomAgencyName] = useState("");
  const [customAgencyEmail, setCustomAgencyEmail] = useState("");
  const [customState, setCustomState] = useState("Federal");
  const [agencyType, setAgencyType] = useState("Federal");
  const [selectedTemplate, setSelectedTemplate] = useState<FOIATemplate | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("normal");
  const [sendNow, setSendNow] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.from("foia_agencies").select("*").eq("is_active", true).order("name").then(({ data }) => {
      setAgencies(data || []);
    });
    supabase.from("foia_templates").select("*").order("is_featured", { ascending: false }).then(({ data }) => {
      setTemplates(data || []);
    });
  }, []);

  const filteredAgencies = agencies.filter(a => {
    const q = agencySearch.toLowerCase();
    return !q || a.name.toLowerCase().includes(q) || (a.state || "").toLowerCase().includes(q) || (a.city || "").toLowerCase().includes(q);
  }).slice(0, 20);

  const deadline = selectedAgency?.response_days
    ? addBusinessDays(new Date(), selectedAgency.response_days)
    : addBusinessDays(new Date(), STATE_RESPONSE_DAYS[customState] || 20);

  const applyTemplate = (tpl: FOIATemplate) => {
    setSelectedTemplate(tpl);
    setSubject(tpl.subject_template);
    let b = tpl.body_template;
    if (user) {
      b = b.replace(/\[YOUR_NAME\]/g, user.user_metadata?.full_name || "");
      b = b.replace(/\[YOUR_EMAIL\]/g, user.email || "");
    }
    b = b.replace(/\[AGENCY_NAME\]/g, selectedAgency?.name || customAgencyName || "[Agency Name]");
    setBody(b);
    setStep("review");
  };

  const handleSubmit = async () => {
    if (!user) { toast.error("You must be signed in"); return; }
    if (!subject.trim()) { toast.error("Subject required"); return; }
    if (!body.trim()) { toast.error("Request body required"); return; }

    const agencyName = selectedAgency?.name || customAgencyName;
    const agencyEmail = selectedAgency?.foia_email || customAgencyEmail;
    const state = selectedAgency?.state || customState;

    if (!agencyName) { toast.error("Agency name required"); return; }

    setSending(true);
    try {
      // Create the FOIA request record
      const { data: newReq, error } = await supabase
        .from("foia_requests")
        .insert({
          user_id: user.id,
          agency_id: selectedAgency?.id || null,
          agency_name: agencyName,
          agency_type: selectedAgency?.agency_type || agencyType,
          state: state || "Federal",
          request_subject: subject,
          request_body: body,
          status: "draft",
          response_deadline: deadline.toISOString(),
          agency_email: agencyEmail || null,
          priority: priority as any,
          follow_up_count: 0,
          appeal_filed: false,
        })
        .select()
        .single();

      if (error) throw error;

      // If send now and we have an email, trigger the edge function
      if (sendNow && agencyEmail && newReq) {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) throw new Error("No auth session");

        const resp = await fetch(
          `https://vrdnrbjnitptxrexdlao.supabase.co/functions/v1/send-foia-request`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              requestId: newReq.id,
              agencyEmail,
              subject,
              requestBody: body,
              requesterName: user.user_metadata?.full_name || user.email || "Requester",
              requesterEmail: user.email || "",
              agencyName,
            }),
          }
        );
        const result = await resp.json();
        if (!resp.ok) throw new Error(result.error || "Send failed");
        toast.success("Request created and emailed to agency!");
      } else {
        toast.success("Request saved as draft. Edit and send when ready.");
      }

      onCreated();
    } catch (err: any) {
      toast.error(err.message || "Failed to create request");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="font-semibold text-lg">New Public Records Request</h2>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 text-sm">
        {(["agency","template","review"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < ["agency","template","review"].indexOf(step) + 1 && setStep(s)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                step === s ? "bg-primary text-primary-foreground" :
                ["agency","template","review"].indexOf(s) < ["agency","template","review"].indexOf(step)
                  ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
            {i < 2 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Step 1: Agency */}
      {step === "agency" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Which agency are you requesting from?</CardTitle>
            <CardDescription>Search our directory or enter a custom agency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search agencies..."
                className="pl-9"
                value={agencySearch}
                onChange={e => setAgencySearch(e.target.value)}
              />
            </div>

            {agencySearch && (
              <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                {filteredAgencies.length === 0 && (
                  <p className="text-sm text-muted-foreground p-3">No agencies found</p>
                )}
                {filteredAgencies.map(a => (
                  <button
                    key={a.id}
                    className={`w-full text-left p-3 hover:bg-muted transition-colors ${selectedAgency?.id === a.id ? "bg-primary/10" : ""}`}
                    onClick={() => { setSelectedAgency(a); setAgencySearch(a.name); }}
                  >
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{[a.city, a.state, a.agency_type].filter(Boolean).join(" · ")}</p>
                    {a.foia_email && <p className="text-xs text-blue-600 mt-0.5">{a.foia_email}</p>}
                  </button>
                ))}
              </div>
            )}

            <Separator />
            <p className="text-sm font-medium text-muted-foreground">Or enter a custom agency</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Agency Name</Label>
                <Input
                  placeholder="e.g. City of Houston PD"
                  value={customAgencyName}
                  onChange={e => { setCustomAgencyName(e.target.value); setSelectedAgency(null); }}
                />
              </div>
              <div>
                <Label className="text-xs">Agency Email</Label>
                <Input
                  type="email"
                  placeholder="records@agency.gov"
                  value={customAgencyEmail}
                  onChange={e => setCustomAgencyEmail(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">State / Jurisdiction</Label>
                <Select value={customState} onValueChange={setCustomState}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(STATE_RESPONSE_DAYS).map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                    <SelectItem value="normal">🔵 Normal</SelectItem>
                    <SelectItem value="low">⚪ Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => setStep("template")}
              disabled={!selectedAgency && !customAgencyName.trim()}
            >
              Choose Template <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Template */}
      {step === "template" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select a Request Template</CardTitle>
            <CardDescription>Or write your own from scratch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 max-h-72 overflow-y-auto pr-1">
              {templates.map(t => (
                <button
                  key={t.id}
                  className="w-full text-left p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() => applyTemplate(t)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t.title}</p>
                    <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                  </div>
                  {t.description && <p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
                </button>
              ))}
            </div>
            <Separator />
            <Button variant="outline" className="w-full" onClick={() => { setSelectedTemplate(null); setStep("review"); }}>
              <FileText className="h-4 w-4 mr-2" /> Write from Scratch
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Send */}
      {step === "review" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review & Send</CardTitle>
            <CardDescription>
              To: <strong>{selectedAgency?.name || customAgencyName}</strong>
              {(selectedAgency?.foia_email || customAgencyEmail) && (
                <> · <span className="text-blue-600">{selectedAgency?.foia_email || customAgencyEmail}</span></>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Subject</Label>
              <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="FOIA Request: [topic]" />
            </div>
            <div>
              <Label className="text-xs">Request Body</Label>
              <Textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={10}
                className="font-mono text-sm"
                placeholder="Pursuant to the Freedom of Information Act..."
              />
            </div>

            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                <strong>Deadline:</strong> Agency must respond by{" "}
                <strong>{format(deadline, "MMMM d, yyyy")}</strong>{" "}
                ({STATE_RESPONSE_DAYS[selectedAgency?.state || customState] || 20} business days —{" "}
                {selectedAgency?.state || customState} law)
              </AlertDescription>
            </Alert>

            {(selectedAgency?.foia_email || customAgencyEmail) && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Send via secure email now?</p>
                  <p className="text-xs text-blue-700">We'll email the agency and send you a confirmation. Read tracking included.</p>
                </div>
                <Button
                  size="sm"
                  variant={sendNow ? "default" : "outline"}
                  onClick={() => setSendNow(!sendNow)}
                  className="shrink-0"
                >
                  {sendNow ? "✓ Yes, Send" : "Send Later"}
                </Button>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("template")} className="flex-1">
                ← Back
              </Button>
              <Button onClick={handleSubmit} disabled={sending} className="flex-2">
                {sending ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Processing…</>
                ) : sendNow ? (
                  <><Send className="h-4 w-4 mr-2" /> Save & Send Email</>
                ) : (
                  <><FileText className="h-4 w-4 mr-2" /> Save as Draft</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Request Detail ───────────────────────────────────────────────────────────

function RequestDetail({ request, onBack, onUpdate }: { request: FOIARequest; onBack: () => void; onUpdate: (r: FOIARequest) => void }) {
  const { user } = useAuth();
  const [updates, setUpdates] = useState<FOIAUpdate[]>([]);
  const [newNote, setNewNote] = useState("");
  const [sending, setSending] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const deadline = getDeadline(request);
  const deadlineStatus = getDeadlineStatus(request);
  const status = STATUS_CONFIG[request.status] || STATUS_CONFIG.draft;
  const StatusIcon = status.icon;

  useEffect(() => {
    supabase
      .from("foia_request_updates")
      .select("*")
      .eq("request_id", request.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setUpdates(data || []));
  }, [request.id]);

  const updateStatus = async (newStatus: StatusKey) => {
    setStatusUpdating(true);
    const { data, error } = await supabase
      .from("foia_requests")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", request.id)
      .select()
      .single();

    if (!error && data) {
      await supabase.from("foia_request_updates").insert({
        request_id: request.id,
        update_type: "status_change",
        old_status: request.status,
        new_status: newStatus,
        message: `Status changed to ${STATUS_CONFIG[newStatus]?.label}`,
        created_by: user?.id,
      });
      onUpdate(data as FOIARequest);
      toast.success("Status updated");
      // Refresh updates
      const { data: u } = await supabase.from("foia_request_updates").select("*").eq("request_id", request.id).order("created_at", { ascending: false });
      setUpdates(u || []);
    }
    setStatusUpdating(false);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    await supabase.from("foia_request_updates").insert({
      request_id: request.id,
      update_type: "note",
      message: newNote.trim(),
      created_by: user?.id,
    });
    const { data: u } = await supabase.from("foia_request_updates").select("*").eq("request_id", request.id).order("created_at", { ascending: false });
    setUpdates(u || []);
    setNewNote("");
    toast.success("Note added");
  };

  const sendEmail = async () => {
    if (!user || !request.agency_email) return;
    setSending(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("No session");

      const resp = await fetch(
        "https://vrdnrbjnitptxrexdlao.supabase.co/functions/v1/send-foia-request",
        {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: request.id,
            agencyEmail: request.agency_email,
            subject: request.request_subject,
            requestBody: request.request_body,
            requesterName: user.user_metadata?.full_name || user.email || "",
            requesterEmail: user.email || "",
            agencyName: request.agency_name,
          }),
        }
      );
      const result = await resp.json();
      if (!resp.ok) throw new Error(result.error || "Send failed");

      // Refresh request
      const { data: updated } = await supabase.from("foia_requests").select("*").eq("id", request.id).single();
      if (updated) onUpdate(updated as FOIARequest);
      const { data: u } = await supabase.from("foia_request_updates").select("*").eq("request_id", request.id).order("created_at", { ascending: false });
      setUpdates(u || []);
      toast.success("Request emailed to agency!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const downloadLetter = () => {
    const today = format(new Date(), "MMMM d, yyyy");
    const letter = `${today}\n\n${request.agency_name}\nFOIA/Records Division\n\nDear FOIA Officer:\n\n${request.request_body}\n\nSincerely,\n\n${user?.user_metadata?.full_name || ""}\n${user?.email || ""}`;
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FOIA-Request-${request.agency_name.replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> All Requests
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium truncate max-w-xs">{request.request_subject}</span>
      </div>

      {/* Header card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                  <StatusIcon className="h-4 w-4" /> {status.label}
                </span>
                {request.priority === "urgent" && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-600">
                    <Zap className="h-3 w-3" /> Urgent
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold">{request.request_subject}</h2>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                {request.agency_name} · {request.state}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={downloadLetter}>
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
              {request.agency_email && !request.email_sent_at && (
                <Button size="sm" onClick={sendEmail} disabled={sending}>
                  {sending ? <RefreshCw className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                  Send Email
                </Button>
              )}
            </div>
          </div>

          {/* Email tracking indicators */}
          {request.email_sent_at && (
            <div className="mt-4 flex items-center gap-4 text-sm border-t pt-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-blue-600">
                <Mail className="h-4 w-4" />
                Sent {format(new Date(request.email_sent_at), "MMM d, h:mm a")}
              </span>
              {request.email_opened_at ? (
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <MailOpen className="h-4 w-4" />
                  ✓ Opened by agency {format(new Date(request.email_opened_at), "MMM d, h:mm a")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  Not yet opened
                </span>
              )}
              {request.agency_email && (
                <span className="text-muted-foreground">{request.agency_email}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="md:col-span-1 space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Filed</span>
                <span>{format(new Date(request.created_at), "MMM d, yyyy")}</span>
              </div>
              {request.submitted_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted</span>
                  <span>{format(new Date(request.submitted_date), "MMM d, yyyy")}</span>
                </div>
              )}
              {deadline && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className={deadlineStatus?.color || ""}>{format(deadline, "MMM d, yyyy")}</span>
                </div>
              )}
              {deadlineStatus && (
                <div className={`text-center py-2 px-3 rounded-lg text-xs font-semibold ${deadlineStatus.bg} ${deadlineStatus.color}`}>
                  {deadlineStatus.label}
                </div>
              )}
              {request.acknowledgment_received_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Acknowledged</span>
                  <span>{format(new Date(request.acknowledgment_received_date), "MMM d")}</span>
                </div>
              )}
              {request.response_received_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response</span>
                  <span>{format(new Date(request.response_received_date), "MMM d")}</span>
                </div>
              )}
              {request.tracking_number && (
                <div className="border-t pt-2">
                  <p className="text-xs text-muted-foreground">Tracking #</p>
                  <p className="font-mono text-xs">{request.tracking_number}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status updater */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(Object.keys(STATUS_CONFIG) as StatusKey[]).map(s => (
                <button
                  key={s}
                  disabled={statusUpdating || request.status === s}
                  onClick={() => updateStatus(s)}
                  className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                    request.status === s
                      ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} border-current font-semibold`
                      : "hover:bg-muted"
                  }`}
                >
                  {React.createElement(STATUS_CONFIG[s].icon, { className: "h-3 w-3" })}
                  {STATUS_CONFIG[s].label}
                  {request.status === s && " ✓"}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-2 space-y-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Request Body</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{request.request_body}</pre>
            </CardContent>
          </Card>

          {/* Activity log */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Activity Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {updates.length === 0 && (
                <p className="text-sm text-muted-foreground">No activity yet</p>
              )}
              {updates.map(u => (
                <div key={u.id} className="flex gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p>{u.message}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(u.created_at), "MMM d, yyyy h:mm a")}</p>
                  </div>
                </div>
              ))}

              <Separator />
              <div className="flex gap-2">
                <Input
                  placeholder="Add a note (e.g. 'Called records office, agent said 2 more weeks')"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addNote()}
                  className="text-sm"
                />
                <Button size="sm" onClick={addNote} disabled={!newNote.trim()}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function PublicRecordsTracker() {
  const { user } = useAuth();
  const [view, setView] = useState<"dashboard" | "new" | "detail">("dashboard");
  const [requests, setRequests] = useState<FOIARequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<FOIARequest | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey | "all">("all");

  const loadRequests = useCallback(async () => {
    if (!user) { setRequests([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("foia_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setRequests((data as FOIARequest[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const filtered = requests.filter(r => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.agency_name.toLowerCase().includes(q) ||
        r.request_subject.toLowerCase().includes(q) ||
        (r.state || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Stats
  const stats = {
    total: requests.length,
    open: requests.filter(r => !["completed","denied"].includes(r.status)).length,
    overdue: requests.filter(r => {
      const d = getDeadlineStatus(r);
      return d && d.daysLeft < 0;
    }).length,
    emailsOpened: requests.filter(r => !!r.email_opened_at).length,
  };

  if (!user) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in to track your requests</h3>
          <p className="text-muted-foreground text-sm mb-4">Create an account to start filing and tracking public records requests</p>
          <Button onClick={() => window.location.href = "/auth"}>Sign In / Create Account</Button>
        </CardContent>
      </Card>
    );
  }

  if (view === "new") {
    return <NewRequestForm onCreated={() => { loadRequests(); setView("dashboard"); }} onCancel={() => setView("dashboard")} />;
  }

  if (view === "detail" && selectedRequest) {
    return (
      <RequestDetail
        request={selectedRequest}
        onBack={() => { setView("dashboard"); setSelectedRequest(null); }}
        onUpdate={(updated) => {
          setSelectedRequest(updated);
          setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Inbox className="h-6 w-6 text-primary" />
            Public Records Tracker
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            File, send, and track your FOIA requests — with email confirmation and read tracking
          </p>
        </div>
        <Button onClick={() => setView("new")}>
          <Plus className="h-4 w-4 mr-2" /> New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={FileText}   label="Total Requests" value={stats.total} color="bg-primary/10 text-primary" />
        <StatCard icon={Clock}      label="Open"           value={stats.open}  color="bg-blue-100 text-blue-600" />
        <StatCard icon={AlertTriangle} label="Overdue"     value={stats.overdue} sub={stats.overdue > 0 ? "Action needed" : undefined} color="bg-red-100 text-red-600" />
        <StatCard icon={MailOpen}   label="Emails Opened" value={stats.emailsOpened} color="bg-green-100 text-green-600" />
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {(Object.entries(STATUS_CONFIG) as [StatusKey, any][]).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={loadRequests}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Request list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <Card key={i} className="h-20 animate-pulse bg-muted" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium">
              {requests.length === 0 ? "No requests yet" : "No matching requests"}
            </p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {requests.length === 0
                ? "File your first public records request to get started"
                : "Try adjusting your filters"}
            </p>
            {requests.length === 0 && (
              <Button onClick={() => setView("new")}>
                <Plus className="h-4 w-4 mr-2" /> File First Request
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map(r => (
            <RequestCard
              key={r.id}
              request={r}
              onSelect={() => { setSelectedRequest(r); setView("detail"); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicRecordsTracker;

// Need React import for React.createElement in detail view
import React from "react";
