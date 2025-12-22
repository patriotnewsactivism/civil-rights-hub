import { ShieldQuestion, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION, US_STATES } from "@/data/usStates";

export const StatePreferenceBanner = () => {
  const { state, setState } = useJurisdiction();

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 md:py-6">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <ShieldQuestion className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">State focus</h3>
              <Badge variant="outline" className="border-primary/50 text-primary">
                {state === DEFAULT_JURISDICTION ? "Nationwide" : state}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              We tailor guides, FOIA templates, and attorney recommendations to your selected state. Choose
              “Nationwide” for federal defaults.
            </p>
          </div>
        </div>
        <div className="w-full md:w-72">
          <Select value={state} onValueChange={setState}>
            <SelectTrigger aria-label="Select your state">
              <SelectValue placeholder="Choose a state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_JURISDICTION}>Nationwide / Federal guidance</SelectItem>
              {US_STATES.map((stateName) => (
                <SelectItem key={stateName} value={stateName}>
                  {stateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Saved locally on this device for privacy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
