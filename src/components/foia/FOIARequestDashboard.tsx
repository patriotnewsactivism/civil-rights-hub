import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Bell,
  Search,
  Filter,
  Calendar,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { differenceInDays, format, isPast, isFuture } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type FOIARequest = Database["public"]["Tables"]["foia_requests"]["Row"];

type StatusKey = "draft" | "submitted" | "acknowledged" | "processing" | "completed" | "denied" | "appealed";

const STATUS_CONFIG: Record<
  StatusKey,
  { label: string; icon: typeof FileText; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "Draft", icon: FileText, color: "text-muted-foreground", badgeVariant: "secondary" },
  submitted: { label: "Submitted", icon: Clock, color: "text-blue-600", badgeVariant: "default" },
  acknowledged: { label: "Acknowledged", icon: CheckCircle, color: "text-green-600", badgeVariant: "default" },
  processing: { label: "Processing", icon: Clock, color: "text-yellow-600", badgeVariant: "default" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-green-700", badgeVariant: "default" },
  denied: { label: "Denied", icon: XCircle, color: "text-red-600", badgeVariant: "destructive" },
  appealed: { label: "Appealed", icon: AlertCircle, color: "text-orange-600", badgeVariant: "default" },
};

interface DeadlineAlert {
  requestId: string;
  daysOverdue: number;
  isOverdue: boolean;
  isApproaching: boolean;
}

interface FOIARequestDashboardProps {
  onRequestSelect?: (request: FOIARequest) => void;
}

export function FOIARequestDashboard({ onRequestSelect }: FOIARequestDashboardProps) {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FOIARequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusKey | "all">("all");

  const fetchRequests = useCallback(async () => {
    if (!user) {
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
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching FOIA requests:", error);
      toast.error("Failed to load FOIA requests");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const getDeadlineAlert = useCallback((request: FOIARequest): DeadlineAlert | null => {
    if (!request.response_due_date || ["completed", "denied"].includes(request.status || "")) {
      return null;
    }

    const deadline = new Date(request.response_due_date);
    const now = new Date();
    const daysRemaining = differenceInDays(deadline, now);

    return {
      requestId: request.id,
      daysOverdue: Math.abs(daysRemaining),
      isOverdue: isPast(deadline),
      isApproaching: isFuture(deadline) && daysRemaining <= 5,
    };
  }, []);

  const deadlineAlerts = useMemo(() => {
    const alerts: DeadlineAlert[] = [];
    requests.forEach((request) => {
      const alert = getDeadlineAlert(request);
      if (alert && (alert.isOverdue || alert.isApproaching)) {
        alerts.push(alert);
      }
    });
    return alerts.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return b.daysOverdue - a.daysOverdue;
    });
  }, [requests, getDeadlineAlert]);

  const filteredRequests = useMemo(() => {
    let filtered = requests;

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.subject?.toLowerCase().includes(query) ||
          r.agency_name?.toLowerCase().includes(query) ||
          r.details?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [requests, statusFilter, searchQuery]);

  const requestsByStatus = useMemo(() => {
    const active = filteredRequests.filter((r) => !["completed", "denied"].includes(r.status || ""));
    const completed = filteredRequests.filter((r) => ["completed", "denied"].includes(r.status || ""));
    const overdue = filteredRequests.filter((r) => {
      const alert = getDeadlineAlert(r);
      return alert?.isOverdue;
    });

    return { active, completed, overdue };
  }, [filteredRequests, getDeadlineAlert]);

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">Sign in required</h3>
          <p className="text-muted-foreground">Please sign in to view your FOIA request dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {deadlineAlerts.length > 0 && (
        <Alert variant={deadlineAlerts.some((a) => a.isOverdue) ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Deadline Alerts ({deadlineAlerts.length})</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              {deadlineAlerts.slice(0, 3).map((alert) => {
                const request = requests.find((r) => r.id === alert.requestId);
                if (!request) return null;
                return (
                  <div key={alert.requestId} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">
                      {request.subject} - {request.agency_name}
                    </span>
                    <Badge variant={alert.isOverdue ? "destructive" : "secondary"} className="ml-2">
                      {alert.isOverdue
                        ? `${alert.daysOverdue} days overdue`
                        : `${alert.daysOverdue} days remaining`}
                    </Badge>
                  </div>
                );
              })}
              {deadlineAlerts.length > 3 && (
                <p className="text-xs text-muted-foreground mt-2">
                  +{deadlineAlerts.length - 3} more deadline alerts
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                FOIA Request Dashboard
              </CardTitle>
              <CardDescription>
                Track and manage all your Freedom of Information Act requests
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {requests.length} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{requestsByStatus.active.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                    <p className="text-2xl font-bold">{requestsByStatus.overdue.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{requestsByStatus.completed.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests by subject, agency, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusKey | "all")}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="denied">Denied</option>
                <option value="appealed">Appealed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading requests...</p>
          </CardContent>
        </Card>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-lg font-semibold mb-1">No requests found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first FOIA request to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active ({requestsByStatus.active.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({requestsByStatus.completed.length})</TabsTrigger>
            <TabsTrigger value="all">All Requests ({filteredRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3">
            {requestsByStatus.active.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No active requests. All your requests have been completed or denied.
                </CardContent>
              </Card>
            ) : (
              requestsByStatus.active.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  deadlineAlert={getDeadlineAlert(request)}
                  onSelect={onRequestSelect}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {requestsByStatus.completed.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No completed requests yet.
                </CardContent>
              </Card>
            ) : (
              requestsByStatus.completed.map((request) => (
                <RequestCard key={request.id} request={request} deadlineAlert={null} onSelect={onRequestSelect} />
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-3">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                deadlineAlert={getDeadlineAlert(request)}
                onSelect={onRequestSelect}
              />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface RequestCardProps {
  request: FOIARequest;
  deadlineAlert: DeadlineAlert | null;
  onSelect?: (request: FOIARequest) => void;
}

function RequestCard({ request, deadlineAlert, onSelect }: RequestCardProps) {
  const statusKey = (request.status || "draft") as StatusKey;
  const statusConfig = STATUS_CONFIG[statusKey] || STATUS_CONFIG.draft;
  const StatusIcon = statusConfig.icon;

  return (
    <Card
      className={`transition-all hover:shadow-md cursor-pointer ${
        deadlineAlert?.isOverdue ? "border-red-500 bg-red-50/50 dark:bg-red-950/10" : ""
      }`}
      onClick={() => onSelect?.(request)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-1 truncate">{request.subject}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{request.agency_name}</span>
              {request.state && (
                <>
                  <span>•</span>
                  <span>{request.state}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant={statusConfig.badgeVariant} className="shrink-0">
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {request.submitted_at && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              Submitted: {format(new Date(request.submitted_at), "MMM d, yyyy")}
            </span>
          </div>
        )}

        {request.response_due_date && !["completed", "denied"].includes(request.status || "") && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              Deadline: {format(new Date(request.response_due_date), "MMM d, yyyy")}
            </span>
            {deadlineAlert && (
              <Badge
                variant={deadlineAlert.isOverdue ? "destructive" : "secondary"}
                className="ml-auto"
              >
                {deadlineAlert.isOverdue
                  ? `${deadlineAlert.daysOverdue} days overdue`
                  : `${deadlineAlert.daysOverdue} days left`}
              </Badge>
            )}
          </div>
        )}

        {deadlineAlert?.isOverdue && (
          <Alert variant="destructive" className="py-2">
            <Bell className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Action Required:</strong> This agency is past their response deadline. Consider filing
              a follow-up request or appeal. Under FOIA, you may have grounds for legal action.
            </AlertDescription>
          </Alert>
        )}

        {deadlineAlert?.isApproaching && !deadlineAlert.isOverdue && (
          <Alert className="py-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-xs text-yellow-900 dark:text-yellow-200">
              Deadline is approaching soon. Monitor for a response from the agency.
            </AlertDescription>
          </Alert>
        )}

        {request.details && (
          <div className="text-sm text-muted-foreground line-clamp-2 bg-muted/30 p-2 rounded">
            {request.details}
          </div>
        )}

        <div className="pt-2 flex gap-2">
          <Button size="sm" variant="outline" onClick={(e) => {
            e.stopPropagation();
            onSelect?.(request);
          }}>
            View Details
          </Button>
          {request.status === "draft" && (
            <Button size="sm" variant="outline">
              Edit Draft
            </Button>
          )}
          {deadlineAlert?.isOverdue && (
            <Button size="sm" variant="destructive">
              File Appeal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
