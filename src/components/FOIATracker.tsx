import { useState } from "react";
import { FOIARequestDashboard } from "@/components/foia/FOIARequestDashboard";
import { FOIARequestDetail } from "@/components/foia/FOIARequestDetail";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Bell } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type FOIARequest = Database["public"]["Tables"]["foia_requests"]["Row"];

export function FOIATracker() {
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<FOIARequest | null>(null);

  const handleRequestSelect = (request: FOIARequest) => {
    setSelectedRequest(request);
  };

  const handleBackToDashboard = () => {
    setSelectedRequest(null);
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
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold uppercase tracking-wide mb-4">
            <Bell className="h-4 w-4" />
            Deadline Tracking
          </div>
          <h2 className="mb-2 flex items-center justify-center gap-3 text-3xl font-bold md:text-4xl">
            <FileText className="h-10 w-10 text-primary" />
            FOIA Request Tracker
          </h2>
          <p className="text-lg text-muted-foreground">
            Monitor deadlines, track agency responses, and know exactly when it's time to sue
          </p>
        </div>

        {selectedRequest ? (
          <FOIARequestDetail requestId={selectedRequest.id} onBack={handleBackToDashboard} />
        ) : (
          <FOIARequestDashboard onRequestSelect={handleRequestSelect} />
        )}
      </div>
    </section>
  );
}
