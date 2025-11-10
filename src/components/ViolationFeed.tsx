import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Violation {
  id: string;
  title: string;
  description: string;
  location_state: string;
  location_city: string | null;
  incident_date: string;
  created_at: string;
  status: string;
}

export const ViolationFeed = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState<string>("all");
  const location = useGeolocation();

  const fetchViolations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("violations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (filterState !== "all") {
        query = query.eq("location_state", filterState);
      }

      const { data, error } = await query;

      if (error) throw error;
      setViolations(data || []);
    } catch (error) {
      console.error("Error fetching violations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
    
    const channel = supabase
      .channel("violations-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "violations",
        },
        () => {
          fetchViolations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterState]);

  useEffect(() => {
    if (location.state && filterState === "all") {
      setFilterState(location.state);
    }
  }, [location.state]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section id="violation-feed" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <h2 className="text-3xl font-bold">Community Reports</h2>
              </div>
              <p className="text-muted-foreground">
                Recent violation reports from the community
              </p>
            </div>
            <Button variant="outline" onClick={fetchViolations} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="mb-6">
            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {Array.from(new Set(violations.map(v => v.location_state))).sort().map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  Loading reports...
                </CardContent>
              </Card>
            ) : violations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No reports found. Be the first to report a violation.
                </CardContent>
              </Card>
            ) : (
              violations.map((violation) => (
                <Card key={violation.id} className="border-border hover:shadow-strong transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-lg">{violation.title}</CardTitle>
                      <Badge variant={violation.status === "verified" ? "default" : "secondary"}>
                        {violation.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex flex-wrap gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {violation.location_city ? `${violation.location_city}, ` : ""}
                        {violation.location_state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(violation.incident_date)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{violation.description}</p>
                    <p className="text-xs text-muted-foreground mt-4">
                      Reported {formatDate(violation.created_at)}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
