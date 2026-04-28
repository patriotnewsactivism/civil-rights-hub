import { useMemo } from "react";
import { MapPin, RefreshCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { US_STATES } from "@/data/usStates";
import { cn } from "@/lib/utils";

type JurisdictionSelectorProps = {
  detectedState: string | null;
  loading?: boolean;
  className?: string;
};

export const JurisdictionSelector = ({ detectedState, loading = false, className }: JurisdictionSelectorProps) => {
  const { state, setState } = useJurisdiction();

  const selectableStates = useMemo(() => US_STATES.map((entry) => ({
    value: entry,
    label: entry,
  })), []);

  return (
    <Card className={cn("border-primary/20 shadow-sm", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Set your state</CardTitle>
            <CardDescription>
              Tailor guides and tools to your jurisdiction. Choose manually or apply the detected location.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
        <div className="flex-1 space-y-2">
          <Label htmlFor="state-select" className="text-sm font-medium">
            Preferred state
          </Label>
          <Select value={state ?? ""} onValueChange={(value) => setState(value)}>
            <SelectTrigger id="state-select" aria-label="Select your state">
              <SelectValue placeholder={loading ? "Detecting location…" : "Choose a state"} />
            </SelectTrigger>
            <SelectContent>
              {selectableStates.map((entry) => (
                <SelectItem key={entry.value} value={entry.value}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Detected
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setState(detectedState)}
            disabled={!detectedState || loading}
          >
            <RefreshCcw className="h-4 w-4" />
            {loading ? "Detecting…" : detectedState ? `Use ${detectedState}` : "Location unavailable"}
          </Button>
          {state && (
            <p className="text-xs text-muted-foreground">
              Applied: {state}. You can switch states anytime to see jurisdiction-specific guidance.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
