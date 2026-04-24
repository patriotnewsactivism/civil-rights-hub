import { Compass, LocateFixed, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION, US_STATES } from "@/data/usStates";

export const StateQuickSelect = () => {
  const { state, city, setState, detectLocation, detecting, locationSource } = useJurisdiction();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 px-2 py-1.5">
      <Compass className="h-4 w-4 text-primary flex-shrink-0" aria-hidden />
      <Select value={state} onValueChange={setState}>
        <SelectTrigger className="h-8 w-[150px] border-none bg-transparent px-1 text-sm font-medium focus:ring-0">
          <SelectValue placeholder="State focus" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DEFAULT_JURISDICTION}>Nationwide / Federal</SelectItem>
          {US_STATES.map((stateName) => (
            <SelectItem key={stateName} value={stateName}>
              {stateName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* City indicator */}
      {city && (
        <span className="hidden lg:inline-block text-[10px] text-muted-foreground max-w-[80px] truncate">
          {city}
        </span>
      )}

      {/* Locate me button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0"
            onClick={() => void detectLocation()}
            disabled={detecting}
            aria-label="Detect my location"
          >
            {detecting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LocateFixed
                className={`h-3.5 w-3.5 ${locationSource === "gps" ? "text-green-500" : locationSource === "ip" ? "text-blue-400" : "text-muted-foreground"}`}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {detecting
            ? "Detecting location…"
            : locationSource === "gps"
            ? `GPS: ${city || state}`
            : locationSource === "ip"
            ? `Estimated: ${city || state}`
            : "Click to detect my location"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
