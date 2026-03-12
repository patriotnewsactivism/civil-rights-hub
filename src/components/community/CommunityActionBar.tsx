import { useState } from "react";
import { Video, AlertCircle, FileText, Users, Radio, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GoLiveRecorder } from "./GoLiveRecorder";
import { QuickViolationReport } from "./QuickViolationReport";
import { Link } from "react-router-dom";

type ActivePanel = "none" | "live" | "report";

export function CommunityActionBar({ userId }: { userId: string | null }) {
  const [activePanel, setActivePanel] = useState<ActivePanel>("none");

  const togglePanel = (panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? "none" : panel);
  };

  return (
    <div className="space-y-3">
      {/* Action buttons row */}
      <Card className="border-border/50">
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activePanel === "live" ? "destructive" : "outline"}
              size="sm"
              onClick={() => togglePanel("live")}
              className="gap-1.5 font-semibold"
            >
              <Video className="h-4 w-4" />
              Go Live
            </Button>
            <Button
              variant={activePanel === "report" ? "destructive" : "outline"}
              size="sm"
              onClick={() => togglePanel("report")}
              className="gap-1.5"
            >
              <AlertCircle className="h-4 w-4" />
              Report Violation
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link to="/tools">
                <FileText className="h-4 w-4" />
                FOIA Request
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link to="/attorneys">
                <Scale className="h-4 w-4" />
                Find Attorney
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link to="/activists">
                <Users className="h-4 w-4" />
                Activists
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expanded panels */}
      {activePanel === "live" && <GoLiveRecorder />}
      {activePanel === "report" && <QuickViolationReport userId={userId} />}
    </div>
  );
}
