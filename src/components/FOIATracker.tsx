import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Calendar,
  Bell,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type FOIARequest = Database["public"]["Tables"]["foia_requests"]["Row"];

type DeadlineStatus = {
  text: string;
  color: string;
  urgent: boolean;
};

type StatusKey =
  | "draft"
  | "submitted"
  | "acknowledged"
  | "processing"
  | "completed"
  | "denied"
  | "appealed";

const STATUS_CONFIG: Record<StatusKey, { label: string; icon: LucideIcon; color: string }> = {
  draft: { label: "Draft", icon: FileText, color: "bg-muted text-foreground" },
  submitted: { label: "Submitted", icon: Clock, color: "bg-blue-500 text-white" },
  acknowledged: { label: "Acknowledged", icon: CheckCircle, color: "bg-green-500 text-white" },
  processing: { label: "Processing", icon: Clock, color: "bg-yellow-500 text-white" },
  completed: { label: "Completed", icon: CheckCircle, color: "bg-green-600 text-white" },
  denied: { label: "Denied", icon: XCircle, color: "bg-red-500 text-white" },
  appealed: { label: "Appealed", icon: AlertCircle, color: "bg-orange-500 text-white" },
};

const STATUS_OPTIONS: { value: StatusKey; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "denied", label: "Denied" },
  { value: "appealed", label: "Appealed" },
];

const REQUEST_TYPES = [
  "Police Records",
  "Court Records",
  "Government Emails",
  "Arrest Records",
  "Body Camera Footage",
  "Use of Force Reports",
  "Budget Documents",
  "Meeting Minutes",
  "Other",
] as const;

type RequestType = (typeof REQUEST_TYPES)[number];

interface QuickRequestForm {
  subject: string;
  agency_name: string;
  request_type: RequestType | "";
  state: string;
  details: string;
  submitted_at: string;
  response_due_date: string;
  status: StatusKey;
}

const EMPTY_FORM: QuickRequestForm = {
  subject: "",
  agency_name: "",
  request_type: "",
  state: "",
  details: "",
  submitted_at: "",
  response_due_date: "",
  status: "draft",
};

export function FOIATracker() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FOIARequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [formState, setFormState] = useState<QuickRequestForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!user?.id) {
      setRequests([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("foia_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setRequests(data ?? []);
    } catch (error) {
      console.error("Error fetching FOIA requests:", error);
      toast.error("Failed to load FOIA requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const getDeadlineStatus = useCallback((deadline: string | null): DeadlineStatus | null => {
    if (!deadline) return null;

    const daysRemaining = differenceInDays(new Date(deadline), new Date());

    if (daysRemaining < 0) {
      return { text: `${Math.abs(daysRemaining)} days overdue`, color: "text-red-600", urgent: true };
    }
    if (daysRemaining <= 3) {
      return { text: `${daysRemaining} days remaining`, color: "text-orange-600", urgent: true };
    }
    return { text: `${daysRemaining} days remaining`, color: "text-muted-foreground", urgent: false };
  }, []);

  const filteredRequests = useMemo(() => {
    const active = requests.filter((request) => !["completed", "denied"].includes(request.status ?? ""));
    const completed = requests.filter((request) => ["completed", "denied"].includes(request.status ?? ""));
    return { active, completed };
  }, [requests]);

  const handleFormChange = <Field extends keyof QuickRequestForm>(field: Field, value: QuickRequestForm[Field]) => {
    setFormState((state) => ({ ...state, [field]: value }));
  };

  const handleSubmitRequest = async () => {
    if (!user?.id) {
      toast.error("Please sign in to log FOIA requests");
      return;
    }

    if (!formState.subject || !formState.agency_name || !formState.state) {
      toast.error("Subject, agency, and state are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Database["public"]["Tables"]["foia_requests"]["Insert"] = {
        subject: formState.subject,
        agency_name: formState.agency_name,
        request_type: formState.request_type || "Other",
        state: formState.state,
        details: formState.details || "",
        user_id: user.id,
        status: formState.status,
        submitted_at: formState.submitted_at ? new Date(formState.submitted_at).toISOString() : null,
        response_due_date: formState.response_due_date ? new Date(formState.response_due_date).toISOString() : null,
        requester_name: user.user_metadata?.full_name ?? user.email ?? "",
        requester_email: user.email ?? "",
        requester_address: null,
        response_text: null,
      };

      const { error } = await supabase.from("foia_requests").insert(payload);
      if (error) throw error;

      toast.success("FOIA request logged successfully");
      setFormState(EMPTY_FORM);
      setShowNewRequest(false);
      await fetchRequests();
    } catch (error) {
      console.error("Error saving FOIA request:", error);
      toast.error(error instanceof Error ? error.message : "Unable to save FOIA request");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <section id="foia-tracker" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">Sign in required</h3>
              <p className="text-muted-foreground">Please sign in to track and manage your FOIA requests.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="foia-tracker" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="mb-2 flex items-center gap-3 text-3xl font-bold md:text-4xl">
            <FileText className="h-10 w-10 text-primary" />
            FOIA Request Tracker
          </h2>
          <p className="text-lg text-muted-foreground">Manage the entire lifecycle of your Freedom of Information Act requests</p>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Button onClick={() => setShowNewRequest((value) => !value)} className="gap-2">
            <Plus className="h-4 w-4" />
            {showNewRequest ? "Cancel" : "Log new FOIA request"}
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClipboardList className="h-4 w-4" />
            Keep track of agency responses and deadlines in one place.
          </div>
        </div>

        {showNewRequest && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick FOIA Log</CardTitle>
              <CardDescription>
                Record requests you submitted outside this app so we can track deadlines and responses for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="foia-subject">Subject</Label>
                  <Input
                    id="foia-subject"
                    value={formState.subject}
                    onChange={(event) => handleFormChange("subject", event.target.value)}
                    placeholder="Body camera footage request"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foia-agency">Agency name</Label>
                  <Input
                    id="foia-agency"
                    value={formState.agency_name}
                    onChange={(event) => handleFormChange("agency_name", event.target.value)}
                    placeholder="City of Oakland Police Department"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="foia-type">Request type</Label>
                  <Select
                    value={formState.request_type}
                    onValueChange={(value) => handleFormChange("request_type", value as RequestType | "")}
                  >
                    <SelectTrigger id="foia-type">
                      <SelectValue placeholder="Choose a request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {REQUEST_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foia-state">State</Label>
                  <Input
                    id="foia-state"
                    value={formState.state}
                    onChange={(event) => handleFormChange("state", event.target.value)}
                    placeholder="California"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foia-status">Status</Label>
                  <Select value={formState.status} onValueChange={(value) => handleFormChange("status", value as StatusKey)}>
                    <SelectTrigger id="foia-status">
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
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="foia-submitted">Submitted date</Label>
                  <Input
                    id="foia-submitted"
                    type="date"
                    value={formState.submitted_at}
                    onChange={(event) => handleFormChange("submitted_at", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foia-deadline">Response deadline</Label>
                  <Input
                    id="foia-deadline"
                    type="date"
                    value={formState.response_due_date}
                    onChange={(event) => handleFormChange("response_due_date", event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foia-details">Request details</Label>
                <Textarea
                  id="foia-details"
                  value={formState.details}
                  onChange={(event) => handleFormChange("details", event.target.value)}
                  placeholder="Describe the records you requested and any agency communications."
                  className="min-h-24"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewRequest(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRequest} disabled={submitting}>
                  {submitting ? "Saving..." : "Save request"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="py-12 text-center">Loading requests...</div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p className="mb-2 text-lg">No FOIA requests yet</p>
              <p className="text-sm">Log a request to start tracking deadlines and responses.</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active requests</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All requests</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {filteredRequests.active.map((request) => (
                <RequestCard key={request.id} request={request} getDeadlineStatus={getDeadlineStatus} />
              ))}
              {filteredRequests.active.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    No active requests. Log a new request or update an existing one when the agency responds.
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filteredRequests.completed.map((request) => (
                <RequestCard key={request.id} request={request} getDeadlineStatus={getDeadlineStatus} />
              ))}
              {filteredRequests.completed.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    Completed or denied requests will appear here.
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {requests.map((request) => (
                <RequestCard key={request.id} request={request} getDeadlineStatus={getDeadlineStatus} />
              ))}
            </TabsContent>
          </Tabs>
        )}

        <Card className="mt-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Deadline reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Federal agencies:</strong> Must respond within 20 business days (~28 calendar days).
            </p>
            <p>
              <strong>State agencies:</strong> Response times vary by state (typically 10-14 business days).
            </p>
            <p className="text-muted-foreground">
              You'll receive alerts here when deadlines are approaching or agencies are overdue.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function RequestCard({
  request,
  getDeadlineStatus,
}: {
  request: FOIARequest;
  getDeadlineStatus: (deadline: string | null) => DeadlineStatus | null;
}) {
  const statusKey = (request.status ?? "draft") as StatusKey;
  const statusConfig = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.draft;
  const StatusIcon = statusConfig.icon;
  const deadlineStatus = getDeadlineStatus(request.response_due_date);

  return (
    <Card className={deadlineStatus?.urgent ? "border-red-500" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-1 text-lg">{request.subject}</CardTitle>
            <CardDescription>{request.agency_name}</CardDescription>
          </div>
          <Badge className={statusConfig.color}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {request.submitted_at && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Submitted: {format(new Date(request.submitted_at), "MMM d, yyyy")}</span>
          </div>
        )}

        {deadlineStatus && (
          <div className={`flex items-center gap-2 text-sm ${deadlineStatus.color}`}>
            <Clock className="h-4 w-4" />
            <span className="font-medium">
              {request.response_due_date
                ? `Deadline: ${format(new Date(request.response_due_date), "MMM d, yyyy")} - ${deadlineStatus.text}`
                : "No deadline set"}
            </span>
          </div>
        )}

        {deadlineStatus?.urgent && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
            <div className="flex items-start gap-2">
              <Bell className="mt-0.5 h-4 w-4 text-red-600" />
              <div className="text-xs text-red-900 dark:text-red-200">
                <strong>Action required:</strong> {deadlineStatus.text.includes("overdue")
                  ? "This agency is past their response deadline. Consider filing a follow-up or appeal."
                  : "Deadline is approaching soon. Monitor for a response."}
              </div>
            </div>
          </div>
        )}

        {request.details && (
          <div className="rounded-md bg-muted/30 p-3 text-sm">
            <p className="font-medium text-muted-foreground">Request details</p>
            <p className="mt-1 whitespace-pre-line">{request.details}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm">
            View details
          </Button>
          <Button variant="outline" size="sm">
            Update status
          </Button>
          <Button variant="outline" size="sm">
            Add note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
