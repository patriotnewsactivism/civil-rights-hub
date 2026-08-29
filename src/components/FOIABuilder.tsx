import { useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { FOIARequestForm } from "@/components/foia/FOIARequestForm";
import { FOIARequestDashboard } from "@/components/foia/FOIARequestDashboard";
import { FOIARequestDetail } from "@/components/foia/FOIARequestDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database } from "@/integrations/supabase/types";

type FOIARequest = Database["public"]["Tables"]["foia_requests"]["Row"];

export function FOIABuilder() {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedRequest, setSelectedRequest] = useState<FOIARequest | null>(null);

  return (
    <section id="foia-builder" className="py-20 bg-background">
      <div className="container mx-auto px-4 space-y-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold uppercase tracking-wide mb-4">
            <ShieldCheck className="h-4 w-4" /> User-owned records workspace
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center gap-2">
            <FileText className="h-8 w-8" /> Public Records Request Builder & Tracker
          </h2>
          <p className="text-muted-foreground">
            Draft a neutral request, download it, and track the status you record yourself. Agency contacts, statutory deadlines, and appeal rules are not auto-filled until those reference datasets are rebuilt from reviewed official sources.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Request</TabsTrigger>
            <TabsTrigger value="dashboard">My Requests</TabsTrigger>
            {selectedRequest && <TabsTrigger value="detail">Request Details</TabsTrigger>}
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <FOIARequestForm onRequestCreated={() => setActiveTab("dashboard")} />
          </TabsContent>
          <TabsContent value="dashboard" className="space-y-4">
            <FOIARequestDashboard onRequestSelect={(request) => { setSelectedRequest(request); setActiveTab("detail"); }} />
          </TabsContent>
          {selectedRequest && (
            <TabsContent value="detail" className="space-y-4">
              <FOIARequestDetail requestId={selectedRequest.id} onBack={() => { setSelectedRequest(null); setActiveTab("dashboard"); }} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  );
}
