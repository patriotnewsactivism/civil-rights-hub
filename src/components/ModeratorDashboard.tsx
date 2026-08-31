import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileLock2,
  FileText,
  Loader2,
  MessageSquare,
  ShieldAlert,
  Trash2,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  IncidentReportRecord,
  isCurrentUserStaff,
  listReviewableIncidentReports,
  moderateContentReport,
  reviewIncidentReport,
} from "@/services/incidentReports";

interface ContentReport {
  id: string;
  content_id: string;
  content_type: string;
  reason: string;
  details: string | null;
  reporter_id: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  reporter_name?: string;
  content_preview?: string;
}

interface AuditRow {
  id: number;
  actor_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  note: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const db = supabase as any;

const contentTypeIcons: Record<string, React.ReactNode> = {
  post: <FileText className="h-4 w-4" />,
  comment: <MessageSquare className="h-4 w-4" />,
  thread: <MessageSquare className="h-4 w-4" />,
  user: <User className="h-4 w-4" />,
  violation: <ShieldAlert className="h-4 w-4" />,
};

async function contentPreview(report: ContentReport) {
  const lookups: Record<string, { table: string; column: string }> = {
    post: { table: "posts", column: "content" },
    comment: { table: "comments", column: "content" },
    thread: { table: "forum_threads", column: "title" },
    violation: { table: "violations", column: "description" },
  };
  const lookup = lookups[report.content_type];
  if (!lookup) return "Preview unavailable for this content type";

  const { data } = await db.from(lookup.table).select(lookup.column).eq("id", report.content_id).maybeSingle();
  const value = data?.[lookup.column];
  return typeof value === "string" ? value.slice(0, 300) : "Content not found";
}

export function ModeratorDashboard() {
  const [checking, setChecking] = useState(true);
  const [staff, setStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [incidents, setIncidents] = useState<IncidentReportRecord[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentReport | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReportRecord | null>(null);
  const [contentAction, setContentAction] = useState<"dismiss" | "remove" | null>(null);
  const [incidentAction, setIncidentAction] = useState<"under_review" | "needs_info" | "closed" | null>(null);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: reportRows, error: reportError }, incidentRows, { data: auditRows, error: auditError }] = await Promise.all([
        db.from("content_reports").select("*").order("created_at", { ascending: false }).limit(100),
        listReviewableIncidentReports(),
        db.from("moderation_audit_log").select("id, actor_id, action, target_type, target_id, note, metadata, created_at").order("created_at", { ascending: false }).limit(100),
      ]);
      if (reportError) throw reportError;
      if (auditError) throw auditError;

      const baseReports = (reportRows ?? []) as ContentReport[];
      const reporterIds = [...new Set(baseReports.map((r) => r.reporter_id).filter(Boolean))] as string[];
      const names: Record<string, string> = {};
      if (reporterIds.length) {
        const { data: profiles } = await db.from("user_profiles").select("user_id, display_name, username").in("user_id", reporterIds);
        for (const profile of profiles ?? []) names[profile.user_id] = profile.display_name || profile.username || "Community member";
      }

      const detailed = await Promise.all(baseReports.map(async (report) => ({
        ...report,
        reporter_name: report.reporter_id ? names[report.reporter_id] || "Community member" : "Unknown reporter",
        content_preview: await contentPreview(report),
      })));

      setReports(detailed);
      setIncidents(incidentRows);
      setAudit((auditRows ?? []) as AuditRow[]);
    } catch (error) {
      console.error("Moderator dashboard load failed", error);
      toast.error("Unable to load moderation data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    isCurrentUserStaff()
      .then((allowed) => {
        setStaff(allowed);
        if (allowed) fetchAll();
      })
      .catch(() => setStaff(false))
      .finally(() => setChecking(false));
  }, [fetchAll]);

  const pending = useMemo(() => reports.filter((r) => r.status === "pending"), [reports]);
  const resolved = useMemo(() => reports.filter((r) => r.status !== "pending"), [reports]);
  const openIncidents = useMemo(() => incidents.filter((r) => r.status !== "closed"), [incidents]);
  const closedIncidents = useMemo(() => incidents.filter((r) => r.status === "closed"), [incidents]);

  const performContentAction = async () => {
    if (!selectedContent || !contentAction) return;
    setProcessing(true);
    try {
      await moderateContentReport(selectedContent.id, contentAction, note);
      toast.success(contentAction === "remove" ? "Content removed and audit entry recorded" : "Report dismissed and audit entry recorded");
      setSelectedContent(null);
      setContentAction(null);
      setNote("");
      await fetchAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Moderation action failed");
    } finally {
      setProcessing(false);
    }
  };

  const performIncidentAction = async () => {
    if (!selectedIncident || !incidentAction) return;
    if ((incidentAction === "needs_info" || incidentAction === "closed") && !note.trim()) {
      toast.error("Add a review note so the reporter understands this status change.");
      return;
    }
    setProcessing(true);
    try {
      await reviewIncidentReport(selectedIncident.id, incidentAction, note);
      toast.success("Incident review status updated and audited");
      setSelectedIncident(null);
      setIncidentAction(null);
      setNote("");
      await fetchAll();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Incident review failed");
    } finally {
      setProcessing(false);
    }
  };

  if (checking) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!staff) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Restricted</AlertTitle>
        <AlertDescription>Moderator or administrator authorization is required. Permission is verified by the database, not by this page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-2xl font-bold">Moderation & Review</h2><p className="text-sm text-muted-foreground">Human review queue with server-enforced authorization and audit history.</p></div>
        <Button variant="outline" onClick={fetchAll} disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Refresh</Button>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="content">Content reports ({pending.length})</TabsTrigger>
          <TabsTrigger value="incidents">Private incidents ({openIncidents.length})</TabsTrigger>
          <TabsTrigger value="history">Audit history</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5" />Pending content reports</CardTitle></CardHeader>
            <CardContent>
              {pending.length === 0 ? <p className="py-8 text-center text-muted-foreground">No pending content reports.</p> : (
                <ScrollArea className="h-[520px] pr-4"><div className="space-y-3">{pending.map((report) => (
                  <div key={report.id} className="rounded-lg border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">{contentTypeIcons[report.content_type] ?? <AlertTriangle className="h-4 w-4" />}<Badge variant="outline">{report.content_type}</Badge><span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span></div>
                        <p className="mt-2 font-medium">{report.reason}</p>
                        {report.details && <p className="mt-1 text-sm text-muted-foreground">{report.details}</p>}
                        <p className="mt-2 rounded bg-muted p-2 text-sm">{report.content_preview}</p>
                        <p className="mt-2 text-xs text-muted-foreground">Reporter: {report.reporter_name}</p>
                      </div>
                      <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setSelectedContent(report); setContentAction("dismiss"); setNote(""); }}>Dismiss</Button><Button size="sm" variant="destructive" onClick={() => { setSelectedContent(report); setContentAction("remove"); setNote(""); }}><Trash2 className="mr-1 h-4 w-4" />Remove</Button></div>
                    </div>
                  </div>
                ))}</div></ScrollArea>
              )}
            </CardContent>
          </Card>
          {resolved.length > 0 && <p className="text-xs text-muted-foreground">{resolved.length} resolved/dismissed reports remain in the queue history; detailed actions are preserved in the audit log.</p>}
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <Alert><FileLock2 className="h-4 w-4" /><AlertTitle>Sensitive review queue</AlertTitle><AlertDescription>Incident narratives are private intake records, not public posts or findings of misconduct. Do not copy evidence or sensitive narrative into public community content.</AlertDescription></Alert>
          <div className="space-y-3">{openIncidents.length === 0 ? <p className="py-8 text-center text-muted-foreground">No open private incident reports.</p> : openIncidents.map((incident) => (
            <Card key={incident.id}><CardContent className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><Badge>{incident.status.replace("_", " ")}</Badge><span className="text-xs text-muted-foreground">{incident.submitted_at ? formatDistanceToNow(new Date(incident.submitted_at), { addSuffix: true }) : "Not submitted"}</span></div><h3 className="mt-2 font-semibold">{incident.title}</h3><p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{incident.description}</p><p className="mt-3 text-xs">{incident.location_city ? `${incident.location_city}, ` : ""}{incident.location_state} · {incident.category.replaceAll("_", " ")}{incident.agency_name ? ` · ${incident.agency_name}` : ""}</p></div>
                <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => { setSelectedIncident(incident); setIncidentAction("under_review"); setNote(""); }}>Start review</Button><Button size="sm" variant="outline" onClick={() => { setSelectedIncident(incident); setIncidentAction("needs_info"); setNote(""); }}>Request info</Button><Button size="sm" onClick={() => { setSelectedIncident(incident); setIncidentAction("closed"); setNote(""); }}>Close review</Button></div>
              </div>
            </CardContent></Card>
          ))}</div>
          {closedIncidents.length > 0 && <p className="text-xs text-muted-foreground">{closedIncidents.length} closed private incident reports remain owner/staff-visible and are not published to the community feed.</p>}
        </TabsContent>

        <TabsContent value="history">
          <Card><CardHeader><CardTitle>Audit history</CardTitle></CardHeader><CardContent>{audit.length === 0 ? <p className="text-muted-foreground">No staff actions recorded yet.</p> : <ScrollArea className="h-[520px] pr-4"><div className="space-y-3">{audit.map((row) => <div key={row.id} className="rounded-lg border p-3"><div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{row.action}</Badge><span className="text-sm">{row.target_type}</span><span className="ml-auto text-xs text-muted-foreground">{formatDistanceToNow(new Date(row.created_at), { addSuffix: true })}</span></div>{row.note && <p className="mt-2 text-sm">{row.note}</p>}</div>)}</div></ScrollArea>}</CardContent></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={Boolean(selectedContent && contentAction)} onOpenChange={(open) => { if (!open) { setSelectedContent(null); setContentAction(null); setNote(""); } }}>
        <DialogContent><DialogHeader><DialogTitle>{contentAction === "remove" ? "Remove reported content?" : "Dismiss report?"}</DialogTitle><DialogDescription>{contentAction === "remove" ? "The server will preserve a snapshot in the moderation audit log before deleting the reported content." : "The report will be marked dismissed and the decision will be audited."}</DialogDescription></DialogHeader><Textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={4000} placeholder="Moderator note (recommended)" /><DialogFooter><Button variant="outline" onClick={() => { setSelectedContent(null); setContentAction(null); }}>Cancel</Button><Button variant={contentAction === "remove" ? "destructive" : "default"} onClick={performContentAction} disabled={processing}>{processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : contentAction === "remove" ? <Trash2 className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}{contentAction === "remove" ? "Remove and audit" : "Dismiss and audit"}</Button></DialogFooter></DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedIncident && incidentAction)} onOpenChange={(open) => { if (!open) { setSelectedIncident(null); setIncidentAction(null); setNote(""); } }}>
        <DialogContent><DialogHeader><DialogTitle>Update private incident review</DialogTitle><DialogDescription>This status change is server-authorized and written to the moderation audit log. The incident remains private.</DialogDescription></DialogHeader><Textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={4000} placeholder={incidentAction === "needs_info" ? "Explain what additional information is needed…" : incidentAction === "closed" ? "Summarize the review outcome without declaring unverified allegations proven…" : "Internal review note (optional)"} /><DialogFooter><Button variant="outline" onClick={() => { setSelectedIncident(null); setIncidentAction(null); }}>Cancel</Button><Button onClick={performIncidentAction} disabled={processing}>{processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}Apply status</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
}
