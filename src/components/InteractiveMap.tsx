import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const statePositions: Record<string, { x: number; y: number }> = {
  "Alabama": { x: 72, y: 71 }, "Alaska": { x: 10, y: 85 }, "Arizona": { x: 25, y: 68 },
  "Arkansas": { x: 65, y: 68 }, "California": { x: 12, y: 58 }, "Colorado": { x: 35, y: 55 },
  "Connecticut": { x: 88, y: 45 }, "Delaware": { x: 85, y: 52 }, "Florida": { x: 80, y: 80 },
  "Georgia": { x: 77, y: 72 }, "Hawaii": { x: 25, y: 88 }, "Idaho": { x: 28, y: 38 },
  "Illinois": { x: 68, y: 52 }, "Indiana": { x: 72, y: 52 }, "Iowa": { x: 62, y: 48 },
  "Kansas": { x: 55, y: 58 }, "Kentucky": { x: 74, y: 58 }, "Louisiana": { x: 68, y: 75 },
  "Maine": { x: 92, y: 32 }, "Maryland": { x: 83, y: 53 }, "Massachusetts": { x: 90, y: 43 },
  "Michigan": { x: 73, y: 42 }, "Minnesota": { x: 60, y: 38 }, "Mississippi": { x: 68, y: 72 },
  "Missouri": { x: 63, y: 58 }, "Montana": { x: 35, y: 32 }, "Nebraska": { x: 53, y: 50 },
  "Nevada": { x: 20, y: 52 }, "New Hampshire": { x: 90, y: 40 }, "New Jersey": { x: 86, y: 48 },
  "New Mexico": { x: 38, y: 68 }, "New York": { x: 84, y: 42 }, "North Carolina": { x: 80, y: 65 },
  "North Dakota": { x: 52, y: 32 }, "Ohio": { x: 76, y: 50 }, "Oklahoma": { x: 55, y: 65 },
  "Oregon": { x: 17, y: 38 }, "Pennsylvania": { x: 82, y: 48 }, "Rhode Island": { x: 91, y: 44 },
  "South Carolina": { x: 79, y: 70 }, "South Dakota": { x: 52, y: 42 }, "Tennessee": { x: 72, y: 65 },
  "Texas": { x: 52, y: 75 }, "Utah": { x: 28, y: 52 }, "Vermont": { x: 88, y: 38 },
  "Virginia": { x: 81, y: 58 }, "Washington": { x: 20, y: 30 }, "West Virginia": { x: 78, y: 55 },
  "Wisconsin": { x: 66, y: 40 }, "Wyoming": { x: 38, y: 45 }
};

interface InteractiveMapProps {
  onStateSelect: (state: string) => void;
}

export const InteractiveMap = ({ onStateSelect }: InteractiveMapProps) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  return (
    <Card className="shadow-strong border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Interactive State Map
        </CardTitle>
        <CardDescription>
          Click on a state to view its recording laws
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[16/10] bg-muted rounded-lg overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {Object.entries(statePositions).map(([state, pos]) => (
              <g key={state}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="2.5"
                  className="cursor-pointer transition-all duration-200"
                  fill={hoveredState === state ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.6)"}
                  stroke="hsl(var(--background))"
                  strokeWidth="0.5"
                  onMouseEnter={() => setHoveredState(state)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => onStateSelect(state)}
                />
                {hoveredState === state && (
                  <text
                    x={pos.x}
                    y={pos.y - 4}
                    textAnchor="middle"
                    className="text-[3px] font-semibold fill-foreground pointer-events-none"
                  >
                    {state}
                  </text>
                )}
              </g>
            ))}
          </svg>
          
          {hoveredState && (
            <div className="absolute bottom-4 left-4 right-4">
              <Badge variant="default" className="text-sm">
                Click to view {hoveredState} laws
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
