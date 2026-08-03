import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, AlertTriangle, CheckCircle2, FileText, Calendar } from "lucide-react";

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

type SolData = {
  state: string;
  case_type: string;
  sol_years: number;
  sol_description: string;
  notice_required: boolean;
  notice_days: number | null;
  notes: string | null;
  source: string;
};

export function SolCalculator() {
  const [state, setState] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [solData, setSolData] = useState<SolData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!solData || !incidentDate) return null;
    const incident = new Date(incidentDate);
    const filingDeadline = new Date(incident);
    filingDeadline.setFullYear(filingDeadline.getFullYear() + Math.floor(solData.sol_years));
    filingDeadline.setDate(filingDeadline.getDate() + Math.round((solData.sol_years % 1) * 365));

    const noticeDeadline = solData.notice_required && solData.notice_days
      ? (() => {
          const d = new Date(incident);
          d.setDate(d.getDate() + solData.notice_days!);
          return d;
        })()
      : null;

    const now = new Date();
    const daysUntilFiling = Math.ceil((filingDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isExpired = daysUntilFiling < 0;
    const isUrgent = daysUntilFiling >= 0 && daysUntilFiling <= 60;

    return {
      filingDeadline,
      noticeDeadline,
      daysUntilFiling,
      isExpired,
      isUrgent,
    };
  }, [solData, incidentDate]);

  async function handleCalculate() {
    if (!state) return;
    setLoading(true);
    setError(null);
    setSolData(null);
    try {
      const { data, error: queryError } = await supabase
        .from("statute_of_limitations")
        .select("*")
        .eq("state", state)
        .eq("case_type", "section_1983")
        .maybeSingle();
      if (queryError) throw queryError;
      if (!data) {
        setError("No data found for this state. Please consult a civil rights attorney.");
        return;
      }
      setSolData(data as SolData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title="Statute of Limitations Calculator — Civil Rights Cases | Civil Rights Hub"
        description="Find out how long you have to file a civil rights lawsuit in your state. Free, instant, accurate. Don't let the deadline pass."
      />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Statute of Limitations Calculator
          </h1>
          <p className="text-muted-foreground text-lg">
            How long do you have to file a civil rights lawsuit? Find out instantly.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Enter your details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sol-state">State where the incident occurred</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="sol-state">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="incident-date">Date the incident occurred</Label>
              <input
                id="incident-date"
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <Button onClick={handleCalculate} disabled={!state || !incidentDate || loading} className="w-full" size="lg">
              {loading ? "Calculating..." : "Calculate My Deadline"}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-6">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && solData && (
          <div className="space-y-4">
            {/* Main result */}
            <Card className={result.isExpired ? "border-destructive/50" : result.isUrgent ? "border-amber-500/50" : "border-emerald-500/50"}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {result.isExpired ? (
                    <AlertTriangle className="h-10 w-10 text-destructive shrink-0" />
                  ) : result.isUrgent ? (
                    <Clock className="h-10 w-10 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {result.isExpired
                        ? "Filing deadline has PASSED"
                        : `${result.daysUntilFiling} days remaining to file`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Filing deadline: <strong>{result.filingDeadline.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      SOL: {solData.sol_years} years ({state})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notice of claim */}
            {result.noticeDeadline && (
              <Card className={result.noticeDeadline < new Date() ? "border-destructive/50" : "border-amber-500/30"}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <FileText className="h-8 w-8 text-amber-500 shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        Notice of Claim Required
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {state} requires you to file a notice of claim within <strong>{solData.notice_days} days</strong> of the incident.
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Notice deadline: <strong>{result.noticeDeadline.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong>
                        {result.noticeDeadline < new Date() && (
                          <span className="text-destructive font-medium"> — This deadline has PASSED</span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Details */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">How this is calculated</p>
                    <p className="text-sm text-muted-foreground">{solData.sol_description}</p>
                  </div>
                </div>
                {solData.notes && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Important notes</p>
                      <p className="text-sm text-muted-foreground">{solData.notes}</p>
                    </div>
                  </div>
                )}
                {solData.source && (
                  <p className="text-xs text-muted-foreground pt-2 border-t">
                    Source: {solData.source}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            {!result.isExpired && (
              <Card className="bg-primary/5 border-primary/30">
                <CardContent className="pt-6 text-center">
                  <p className="font-medium mb-3">
                    {result.isUrgent
                      ? "⚠️ Time is running out. Contact a civil rights attorney immediately."
                      : "You still have time, but don't wait. Speak with a civil rights attorney to protect your rights."}
                  </p>
                  <Button asChild size="lg">
                    <a href="/get-help?tab=attorneys">Find an Attorney</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {result.isExpired && (
              <Card className="bg-destructive/5 border-destructive/30">
                <CardContent className="pt-6 text-center">
                  <p className="font-medium mb-2">
                    The standard filing deadline has passed, but exceptions may apply.
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Some circumstances can toll (pause) the SOL — minority status, disability, or ongoing government misconduct. Speak with an attorney to explore your options.
                  </p>
                  <Button asChild variant="outline" size="lg">
                    <a href="/get-help?tab=attorneys">Find an Attorney</a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-8 max-w-lg mx-auto">
          This tool provides general information based on each state's statute of limitations for § 1983 civil rights claims. It is not legal advice. Consult a qualified attorney about your specific situation. Deadlines can vary based on case specifics and tolling rules.
        </p>
      </div>
    </>
  );
}
