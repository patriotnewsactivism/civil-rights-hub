import { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import { FOIARequestForm } from "@/components/foia/FOIARequestForm";
import { FOIARequestDashboard } from "@/components/foia/FOIARequestDashboard";
import { FOIARequestDetail } from "@/components/foia/FOIARequestDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database } from "@/integrations/supabase/types";

type FOIARequest = Database["public"]["Tables"]["foia_requests"]["Row"];

export function FOIABuilder() {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedRequest, setSelectedRequest] = useState<FOIARequest | null>(null);

  const handleRequestCreated = () => {
    setActiveTab("dashboard");
  };

  const handleRequestSelect = (request: FOIARequest) => {
    setSelectedRequest(request);
    setActiveTab("detail");
  };

  const handleBackToDashboard = () => {
    setSelectedRequest(null);
    setActiveTab("dashboard");
  };

  return (
    <section id="foia-builder" className="py-20 bg-background">
      <div className="container mx-auto px-4 space-y-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold uppercase tracking-wide mb-4">
            <Sparkles className="h-4 w-4" />
            Enhanced FOIA System
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-2">
            <FileText className="h-8 w-8" />
            FOIA Request Builder & Tracker
          </h2>
          <p className="text-muted-foreground">
            Create professional FOIA requests with templates, auto-populated agency contacts, deadline tracking,
            and lawsuit reminders all in one place
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Request</TabsTrigger>
            <TabsTrigger value="dashboard">My Requests</TabsTrigger>
            {selectedRequest && <TabsTrigger value="detail">Request Details</TabsTrigger>}
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <FOIARequestForm onRequestCreated={handleRequestCreated} />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <FOIARequestDashboard onRequestSelect={handleRequestSelect} />
          </TabsContent>

          {selectedRequest && (
            <TabsContent value="detail" className="space-y-4">
              <FOIARequestDetail requestId={selectedRequest.id} onBack={handleBackToDashboard} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  );
}
