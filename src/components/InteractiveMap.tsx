import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";
import usaTopology from "us-atlas/states-10m.json";
import type { FeatureCollection } from "geojson";
import type { Topology } from "topojson-specification";
import { MapPin } from "lucide-react";

const stateGeographies = (() => {
  const topology = usaTopology as Topology;
  return feature(topology, topology.objects.states) as FeatureCollection;
})();

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
        <div className="relative w-full aspect-[16/10] rounded-lg bg-slate-950/80 border border-white/10">
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 900 }}
            width={960}
            height={600}
            data-tip=""
            className="w-full h-full"
          >
            <Geographies geography={stateGeographies}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.NAME ?? geo.properties.name;
                  const isHighlighted = hoveredState === stateName;

                  return (
                    <Geography
                      key={`${geo.rsmKey}-${stateName}`}
                      geography={geo}
                      fill={isHighlighted ? "#38bdf8" : "#0f172a"}
                      stroke="#94a3b8"
                      strokeWidth={0.25}
                      style={{
                        default: {
                          outline: "none",
                        },
                        hover: {
                          fill: "#38bdf8",
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#22d3ee",
                          outline: "none",
                        },
                      }}
                      onMouseEnter={() => {
                        if (stateName) setHoveredState(stateName);
                      }}
                      onMouseLeave={() => {
                        setHoveredState(null);
                      }}
                      onClick={() => {
                        if (stateName) onStateSelect(stateName);
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
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
