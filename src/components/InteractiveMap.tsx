import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { feature } from "topojson-client";
import usaTopology from "us-atlas/states-10m.json";
import type { FeatureCollection } from "geojson";
import type { Topology } from "topojson-specification";
import { MapPin, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const stateGeographies = (() => {
  const topology = usaTopology as Topology;
  return feature(topology, topology.objects.states) as FeatureCollection;
})();

interface InteractiveMapProps {
  onStateSelect: (state: string) => void;
}

interface MapViolation {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  location_city: string | null;
  location_state: string;
}

export const InteractiveMap = ({ onStateSelect }: InteractiveMapProps) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [violations, setViolations] = useState<MapViolation[]>([]);
  const [hoveredViolation, setHoveredViolation] = useState<string | null>(null);

  useEffect(() => {
    const fetchViolations = async () => {
      const { data, error } = await supabase
        .from("violations")
        .select("id, title, latitude, longitude, location_city, location_state")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data) {
        setViolations(data as MapViolation[]);
      }
    };

    fetchViolations();
  }, []);

  return (
    <Card className="shadow-strong border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Interactive Incident Map
        </CardTitle>
        <CardDescription>
          Click a state to view laws. Red dots indicate recent verified violations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[16/10] rounded-lg bg-slate-950/80 border border-white/10 overflow-hidden">
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 900 }}
            width={960}
            height={600}
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
                      fill={isHighlighted ? "#1e293b" : "#0f172a"}
                      stroke="#334155"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#1e293b", outline: "none", cursor: "pointer" },
                        pressed: { fill: "#334155", outline: "none" },
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

            {violations.map((violation) => (
              <Marker 
                key={violation.id} 
                coordinates={[violation.longitude, violation.latitude]}
                onMouseEnter={() => setHoveredViolation(violation.title)}
                onMouseLeave={() => setHoveredViolation(null)}
              >
                <circle r={4} fill="#ef4444" stroke="#ffffff" strokeWidth={1} className="cursor-pointer hover:r-6 transition-all" />
              </Marker>
            ))}
          </ComposableMap>

          {/* Overlays */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
            {hoveredState && (
              <Badge variant="secondary" className="text-sm shadow-lg pointer-events-auto animate-fade-in bg-slate-800 text-slate-200 border-slate-700">
                {hoveredState}
              </Badge>
            )}
            
            {hoveredViolation && (
              <div className="max-w-xs pointer-events-auto animate-fade-in">
                <Badge variant="destructive" className="text-sm shadow-lg flex gap-2 items-center px-3 py-1.5">
                  <AlertCircle className="h-3 w-3" />
                  <span className="truncate">{hoveredViolation}</span>
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
