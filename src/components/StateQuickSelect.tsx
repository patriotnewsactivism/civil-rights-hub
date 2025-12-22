import { Compass } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION, US_STATES } from "@/data/usStates";

export const StateQuickSelect = () => {
  const { state, setState } = useJurisdiction();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2">
      <Compass className="h-4 w-4 text-primary" aria-hidden />
      <Select value={state} onValueChange={setState}>
        <SelectTrigger className="h-9 w-[160px] border-none bg-transparent px-0 text-sm font-medium focus:ring-0">
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
    </div>
  );
};
