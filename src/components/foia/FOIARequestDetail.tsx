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
  Calendar,
  User,
  MapPin,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  Edit,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays, addBusinessDays } from "date-fns";

interface FOIARequest {
  id: string;
  agency_name: string;
  subject: string;
  details: string;
  request_type: string;
  state: string;
  status: string | null;
  requester_name: string;
  requester_email: string;
  requester_address: string | null;
  submitted_at: string | null;
  response_due_date: string | null;
  response_text: string | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
}

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

// State-specific response deadlines (in business days)
const STATE_RESPONSE_DAYS: Record<string, number> = {
  "Federal": 20,
  "California": 10,
  "New York": 5,
  "Texas": 10,
  "Florida": 10,
  "Illinois": 5,
  "Pennsylvania": 5,
  "Ohio": 10,
  "Georgia": 3,
  "North Carolina": 10,
  "Michigan": 5,
  "New Jersey": 7,
  "Virginia": 5,
  "Washington": 5,
  "Arizona": 5,
  "Massachusetts": 10,
  "Tennessee": 7,
  "Indiana": 7,
  "Missouri": 3,
  "Maryland": 10,
  "Wisconsin": 10,
  "Colorado": 3,
  "Minnesota": 10,
  "South Carolina": 15,
  "Alabama": 10,
  "Louisiana": 3,
  "Kentucky": 3,
  "Oregon": 5,
  "Oklahoma": 3,
  "Connecticut": 4,
  "Utah": 10,
  "Iowa": 10,
  "Nevada": 5,
  "Arkansas": 3,
  "Mississippi": 7,
  "Kansas": 3,
  "New Mexico": 15,
  "Nebraska": 4,
  "West Virginia": 5,
  "Idaho": 3,
  "Hawaii": 10,
  "New Hampshire": 5,
  "Maine": 5,
  "Montana": 5,
  "Rhode Island": 10,
  "Delaware": 15,
  "South Dakota": 5,
  "North Dakota": 5,
  "Alaska": 10,
  "Vermont": 3,
  "Wyoming": 5,
};

interface FOIARequestDetailProps {
  requestId: string;
  onBack?: () => void;
}

export function FOIARequestDetail({ requestId, onBack }: FOIARequestDetailProps) {
  const { user } = useAuth();
  const [request, setRequest] = useState<FOIARequest | null>(null);
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
      const { data: requestData, error: requestError } = await supabase
        .from("foia_requests")
        .select("*")
        .eq("id", requestId)
        .eq("user_id", user.id)
        .single();

      if (requestError) throw requestError;
      setRequest(requestData as FOIARequest);
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

  const handleUpdateStatus = async () => {
    if (!user || !request) {
      toast.error("Please enter an update note");
      return;
    }

    setSubmitting(true);
    try {
      const { error: requestError } = await supabase
        .from("foia_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

      if (requestError) throw requestError;

      toast.success("Status updated successfully");
      setUpdateNote("");
      setEditMode(false);
      await fetchRequestDetails();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const getDeadlineInfo = () => {
    if (!request?.response_due_date) {
      // Calculate deadline based on state
      if (request?.submitted_at) {
        const stateDays = STATE_RESPONSE_DAYS[request.state] || STATE_RESPONSE_DAYS["Federal"];
        const deadline = addBusinessDays(new Date(request.submitted_at), stateDays);
        const daysRemaining = differenceInDays(deadline, new Date());
        
        return {
          deadline,
          daysRemaining,
          isOverdue: daysRemaining < 0,
          isApproaching: daysRemaining >= 0 && daysRemaining <= 5,
          isCalculated: true,
        };
      }
      return null;
    }

    const deadline = new Date(request.response_due_date);
    const daysRemaining = differenceInDays(deadline, new Date());

    return {
      deadline,
      daysRemaining,
      isOverdue: daysRemaining < 0,
      isApproaching: daysRemaining >= 0 && daysRemaining <= 5,
      isCalculated: false,
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
            response deadline. You may consider filing a follow-up request, appeal, or legal action.
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
              {STATUS_OPTIONS.find((s) => s.value === request.status)?.label || request.status || "Draft"}
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
                    <p className="font-semibold">
                      Response Deadline {deadlineInfo.isCalculated && "(Estimated)"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(deadlineInfo.deadline, "MMMM d, yyyy")}
                      {deadlineInfo.isCalculated && (
                        <span className="ml-2">
                          ({STATE_RESPONSE_DAYS[request.state] || 20} business days for {request.state || "Federal"})
                        </span>
                      )}
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
              Update Status
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
                  Update Status
                </>
              )}
            </Button>
          </div>
          <CardDescription>Track the progress of your FOIA request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {editMode && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="update-status">New Status</Label>
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
                <Label htmlFor="update-note">Notes (optional)</Label>
                <Textarea
                  id="update-note"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="Add any notes about this status change..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdateStatus} disabled={submitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {submitting ? "Saving..." : "Save Status"}
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

          {!editMode && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              <p>Current status: <strong>{STATUS_OPTIONS.find((s) => s.value === request.status)?.label || "Draft"}</strong></p>
              <p className="mt-2">Click "Update Status" to track changes to your request.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
