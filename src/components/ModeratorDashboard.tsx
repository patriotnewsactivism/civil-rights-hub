import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ShieldAlert,
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  MessageSquare,
  FileText,
  User,
  Clock,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContentReport {
  id: string;
  content_id: string;
  content_type: string;
  reason: string;
  reporter_id: string;
  status: string;
  created_at: string;
  reporter?: {
    display_name: string | null;
    email: string | null;
  } | null;
  content_preview?: string;
}

const contentTypeIcons: Record<string, React.ReactNode> = {
  post: <FileText className="h-4 w-4" />,
  comment: <MessageSquare className="h-4 w-4" />,
  user: <User className="h-4 w-4" />,
  violation: <ShieldAlert className="h-4 w-4" />,
};

export function ModeratorDashboard() {
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isModerator, setIsModerator] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      toast.error("Failed to load reports");
      setReports([]);
    } else {
      const reportUserIds = [
        ...new Set(
          (data ?? [])
            .map((r) => r.reporter_id)
            .filter((id): id is string => id !== null)
        ),
      ];

      let userProfiles: Record<string, { display_name: string | null; email: string | null }> = {};
      if (reportUserIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, display_name, email")
          .in("id", reportUserIds);

        profilesData?.forEach((p) => {
          userProfiles[p.id] = {
            display_name: p.display_name,
            email: p.email,
          };
        });
      }

      const reportsWithDetails = await Promise.all(
        (data ?? []).map(async (report) => {
          let contentPreview = "";
          if (report.content_type === "post") {
            const { data: postData } = await supabase
              .from("posts")
              .select("content")
              .eq("id", report.content_id)
              .single();
            contentPreview = postData?.content?.slice(0, 200) ?? "Content not found";
          } else if (report.content_type === "comment") {
            const { data: commentData } = await supabase
              .from("comments")
              .select("content")
              .eq("id", report.content_id)
              .single();
            contentPreview = commentData?.content?.slice(0, 200) ?? "Content not found";
          }

          return {
            ...report,
            reporter: report.reporter_id ? userProfiles[report.reporter_id] ?? null : null,
            content_preview: contentPreview,
          };
        })
      );

      setReports(reportsWithDetails as ContentReport[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id ?? null);

      if (data.user?.id) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();
        setIsModerator(roleData?.role === "admin" || roleData?.role === "moderator");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isModerator) {
      fetchReports();
    }
  }, [isModerator, fetchReports]);

  const handleAction = async (action: "dismiss" | "remove") => {
    if (!selectedReport) return;
    setProcessing(true);

    try {
      if (action === "dismiss") {
        const { error } = await supabase
          .from("content_reports")
          .update({ status: "dismissed" })
          .eq("id", selectedReport.id);

        if (error) throw error;
        toast.success("Report dismissed");
      } else if (action === "remove") {
        if (selectedReport.content_type === "post") {
          await supabase.from("posts").delete().eq("id", selectedReport.content_id);
        } else if (selectedReport.content_type === "comment") {
          await supabase.from("comments").delete().eq("id", selectedReport.content_id);
        }

        await supabase
          .from("content_reports")
          .update({ status: "actioned" })
          .eq("id", selectedReport.id);

        toast.success("Content removed and report resolved");
      }

      await fetchReports();
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Failed to process action");
    } finally {
      setProcessing(false);
      setActionDialogOpen(false);
      setSelectedReport(null);
      setActionNote("");
    }
  };

  if (!currentUserId) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Sign in to access the moderator dashboard.
        </CardContent>
      </Card>
    );
  }

  if (!isModerator) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <ShieldAlert className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>You don't have permission to access this page.</p>
          <p className="text-sm mt-2">Moderator or admin role required.</p>
        </CardContent>
      </Card>
    );
  }

  const pendingReports = reports.filter((r) => r.status === "pending");
  const actionedReports = reports.filter((r) => r.status !== "pending");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          Moderator Dashboard
          {pendingReports.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingReports.length} pending
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Pending ({pendingReports.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Resolved ({actionedReports.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              {pendingReports.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending reports. Great job!</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {pendingReports.map((report) => (
                      <div
                        key={report.id}
                        className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                              {contentTypeIcons[report.content_type] ?? <Flag className="h-4 w-4" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{report.content_type}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="font-medium mt-1">{report.reason}</p>
                              {report.content_preview && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  "{report.content_preview}"
                                </p>
                              )}
                              {report.reporter && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Reported by: {report.reporter.display_name ?? "Anonymous"}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReport(report);
                                setActionDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="resolved" className="mt-4">
              {actionedReports.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No resolved reports yet.
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {actionedReports.map((report) => (
                      <div
                        key={report.id}
                        className="rounded-lg border p-4 bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant={report.status === "actioned" ? "default" : "secondary"}>
                            {report.status}
                          </Badge>
                          <span className="text-sm">{report.reason}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Take action on this reported content.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm font-medium mb-2">Content Preview:</p>
                <p className="text-sm text-muted-foreground">
                  {selectedReport.content_preview ?? "Content not available"}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Reason:</p>
                <p className="text-sm">{selectedReport.reason}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Reporter:</p>
                <p className="text-sm text-muted-foreground">
                  {selectedReport.reporter?.display_name ?? "Anonymous"}
                </p>
              </div>

              <Textarea
                placeholder="Add a note (optional)..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
              />
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleAction("dismiss")}
              disabled={processing}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Dismiss
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction("remove")}
              disabled={processing}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
