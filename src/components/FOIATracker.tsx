import { useState, useEffect } from "react";
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
  Bell
} from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";

interface FOIARequest {
  id: string;
  agency_name: string;
  request_subject: string;
  status: string;
  submitted_date: string | null;
  response_deadline: string | null;
  created_at: string;
}

const STATUS_CONFIG = {
  draft: { label: "Draft", icon: FileText, color: "bg-gray-500" },
  submitted: { label: "Submitted", icon: Clock, color: "bg-blue-500" },
  acknowledged: { label: "Acknowledged", icon: CheckCircle, color: "bg-green-500" },
  processing: { label: "Processing", icon: Clock, color: "bg-yellow-500" },
  completed: { label: "Completed", icon: CheckCircle, color: "bg-green-600" },
  denied: { label: "Denied", icon: XCircle, color: "bg-red-500" },
  appealed: { label: "Appealed", icon: AlertCircle, color: "bg-orange-500" },
};

export function FOIATracker() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FOIARequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('foia_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching FOIA requests:', error);
      toast.error("Failed to load FOIA requests");
    } finally {
      setLoading(false);
    }
  };

  const getDeadlineStatus = (deadline: string | null) => {
    if (!deadline) return null;

    const daysRemaining = differenceInDays(new Date(deadline), new Date());

    if (daysRemaining < 0) {
      return { text: `${Math.abs(daysRemaining)} days overdue`, color: "text-red-600", urgent: true };
    } else if (daysRemaining <= 3) {
      return { text: `${daysRemaining} days remaining`, color: "text-orange-600", urgent: true };
    } else {
      return { text: `${daysRemaining} days remaining`, color: "text-muted-foreground", urgent: false };
    }
  };

  if (!user) {
    return (
      <section id="foia-tracker" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
              <p className="text-muted-foreground">
                Please sign in to track your FOIA requests
              </p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            FOIA Request Tracker
          </h2>
          <p className="text-muted-foreground text-lg">
            Manage the entire lifecycle of your Freedom of Information Act requests
          </p>
        </div>

        <div className="mb-6">
          <Button onClick={() => setShowNewRequest(!showNewRequest)} className="gap-2">
            <Plus className="h-4 w-4" />
            New FOIA Request
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading requests...</div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No FOIA requests yet</p>
              <p className="text-sm">Create your first request to start tracking</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active Requests</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {requests
                .filter(r => !['completed', 'denied'].includes(r.status))
                .map((request) => (
                  <RequestCard key={request.id} request={request} getDeadlineStatus={getDeadlineStatus} />
                ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {requests
                .filter(r => ['completed', 'denied'].includes(r.status))
                .map((request) => (
                  <RequestCard key={request.id} request={request} getDeadlineStatus={getDeadlineStatus} />
                ))}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {requests.map((request) => (
                <RequestCard key={request.id} request={request} getDeadlineStatus={getDeadlineStatus} />
              ))}
            </TabsContent>
          </Tabs>
        )}

        <Card className="mt-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Deadline Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Federal Agencies:</strong> Must respond within 20 business days (~28 calendar days)
            </p>
            <p>
              <strong>State Agencies:</strong> Response time varies by state (typically 10-14 business days)
            </p>
            <p className="text-muted-foreground">
              You'll see alerts here when deadlines are approaching or agencies are overdue.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function RequestCard({ request, getDeadlineStatus }: {
  request: FOIARequest;
  getDeadlineStatus: (deadline: string | null) => any
}) {
  const statusConfig = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusConfig?.icon || FileText;
  const deadlineStatus = getDeadlineStatus(request.response_deadline);

  return (
    <Card className={deadlineStatus?.urgent ? "border-red-500" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{request.request_subject}</CardTitle>
            <CardDescription>{request.agency_name}</CardDescription>
          </div>
          <Badge className={`${statusConfig?.color} text-white`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig?.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {request.submitted_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Submitted: {format(new Date(request.submitted_date), 'MMM d, yyyy')}</span>
          </div>
        )}

        {deadlineStatus && (
          <div className={`flex items-center gap-2 text-sm ${deadlineStatus.color}`}>
            <Clock className="h-4 w-4" />
            <span className="font-medium">
              {request.response_deadline
                ? `Deadline: ${format(new Date(request.response_deadline), 'MMM d, yyyy')} - ${deadlineStatus.text}`
                : 'No deadline set'}
            </span>
          </div>
        )}

        {deadlineStatus?.urgent && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Bell className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-xs text-red-900 dark:text-red-200">
                <strong>Action Required:</strong> {deadlineStatus.text.includes('overdue')
                  ? 'This agency is past their response deadline. Consider filing a follow-up or appeal.'
                  : 'Deadline is approaching soon. Monitor for response.'}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm">View Details</Button>
          <Button variant="outline" size="sm">Update Status</Button>
          <Button variant="outline" size="sm">Add Note</Button>
        </div>
      </CardContent>
    </Card>
  );
}
