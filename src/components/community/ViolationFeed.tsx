import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, MapPin, Clock, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Violation {
  id: string;
  title: string;
  description: string;
  location_state: string;
  location_city: string | null;
  incident_date: string;
  created_at: string;
}

export function ViolationFeed() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViolations();
    const channel = supabase
      .channel("public:violations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "violations" },
        (payload) => {
          const newViolation = payload.new as Violation;
          setViolations((prev) => [newViolation, ...prev].slice(0, 20));
          setCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchViolations = async () => {
    try {
      const { data, error, count: totalCount } = await supabase
        .from("violations")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setViolations(data || []);
      setCount(totalCount || 0);
    } catch (err) {
      console.error("Error fetching violations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-4 w-4" />
            Live Violation Feed
          </CardTitle>
          <Badge variant="destructive" className="text-[10px] h-5 px-1.5 animate-pulse">
            {count} REPORTS
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 pt-0 space-y-4">
            {loading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-md" />
                ))}
              </div>
            ) : violations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-xs italic">
                No recent violations reported.
              </div>
            ) : (
              violations.map((violation) => (
                <div key={violation.id} className="group relative border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-xs font-semibold line-clamp-1 group-hover:text-destructive transition-colors">
                      {violation.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">
                    {violation.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {violation.location_city && `${violation.location_city}, `}{violation.location_state}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground/70">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(violation.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
