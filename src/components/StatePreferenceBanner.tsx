import { ShieldQuestion, Sparkles, LocateFixed, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION, US_STATES } from "@/data/usStates";
import { cn } from "@/lib/utils";

export const StatePreferenceBanner = () => {
  const { state, city, setState, detectLocation, detecting, locationSource } = useJurisdiction();

  const sourceLabel =
    locationSource === "gps" ? "📍 GPS detected" :
    locationSource === "ip" ? "🌐 Estimated from IP" :
    locationSource === "manual" ? "✏️ Set manually" : null;

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 md:py-6">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary flex-shrink-0">
            <ShieldQuestion className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-semibold">Your location</h3>
              <Badge variant="outline" className="border-primary/50 text-primary">
                {city ? `${city}, ${state === DEFAULT_JURISDICTION ? "US" : state}` : (state === DEFAULT_JURISDICTION ? "Nationwide" : state)}
              </Badge>
              {sourceLabel && (
                <span className="text-[11px] text-muted-foreground">{sourceLabel}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Your selected state helps organize jurisdiction-specific reference material, public-records tools, and scanner resources.
              Attorney and incident datasets remain withheld while legacy records are re-verified.
              {locationSource === "default" && (
                <span className="text-yellow-600 dark:text-yellow-400 font-medium"> Choose a state or detect your location for local navigation.</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-80">
          <Select value={state} onValueChange={setState}>
            <SelectTrigger aria-label="Select your state">
              <SelectValue placeholder="Choose a state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_JURISDICTION}>Nationwide / Federal reference</SelectItem>
              {US_STATES.map((stateName) => (
                <SelectItem key={stateName} value={stateName}>
                  {stateName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={locationSource === "default" ? "default" : "outline"}
            size="sm"
            onClick={() => void detectLocation()}
            disabled={detecting}
            className={cn(
              "w-full gap-2 transition-all",
              locationSource === "default" && "ring-2 ring-primary/40 ring-offset-2 ring-offset-background animate-pulse-slow",
            )}
          >
            {detecting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Detecting your location…</>
            ) : locationSource !== "default" ? (
              <><CheckCircle2 className="h-4 w-4 text-green-500" /> Update my location</>
            ) : (
              <><LocateFixed className="h-4 w-4 animate-bounce-slow" /> Tap to detect your location</>
            )}
          </Button>

          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Saved locally on this device and used to organize location-aware resources.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
