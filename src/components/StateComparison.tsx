import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, GitCompare } from "lucide-react";

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

const CATEGORIES = [
  { key: "record_police", label: "Record Police", icon: "📹" },
  { key: "stop_and_identify", label: "Stop & Identify", icon: "🪪" },
  { key: "body_camera_required", label: "Body Cameras Required", icon: "🎥" },
  { key: "civilian_review_board", label: "Civilian Review Board", icon: "👀" },
  { key: "hate_crime_law", label: "Hate Crime Law", icon: "⚖️" },
  { key: "stand_your_ground", label: "Stand Your Ground", icon: "🛡️" },
  { key: "open_carry", label: "Open Carry", icon: "🔫" },
  { key: "expungement_available", label: "Expungement Available", icon: "📋" },
] as const;

type RightStatus = "yes" | "no" | "partial" | "unclear";

type ComparisonRow = {
  state: string;
  right_category: string;
  right_status: RightStatus;
  summary: string;
  statute_citation: string | null;
  exceptions: string | null;
};

function StatusBadge({ status }: { status: RightStatus }) {
  const config: Record<RightStatus, { icon: typeof CheckCircle2; className: string; label: string }> = {
    yes: { icon: CheckCircle2, className: "text-emerald-600 dark:text-emerald-400", label: "Yes" },
    no: { icon: XCircle, className: "text-destructive", label: "No" },
    partial: { icon: AlertCircle, className: "text-amber-500", label: "Partial" },
    unclear: { icon: HelpCircle, className: "text-muted-foreground", label: "Unclear" },
  };
  const { icon: Icon, className, label } = config[status];
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function StateComparison() {
  const [stateA, setStateA] = useState("");
  const [stateB, setStateB] = useState("");
  const [dataA, setDataA] = useState<Record<string, ComparisonRow>>({});
  const [dataB, setDataB] = useState<Record<string, ComparisonRow>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stateA && !stateB) return;
    setLoading(true);
    setError(null);
    const states = [stateA, stateB].filter(Boolean);
    Promise.all(
      states.map(async (s) => {
        const { data, error: queryError } = await supabase
          .from("state_rights_comparison")
          .select("*")
          .eq("state", s);
        if (queryError) throw queryError;
        const map: Record<string, ComparisonRow> = {};
        (data as ComparisonRow[])?.forEach((row) => {
          map[row.right_category] = row;
        });
        return { state: s, map };
      })
    )
      .then((results) => {
        results.forEach(({ state, map }) => {
          if (state === stateA) setDataA(map);
          if (state === stateB) setDataB(map);
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load data."))
      .finally(() => setLoading(false));
  }, [stateA, stateB]);

  return (
    <>
      <SEO
        title="State Rights Comparison Tool — Civil Rights by State | Civil Rights Hub"
        description="Compare civil rights protections across US states. Can you record police? Do they need body cameras? Hate crime laws, stand your ground, open carry, expungement — all side by side."
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            State Rights Comparison
          </h1>
          <p className="text-muted-foreground text-lg">
            How do your rights change when you cross state lines? Compare side by side.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state-a">State A</Label>
                <Select value={stateA} onValueChange={setStateA}>
                  <SelectTrigger id="state-a">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state-b">State B</Label>
                <Select value={stateB} onValueChange={setStateB}>
                  <SelectTrigger id="state-b">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-muted-foreground">Loading comparison data...</div>
        )}

        {!loading && stateA && stateB && (
          <div className="space-y-4">
            {/* Header row */}
            <div className="grid grid-cols-3 gap-4 pb-2 border-b">
              <div className="font-medium text-sm text-muted-foreground">Right / Protection</div>
              <div className="font-semibold text-center">{stateA}</div>
              <div className="font-semibold text-center">{stateB}</div>
            </div>

            {CATEGORIES.map((cat) => {
              const rowA = dataA[cat.key];
              const rowB = dataB[cat.key];
              return (
                <Card key={cat.key} className="overflow-hidden">
                  <CardContent className="pt-4 pb-4">
                    <div className="grid grid-cols-3 gap-4 items-start">
                      <div>
                        <p className="font-medium text-sm mb-1">{cat.icon} {cat.label}</p>
                        {rowA && (
                          <p className="text-xs text-muted-foreground line-clamp-3 hidden md:block">{rowA.summary}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        {rowA ? (
                          <>
                            <StatusBadge status={rowA.right_status} />
                            {rowA.statute_citation && (
                              <p className="text-xs text-muted-foreground text-center mt-1">{rowA.statute_citation}</p>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">No data</span>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        {rowB ? (
                          <>
                            <StatusBadge status={rowB.right_status} />
                            {rowB.statute_citation && (
                              <p className="text-xs text-muted-foreground text-center mt-1">{rowB.statute_citation}</p>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">No data</span>
                        )}
                      </div>
                    </div>

                    {/* Detailed comparison on expand */}
                    {rowA && rowB && (rowA.summary !== rowB.summary) && (
                      <div className="mt-4 pt-3 border-t grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">{stateA}</p>
                          <p className="text-sm">{rowA.summary}</p>
                          {rowA.exceptions && (
                            <p className="text-xs text-muted-foreground mt-1">⚠️ {rowA.exceptions}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">{stateB}</p>
                          <p className="text-sm">{rowB.summary}</p>
                          {rowB.exceptions && (
                            <p className="text-xs text-muted-foreground mt-1">⚠️ {rowB.exceptions}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* CTA */}
            <Card className="bg-primary/5 border-primary/30 mt-6">
              <CardContent className="pt-6 text-center">
                <p className="font-medium mb-3 flex items-center justify-center gap-2">
                  <GitCompare className="h-4 w-4" />
                  Need help navigating your rights in {stateA} or {stateB}?
                </p>
                <a href="/find-attorney" className="text-primary hover:underline font-medium">
                  Find a civil rights attorney →
                </a>
              </CardContent>
            </Card>
          </div>
        )}

        {!stateA && !stateB && (
          <div className="text-center py-12 text-muted-foreground">
            <GitCompare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select two states above to compare rights side by side.</p>
            <p className="text-xs mt-2">8 categories: record police, stop & identify, body cameras, civilian review boards, hate crime laws, stand your ground, open carry, expungement.</p>
          </div>
        )}
      </div>
    </>
  );
}
