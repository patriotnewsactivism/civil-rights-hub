import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { format } from "date-fns";
import {
  AlertCircle,
  FileLock2,
  FilePlus2,
  Loader2,
  Paperclip,
  Save,
  Send,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  createIncidentReport,
  deleteDraftIncidentReport,
  getIncidentEvidenceUrl,
  IncidentCategory,
  IncidentEvidenceRecord,
  IncidentReportInput,
  IncidentReportRecord,
  listIncidentEvidence,
  listMyIncidentReports,
  removeIncidentEvidence,
  submitIncidentReport,
  updateIncidentReport,
  uploadIncidentEvidence,
} from "@/services/incidentReports";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const CATEGORIES: Array<{ value: IncidentCategory; label: string }> = [
  { value: "police", label: "Police / law enforcement" },
  { value: "jail_prison", label: "Jail / prison" },
  { value: "court", label: "Court / judicial process" },
  { value: "protest_speech", label: "Speech / protest / press" },
  { value: "housing", label: "Housing" },
  { value: "employment", label: "Employment" },
  { value: "education", label: "Education" },
  { value: "disability", label: "Disability access" },
  { value: "voting", label: "Voting" },
  { value: "discrimination", label: "Discrimination" },
  { value: "retaliation", label: "Retaliation" },
  { value: "surveillance_privacy", label: "Surveillance / privacy" },
  { value: "other", label: "Other" },
];

const emptyForm: IncidentReportInput = {
  title: "",
  description: "",
  incidentAt: "",
  locationState: "",
  locationCity: "",
  jurisdiction: "",
  category: "other",
  agencyName: "",
  officerName: "",
  officerBadge: "",
  officerRank: "",
};

function localDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function statusLabel(status: IncidentReportRecord["status"]) {
  return {
    draft: "Draft",
    submitted: "Submitted",
    under_review: "Under review",
    needs_info: "Needs information",
    closed: "Closed",
  }[status];
}

function toForm(report: IncidentReportRecord): IncidentReportInput {
  return {
    title: report.title,
    description: report.description,
    incidentAt: localDateTime(report.incident_at),
    locationState: report.location_state,
    locationCity: report.location_city ?? "",
    jurisdiction: report.jurisdiction ?? "",
    category: report.category,
    agencyName: report.agency_name ?? "",
    officerName: report.officer_name ?? "",
    officerBadge: report.officer_badge ?? "",
    officerRank: report.officer_rank ?? "",
  };
}

export default function IncidentReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<IncidentReportRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<IncidentReportInput>(emptyForm);
  const [evidence, setEvidence] = useState<IncidentEvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [evidenceDescription, setEvidenceDescription] = useState("");

  const selected = useMemo(() => reports.find((r) => r.id === selectedId) ?? null, [reports, selectedId]);
  const editable = !selected || selected.status === "draft" || selected.status === "needs_info";

  const refresh = async (keepSelection = true) => {
    const next = await listMyIncidentReports();
    setReports(next);
    if (keepSelection && selectedId && !next.some((r) => r.id === selectedId)) setSelectedId(null);
    return next;
  };

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    refresh(false)
      .catch(() => toast.error("Unable to load your incident reports"))
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (!selectedId) {
      setEvidence([]);
      return;
    }
    listIncidentEvidence(selectedId)
      .then(setEvidence)
      .catch(() => toast.error("Unable to load evidence metadata"));
  }, [selectedId]);

  const startNew = () => {
    setSelectedId(null);
    setForm(emptyForm);
    setEvidence([]);
    setFile(null);
    setEvidenceDescription("");
  };

  const selectReport = (report: IncidentReportRecord) => {
    setSelectedId(report.id);
    setForm(toForm(report));
    setFile(null);
    setEvidenceDescription("");
  };

  const validate = () => {
    if (form.title.trim().length < 5) return "Title must be at least 5 characters.";
    if (form.description.trim().length < 20) return "Description must be at least 20 characters.";
    if (!form.incidentAt) return "Incident date and time are required.";
    if (!form.locationState) return "State is required.";
    if (new Date(form.incidentAt).getTime() > Date.now()) return "Incident time cannot be in the future.";
    return null;
  };

  const saveDraft = async () => {
    const validation = validate();
    if (validation) return toast.error(validation);
    setSaving(true);
    try {
      let reportId = selectedId;
      if (selectedId) {
        await updateIncidentReport(selectedId, form);
      } else {
        reportId = await createIncidentReport(form, false);
        setSelectedId(reportId);
      }
      const next = await refresh(true);
      const saved = next.find((r) => r.id === reportId);
      if (saved) setForm(toForm(saved));
      toast.success("Private draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save incident report");
    } finally {
      setSaving(false);
    }
  };

  const submit = async () => {
    const validation = validate();
    if (validation) return toast.error(validation);
    setSaving(true);
    try {
      let reportId = selectedId;
      if (selectedId) {
        await updateIncidentReport(selectedId, form);
        await submitIncidentReport(selectedId);
      } else {
        reportId = await createIncidentReport(form, true);
        setSelectedId(reportId);
      }
      await refresh(true);
      toast.success("Incident report submitted to the private review queue");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit incident report");
    } finally {
      setSaving(false);
    }
  };

  const uploadEvidence = async () => {
    if (!selectedId) return toast.error("Save a draft before adding evidence.");
    if (!file) return toast.error("Choose a file first.");
    setUploading(true);
    try {
      await uploadIncidentEvidence(selectedId, file, evidenceDescription);
      setEvidence(await listIncidentEvidence(selectedId));
      setFile(null);
      setEvidenceDescription("");
      const input = document.getElementById("incident-evidence-file") as HTMLInputElement | null;
      if (input) input.value = "";
      toast.success("Evidence securely uploaded and hashed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Evidence upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openEvidence = async (item: IncidentEvidenceRecord) => {
    if (!item.storage_path) return;
    try {
      const url = await getIncidentEvidenceUrl(item.storage_path);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Unable to create a secure evidence link");
    }
  };

  const removeEvidence = async (item: IncidentEvidenceRecord) => {
    if (!editable) return;
    try {
      await removeIncidentEvidence(item.id);
      if (selectedId) setEvidence(await listIncidentEvidence(selectedId));
      toast.success("Evidence removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove evidence");
    }
  };

  const deleteDraft = async () => {
    if (!selected || selected.status !== "draft") return;
    if (evidence.length > 0) return toast.error("Remove evidence files before deleting this draft.");
    try {
      await deleteDraftIncidentReport(selected.id);
      startNew();
      await refresh(false);
      toast.success("Draft deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete draft");
    }
  };

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO
        title="Private Incident Reports | Civil Rights Hub"
        description="Create, preserve, and privately submit civil-rights incident records and evidence for review."
        canonicalUrl="https://civilrightshub.org/incident-reports"
        ogUrl="https://civilrightshub.org/incident-reports"
      />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-primary"><FileLock2 className="h-5 w-5" /><span className="text-sm font-semibold">Private intake</span></div>
            <h1 className="text-3xl font-bold">Incident Reports</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              Drafts, submitted incident records, and evidence here are separate from the public community feed. They are visible only to you and authorized review staff.
            </p>
          </div>
          <Button onClick={startNew} variant="outline"><FilePlus2 className="mr-2 h-4 w-4" />New report</Button>
        </div>

        <Alert className="mb-6 border-amber-500/40 bg-amber-500/5">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Evidence and privacy</AlertTitle>
          <AlertDescription>
            Evidence is stored in a non-public bucket. Uploads are checked server-side for size and file signature and receive a SHA-256 digest. Avoid unnecessary Social Security numbers, passwords, private medical records, privileged communications, or unrelated personal identifiers.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardHeader><CardTitle className="text-lg">Your reports</CardTitle><CardDescription>Private records only</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : reports.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reports yet.</p>
              ) : reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => selectReport(report)}
                  className={`w-full rounded-md border p-3 text-left transition-colors hover:bg-muted ${selectedId === report.id ? "border-primary bg-primary/5" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium">{report.title}</span><Badge variant="outline">{statusLabel(report.status)}</Badge></div>
                  <p className="mt-1 text-xs text-muted-foreground">{format(new Date(report.created_at), "MMM d, yyyy")}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{selected ? selected.title : "New private incident report"}</CardTitle>
                <CardDescription>
                  {selected ? `Status: ${statusLabel(selected.status)}` : "Save a private draft, attach evidence, then submit when ready."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {selected?.status === "needs_info" && selected.resolution_summary && (
                  <Alert><AlertCircle className="h-4 w-4" /><AlertTitle>More information requested</AlertTitle><AlertDescription>{selected.resolution_summary}</AlertDescription></Alert>
                )}
                {selected?.status === "closed" && selected.resolution_summary && (
                  <Alert><ShieldCheck className="h-4 w-4" /><AlertTitle>Review closed</AlertTitle><AlertDescription>{selected.resolution_summary}</AlertDescription></Alert>
                )}

                <div className="space-y-2"><Label htmlFor="incident-title">Title</Label><Input id="incident-title" maxLength={200} disabled={!editable} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="space-y-2"><Label htmlFor="incident-description">What happened?</Label><Textarea id="incident-description" rows={8} maxLength={10000} disabled={!editable} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><p className="text-xs text-muted-foreground">{form.description.length}/10,000 characters. Distinguish personal observations from information supplied by others.</p></div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="incident-at">Incident date & time</Label><Input id="incident-at" type="datetime-local" disabled={!editable} max={new Date().toISOString().slice(0, 16)} value={form.incidentAt} onChange={(e) => setForm({ ...form, incidentAt: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Category</Label><Select disabled={!editable} value={form.category} onValueChange={(v) => setForm({ ...form, category: v as IncidentCategory })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>State</Label><Select disabled={!editable} value={form.locationState} onValueChange={(v) => setForm({ ...form, locationState: v })}><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger><SelectContent>{US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label htmlFor="incident-city">City / general location</Label><Input id="incident-city" disabled={!editable} value={form.locationCity} onChange={(e) => setForm({ ...form, locationCity: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="jurisdiction">Jurisdiction</Label><Input id="jurisdiction" disabled={!editable} placeholder="County, court district, agency jurisdiction, etc." value={form.jurisdiction} onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })} /></div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="agency-name">Agency / organization (optional)</Label><Input id="agency-name" disabled={!editable} value={form.agencyName} onChange={(e) => setForm({ ...form, agencyName: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="officer-name">Official / officer name (optional)</Label><Input id="officer-name" disabled={!editable} value={form.officerName} onChange={(e) => setForm({ ...form, officerName: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="officer-badge">Badge / identifier (optional)</Label><Input id="officer-badge" disabled={!editable} value={form.officerBadge} onChange={(e) => setForm({ ...form, officerBadge: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="officer-rank">Rank / title (optional)</Label><Input id="officer-rank" disabled={!editable} value={form.officerRank} onChange={(e) => setForm({ ...form, officerRank: e.target.value })} /></div>
                </div>

                {editable && (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={saveDraft} disabled={saving}><Save className="mr-2 h-4 w-4" />{saving ? "Saving…" : "Save private draft"}</Button>
                    <Button onClick={submit} disabled={saving}><Send className="mr-2 h-4 w-4" />Submit for review</Button>
                    {selected?.status === "draft" && <Button variant="ghost" className="ml-auto text-destructive" onClick={deleteDraft}><Trash2 className="mr-2 h-4 w-4" />Delete draft</Button>}
                  </div>
                )}
              </CardContent>
            </Card>

            {selected && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Paperclip className="h-5 w-5" />Evidence</CardTitle><CardDescription>Private evidence is never placed in the public media bucket.</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  {editable && (
                    <div className="rounded-lg border p-4 space-y-3">
                      <Input id="incident-evidence-file" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                      <Input placeholder="Evidence description (optional)" value={evidenceDescription} onChange={(e) => setEvidenceDescription(e.target.value)} />
                      <Button onClick={uploadEvidence} disabled={uploading || !file}><Upload className="mr-2 h-4 w-4" />{uploading ? "Validating and uploading…" : "Upload evidence"}</Button>
                      <p className="text-xs text-muted-foreground">Maximum 50 MB. Supported: JPEG, PNG, WebP, PDF, MP4, WebM, MP3/Ogg audio, and plain text. File signatures are validated by the server.</p>
                    </div>
                  )}

                  {evidence.length === 0 ? <p className="text-sm text-muted-foreground">No evidence files attached.</p> : evidence.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center gap-3 rounded-md border p-3">
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.original_filename}</p><p className="text-xs text-muted-foreground">{item.mime_type} · {(item.byte_size / 1024).toFixed(1)} KB{item.sha256 ? ` · SHA-256 ${item.sha256.slice(0, 12)}…` : ""}</p>{item.description && <p className="mt-1 text-xs">{item.description}</p>}</div>
                      <Button size="sm" variant="outline" onClick={() => openEvidence(item)}>Open secure link</Button>
                      {editable && <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeEvidence(item)}><Trash2 className="h-4 w-4" /></Button>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
