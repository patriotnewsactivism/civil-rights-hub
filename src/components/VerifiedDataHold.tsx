import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface VerifiedDataHoldProps {
  compact?: boolean;
  title?: string;
  description?: string;
  detail?: string;
}

export function VerifiedDataHold({
  compact = false,
  title = "Verified data rebuild in progress",
  description = "Civil Rights Hub is temporarily withholding public datasets that cannot yet prove every published factual claim with reviewed source evidence. We would rather show less data than publish an unsupported claim.",
  detail = "Emergency encounter tools, FOIA workflow tools, new incident submissions, and direct links to external source providers remain available while the verification rebuild continues.",
}: VerifiedDataHoldProps) {
  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className={compact ? "p-4" : "p-6 md:p-8"}>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-500/10 p-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="font-bold">{title}</h2>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground">{detail}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
