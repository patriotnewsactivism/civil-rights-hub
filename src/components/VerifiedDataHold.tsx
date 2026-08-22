import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function VerifiedDataHold({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className={compact ? "p-4" : "p-6 md:p-8"}>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-500/10 p-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="font-bold">Verified data rebuild in progress</h2>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Civil Rights Hub is temporarily withholding public attorney listings, incident records, and accountability data while legacy records are re-verified against durable source evidence. We would rather show less data than publish an unsupported claim.
            </p>
            <p className="text-xs text-muted-foreground">
              Rights guides, emergency tools, FOIA tools, scanner resources, and new incident submissions remain available.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
