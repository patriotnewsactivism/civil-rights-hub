import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Clock,
  Building2,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  MessageSquare,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type FOIARequest = Database["public"]["Tables"]["foia_requests"]["Row"];
type FOIARequestUpdate = Database["public"]["Tables"]["foia_request_updates"]["Row"];
type FOIADocument = Database["public"]["Tables"]["foia_documents"]["Row"];
type FOIAAgency = Database["public"]["Tables"]["foia_agencies"]["Row"];

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
  const [agency, setAgency] = useState<FOIAAgency | null>(null);
  const [updates, setUpdates] = useState<FOIARequestUpdate[]>([]);
  const [documents, setDocuments] = useState<FOIADocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [newStatus, setNewStatus] = useState<StatusKey>("submitted");
  const [updateNote, setUpdateNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequestDetails = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch request
      const { data: requestData, error: requestError } = await supabase
        .from("foia_requests")
        .select("*")
        .eq("id", requestId)
        .eq("user_id", user.id)
        .single();

      if (requestError) throw requestError;
      setRequest(requestData);

      // Fetch agency if linked
      if (requestData.agency_id) {
        const { data: agencyData, error: agencyError } = await supabase
          .from("foia_agencies")
          .select("*")
          .eq("id", requestData.agency_id)
          .single();

        if (!agencyError) {
          setAgency(agencyData);
        }
      }

      // Fetch updates
      const { data: updatesData, error: updatesError } = await supabase
        .from("foia_request_updates")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      if (updatesError) throw updatesError;
      setUpdates(updatesData || []);

      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from("foia_documents")
        .select("*")
        .eq("request_id", requestId)
        .order("uploaded_at", { ascending: false });

      if (documentsError) throw documentsError;
      setDocuments(documentsData || []);
    } catch (error) {
      console.error("Error fetching request details:", error);
      toast.error("Failed to load request details");
    } finally {
      setLoading(false);
    }
  }, [user, requestId]);

  useEffect(() => {
    void fetchRequestDetails();
  }, [fetchRequestDetails]);

  const handleAddUpdate = async () => {
    if (!user || !request || !updateNote.trim()) {
      toast.error("Please enter an update note");
      return;
    }

    setSubmitting(true);
    try {
      const oldStatus = request.status || "draft";

      // Add update record
      const { error: updateError } = await supabase.from("foia_request_updates").insert({
        request_id: requestId,
        update_type: newStatus !== oldStatus ? "status_change" : "note",
        message: updateNote,
        old_status: newStatus !== oldStatus ? oldStatus : null,
        new_status: newStatus !== oldStatus ? newStatus : null,
      });

      if (updateError) throw updateError;

      // Update request status if changed
      if (newStatus !== oldStatus) {
        const { error: requestError } = await supabase
          .from("foia_requests")
          .update({ status: newStatus })
          .eq("id", requestId);

        if (requestError) throw requestError;
      }

      toast.success("Update added successfully");
      setUpdateNote("");
      setEditMode(false);
      await fetchRequestDetails();
    } catch (error) {
      console.error("Error adding update:", error);
      toast.error("Failed to add update");
    } finally {
      setSubmitting(false);
    }
  };

  const getDeadlineInfo = () => {
    if (!request?.response_due_date) return null;

    const deadline = new Date(request.response_due_date);
    const daysRemaining = differenceInDays(deadline, new Date());

    return {
      deadline,
      daysRemaining,
      isOverdue: daysRemaining < 0,
      isApproaching: daysRemaining >= 0 && daysRemaining <= 5,
    };
  };

  const deadlineInfo = getDeadlineInfo();

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading request details...</p>
        </CardContent>
      </Card>
    );
  }

  if (!request) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-lg font-semibold mb-1">Request not found</p>
          <p className="text-sm text-muted-foreground mb-4">This request doesn't exist or you don't have access to it</p>
          {onBack && (
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      )}

      {deadlineInfo?.isOverdue && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Response Overdue:</strong> This agency is {Math.abs(deadlineInfo.daysRemaining)} days past their
            response deadline. You may consider filing a follow-up request, appeal, or legal action under FOIA.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{request.subject}</CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {request.agency_name}
                </div>
                {request.state && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {request.state}
                  </div>
                )}
                {request.submitted_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Submitted {format(new Date(request.submitted_at), "MMM d, yyyy")}
                  </div>
                )}
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {STATUS_OPTIONS.find((s) => s.value === request.status)?.label || request.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {deadlineInfo && (
            <div
              className={`rounded-lg border p-4 ${
                deadlineInfo.isOverdue
                  ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                  : deadlineInfo.isApproaching
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                  : "border-border bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Response Deadline</p>
                    <p className="text-sm text-muted-foreground">
                      {format(deadlineInfo.deadline, "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={deadlineInfo.isOverdue ? "destructive" : deadlineInfo.isApproaching ? "default" : "secondary"}
                  className="text-base px-3 py-1"
                >
                  {deadlineInfo.isOverdue
                    ? `${Math.abs(deadlineInfo.daysRemaining)} days overdue`
                    : `${deadlineInfo.daysRemaining} days remaining`}
                </Badge>
              </div>
            </div>
          )}

          {agency && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Agency Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {agency.foia_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${agency.foia_email}`} className="text-primary hover:underline">
                      {agency.foia_email}
                    </a>
                  </div>
                )}
                {agency.foia_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${agency.foia_phone}`} className="text-primary hover:underline">
                      {agency.foia_phone}
                    </a>
                  </div>
                )}
              </div>
              {agency.mailing_address && (
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">Mailing Address:</p>
                  <p className="whitespace-pre-line">{agency.mailing_address}</p>
                </div>
              )}
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold">Request Details</h3>
            <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-line">{request.details}</div>
          </div>

          {request.requester_name && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Requester Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p>{request.requester_name}</p>
                </div>
                {request.requester_email && (
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p>{request.requester_email}</p>
                  </div>
                )}
                {request.requester_address && (
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Address</p>
                    <p>{request.requester_address}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Request Timeline ({updates.length})
            </CardTitle>
            <Button
              size="sm"
              variant={editMode ? "ghost" : "outline"}
              onClick={() => {
                setEditMode(!editMode);
                if (editMode) {
                  setUpdateNote("");
                  setNewStatus((request.status as StatusKey) || "submitted");
                }
              }}
            >
              {editMode ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Add Update
                </>
              )}
            </Button>
          </div>
          <CardDescription>Track all updates, status changes, and communications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {editMode && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="update-status">Update Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as StatusKey)}>
                  <SelectTrigger id="update-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-note">Update Note *</Label>
                <Textarea
                  id="update-note"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="Describe what happened with this request (e.g., 'Received acknowledgment email from agency', 'Agency requested additional details', 'Received partial response')"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddUpdate} disabled={submitting || !updateNote.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  {submitting ? "Saving..." : "Save Update"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditMode(false);
                    setUpdateNote("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {updates.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No updates yet. Add your first update to track the progress of this request.
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update, index) => (
                <div key={update.id} className="flex gap-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {update.update_type === "status_change" ? (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    {index < updates.length - 1 && (
                      <div className="absolute left-1/2 top-8 bottom-0 w-px bg-border -translate-x-1/2 h-full" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium">{update.message}</p>
                      {update.update_type === "status_change" && update.new_status && (
                        <Badge variant="outline">
                          {update.old_status} → {update.new_status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {update.created_at && format(new Date(update.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Documents ({documents.length})
          </CardTitle>
          <CardDescription>Uploaded responses and related documents</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <Upload className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-xs mt-1">Document upload functionality coming soon</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.file_type} • {doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : "Unknown size"}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
