import { AlertCircle, FileLock2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function QuickViolationReport({ userId }: { userId: string | null }) {
  return (
    <Button
      asChild
      variant="outline"
      className="gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
    >
      <Link to={userId ? "/incident-reports" : "/auth"}>
        {userId ? <FileLock2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
        {userId ? "Private Incident Report" : "Sign In to Report"}
      </Link>
    </Button>
  );
}
