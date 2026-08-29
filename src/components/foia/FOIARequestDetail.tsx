import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowLeft, Building2, Calendar, FileText, Info, MapPin, Save, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type FOIARequest = Database["public"]["Tables"]["foia_requests"]["Row"];
type StatusKey = "draft" | "submitted" | "acknowledged" | "processing" | "completed" | "denied" | "appealed";

const STATUS_OPTIONS: { value: StatusKey; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "denied", label: "Denied" },
  { value: "appealed", label: "Appealed" },
];

interface FOIARequestDetailProps {
  requestId: string;
  onBack?: () => void;
}

export function FOIARequestDetail({ requestId, onBack }: FOIARequestDetailProps) {
  const { user } = useAuth();
  const [request, setRequest] = useState<FOIARequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newStatus, setNewStatus] = useState<StatusKey>("submitted");
  const [updateNote, setUpdateNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequestDetails = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("foia_requests")
      .select("*")
      .eq("id", requestId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Unable to load request details", error);
      toast.error("Unable to load request details");
      setRequest(null);
    } else {
      setRequest(data);
      setNewStatus((data.status as StatusKey) || "draft");
    }
    setLoading(false);
  }, [requestId, user]);

  useEffect(() => {
    void fetchRequestDetails();
  }, [fetchRequestDetails]);

  const handleUpdateStatus = async () => {
    if (!user || !request) return;
    setSubmitting(true);
    try {
      const updates: Record<string, unknown> = { status: newStatus, updated_at: new Date().toISOString() };
      if (newStatus === "submitted" && !request.submitted_date) updates.submitted_date = new Date().toISOString();
      const note = updateNote.trim();
      if (note) updates.notes = request.notes ? `${request.notes}\n${note}` : note;

      const { error } = await supabase
        .from("foia_requests")
        .update(updates as any)
        .eq("id", requestId)
        .eq("user_id", user.id);
      if (error) throw error;

      toast.success("Tracking status updated");
      setUpdateNote("");
      setEditMode(false);
      await fetchRequestDetails();
    } catch (error) {
      console.error("Unable to update request", error);
      toast.error("Unable to update request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Loading request details…</CardContent></Card>;
  }

  if (!request) {
    return (
      <Card><CardContent className="py-12 text-center"><FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" /><p className="mb-4 font-semibold">Request not found or not accessible.</p>{onBack && <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>}</CardContent></Card>
    );
  }

  const statusLabel = STATUS_OPTIONS.find((option) => option.value === request.status)?.label || request.status || "Draft";

  return (
    <div className="space-y-6">
      {onBack && <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back to requests</Button>}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Civil Rights Hub is not calculating a statutory response deadline for this request. Any legacy response-deadline value stored on an older record is intentionally not displayed as a legal conclusion. Check the governing law and official agency guidance for deadlines, extensions, appeals, and remedies.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-2xl">{request.request_subject || "Untitled request"}</CardTitle>
              <CardDescription className="mt-2 flex flex-wrap gap-3">
                <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{request.agency_name}</span>
                {request.state && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{request.state}</span>}
                {request.submitted_date && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Recorded submitted {format(new Date(request.submitted_date), "MMM d, yyyy")}</span>}
              </CardDescription>
            </div>
            <Badge variant="outline">{statusLabel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div><h3 className="mb-2 font-semibold">Request text</h3><div className="whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm">{request.request_body}</div></div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            {request.contact_name && <div><p className="text-xs text-muted-foreground">Requester</p><p className="flex items-center gap-1 text-sm"><User className="h-3.5 w-3.5" />{request.contact_name}</p></div>}
            {request.contact_email && <div><p className="text-xs text-muted-foreground">Contact email</p><p className="text-sm">{request.contact_email}</p></div>}
            {request.tracking_number && <div><p className="text-xs text-muted-foreground">Tracking number you recorded</p><p className="text-sm">{request.tracking_number}</p></div>}
            {request.submission_method && <div><p className="text-xs text-muted-foreground">Submission method you recorded</p><p className="text-sm capitalize">{request.submission_method.replaceAll("_", " ")}</p></div>}
          </div>
          {request.notes && <div><h3 className="mb-2 font-semibold">Your notes</h3><div className="whitespace-pre-wrap rounded-lg border p-3 text-sm">{request.notes}</div></div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Update your tracking status</CardTitle><CardDescription>Status labels reflect what you record; they are not independently verified by Civil Rights Hub.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          {!editMode ? (
            <div className="flex items-center justify-between gap-4"><p className="text-sm">Current status: <strong>{statusLabel}</strong></p><Button variant="outline" onClick={() => setEditMode(true)}>Update status</Button></div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Status</Label><Select value={newStatus} onValueChange={(value) => setNewStatus(value as StatusKey)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STATUS_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="tracking-note">Optional note</Label><Textarea id="tracking-note" value={updateNote} onChange={(event) => setUpdateNote(event.target.value)} placeholder="Record correspondence, a reference number, or what you plan to do next." /></div>
              <div className="flex gap-2"><Button disabled={submitting} onClick={() => void handleUpdateStatus()}><Save className="mr-2 h-4 w-4" />Save</Button><Button variant="outline" onClick={() => { setEditMode(false); setUpdateNote(""); }}>Cancel</Button></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
