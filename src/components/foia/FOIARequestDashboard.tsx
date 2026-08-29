import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Building2, CheckCircle, Clock, FileText, Search, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type FOIARequest = Database["public"]["Tables"]["foia_requests"]["Row"];
type StatusKey = "draft" | "submitted" | "acknowledged" | "processing" | "completed" | "denied" | "appealed";

const STATUS_CONFIG: Record<StatusKey, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  submitted: { label: "Submitted", variant: "default" },
  acknowledged: { label: "Acknowledged", variant: "default" },
  processing: { label: "Processing", variant: "outline" },
  completed: { label: "Completed", variant: "default" },
  denied: { label: "Denied", variant: "destructive" },
  appealed: { label: "Appealed", variant: "outline" },
};

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
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("foia_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Unable to load public-records requests", error);
      toast.error("Unable to load requests");
      setRequests([]);
    } else {
      setRequests(data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      const matchesQuery = !query || [request.request_subject, request.agency_name, request.request_body, request.state]
        .some((value) => value?.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [requests, searchQuery, statusFilter]);

  const counts = useMemo(() => ({
    active: requests.filter((request) => !["completed", "denied"].includes(request.status || "")).length,
    completed: requests.filter((request) => request.status === "completed").length,
    denied: requests.filter((request) => request.status === "denied").length,
  }), [requests]);

  if (!user) {
    return (
      <Card><CardContent className="py-12 text-center"><FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" /><h3 className="mb-2 text-xl font-semibold">Sign in required</h3><p className="text-muted-foreground">Sign in to view your saved public-records requests.</p></CardContent></Card>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Dates in this workspace are your tracking records, not Civil Rights Hub determinations of a statutory response deadline. Verify legal deadlines and appeal rights from the governing law or an official agency source.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Public Records Request Dashboard</CardTitle>
          <CardDescription>Track the requests and status changes you record yourself.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <Stat label="Active" value={counts.active} icon={Clock} />
            <Stat label="Completed" value={counts.completed} icon={CheckCircle} />
            <Stat label="Denied" value={counts.denied} icon={XCircle} />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search your requests" className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusKey | "all")}>
              <SelectTrigger className="sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([value, config]) => <SelectItem key={value} value={value}>{config.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Loading requests…</CardContent></Card>
      ) : filteredRequests.length === 0 ? (
        <Card className="border-dashed"><CardContent className="py-10 text-center text-sm text-muted-foreground">No requests match this view.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => {
            const status = STATUS_CONFIG[(request.status || "draft") as StatusKey] ?? STATUS_CONFIG.draft;
            return (
              <Card key={request.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => onRequestSelect?.(request)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {request.submission_method && request.submission_method !== "draft" && <Badge variant="outline">{request.submission_method.replaceAll("_", " ")}</Badge>}
                      </div>
                      <p className="truncate font-semibold">{request.request_subject || "Untitled request"}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Building2 className="h-3.5 w-3.5" />{request.agency_name}{request.state ? ` · ${request.state}` : ""}</p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground">
                      {request.submitted_date ? <>Recorded submitted<br />{format(new Date(request.submitted_date), "MMM d, yyyy")}</> : <>Saved<br />{format(new Date(request.created_at), "MMM d, yyyy")}</>}
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

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Clock }) {
  return <div className="rounded-xl border p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p></div><Icon className="h-6 w-6 text-primary" /></div></div>;
}
