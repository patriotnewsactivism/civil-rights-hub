import { AlertCircle, FileLock2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ViolationReport = () => {
  return (
    <section id="report-violation" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border shadow-strong">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-2xl">Document an Incident</CardTitle>
              </div>
              <CardDescription>
                Create a private civil-rights incident record, preserve supporting evidence, save a draft, and submit it to the authorized review queue when you are ready.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border border-primary/25 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <FileLock2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Private by design</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Incident intake is separate from the public community feed. Reports and evidence are visible only to the reporter and authorized review staff.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="text-sm leading-relaxed">
                    A submitted report is an allegation or factual account, not a platform finding that misconduct occurred. Preserve original source files separately and avoid unnecessary sensitive identifiers.
                  </p>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link to="/incident-reports">Open Private Incident Workspace</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
