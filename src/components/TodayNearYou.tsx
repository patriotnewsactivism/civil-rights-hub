import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { DEFAULT_JURISDICTION } from "@/data/usStates";
import {
  AlertTriangle,
  Clock,
  Radio,
  Scale,
  MapPin,
  ArrowRight,
  Activity,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ViolationRow {
  id: string;
  title: string;
  location_city: string | null;
  location_state: string;
  incident_date: string;
  created_at: string;
}

interface FoiaRow {
  id: string;
  subject: string;
  agency_name: string;
  status: string | null;
  response_due_date: string | null;
  submitted_at: string | null;
}

interface ScannerRow {
  id: string;
  scanner_name: string;
  city: string | null;
  state: string;
  listener_count: number | null;
}

interface AttorneyRow {
  id: string;
  name: string;
  firm: string | null;
  city: string | null;
  state: string;
  accepts_pro_bono: boolean | null;
}

interface CountsState {
  reports24h: number;
  activeFoias: number;
  activeScanners: number;
}

const REFRESH_MS = 60_000;

export function TodayNearYou() {
  const { state: jurisdictionState } = useJurisdiction();
  const stateFilter = useMemo(
    () => (jurisdictionState && jurisdictionState !== DEFAULT_JURISDICTION ? jurisdictionState : null),
    [jurisdictionState],
  );

  const [violations, setViolations] = useState<ViolationRow[]>([]);
  const [foias, setFoias] = useState<FoiaRow[]>([]);
  const [scanners, setScanners] = useState<ScannerRow[]>([]);
  const [attorneys, setAttorneys] = useState<AttorneyRow[]>([]);
  const [counts, setCounts] = useState<CountsState>({ reports24h: 0, activeFoias: 0, activeScanners: 0 });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const violationsQuery = supabase
      .from("violations")
      .select("id, title, location_city, location_state, incident_date, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (stateFilter) violationsQuery.eq("location_state", stateFilter);

    const scannersQuery = supabase
      .from("scanner_links")
      .select("id, scanner_name, city, state, listener_count")
      .eq("is_active", true)
      .order("listener_count", { ascending: false, nullsFirst: false })
      .limit(3);
    if (stateFilter) scannersQuery.eq("state", stateFilter);

    const attorneysQuery = supabase
      .from("attorneys")
      .select("id, name, firm, city, state, accepts_pro_bono")
      .order("created_at", { ascending: false })
      .limit(3);
    if (stateFilter) attorneysQuery.eq("state", stateFilter);

    const reports24hQuery = supabase
      .from("violations")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);
    if (stateFilter) reports24hQuery.eq("location_state", stateFilter);

    const activeScannersQuery = supabase
      .from("scanner_links")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true);
    if (stateFilter) activeScannersQuery.eq("state", stateFilter);

    const [
      violationsRes,
      scannersRes,
      attorneysRes,
      reports24hRes,
      activeScannersRes,
    ] = await Promise.all([
      violationsQuery,
      scannersQuery,
      attorneysQuery,
      reports24hQuery,
      activeScannersQuery,
    ]);

    if (violationsRes.data) setViolations(violationsRes.data as ViolationRow[]);
    if (scannersRes.data) setScanners(scannersRes.data as ScannerRow[]);
    if (attorneysRes.data) setAttorneys(attorneysRes.data as AttorneyRow[]);

    setCounts({
      reports24h: reports24hRes.count ?? 0,
      activeFoias: 0,
      activeScanners: activeScannersRes.count ?? 0,
    });
  }, [stateFilter]);

  const fetchFoia = useCallback(async (uid: string) => {
    const { data, count } = await supabase
      .from("foia_requests")
      .select("id, subject, agency_name, status, response_due_date, submitted_at", { count: "exact" })
      .eq("user_id", uid)
      .not("status", "in", "(completed,denied)")
      .order("response_due_date", { ascending: true, nullsFirst: false })
      .limit(3);

    if (data) setFoias(data as FoiaRow[]);
    setCounts((prev) => ({ ...prev, activeFoias: count ?? 0 }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (cancelled) return;
      const uid = data.user?.id ?? null;
      setUserId(uid);

      await fetchAll();
      if (uid) await fetchFoia(uid);
      if (!cancelled) setLoading(false);

      intervalId = setInterval(() => {
        fetchAll();
        if (uid) fetchFoia(uid);
      }, REFRESH_MS);
    };

    init();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchAll, fetchFoia]);

  const locationLabel = stateFilter ?? "the United States";

  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
      {/* Live ticker */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 text-xs">
          <span className="inline-flex items-center gap-2 font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            LIVE
          </span>
          <span className="text-muted-foreground">
            <span className="font-bold text-foreground">{counts.reports24h}</span> reports in last 24h
          </span>
          <span className="text-muted-foreground">
            <span className="font-bold text-foreground">{counts.activeScanners}</span> active scanners
          </span>
          {userId && (
            <span className="text-muted-foreground">
              <span className="font-bold text-foreground">{counts.activeFoias}</span> open FOIAs
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {locationLabel}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <Activity className="h-3 w-3" />
              Today near you
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              What's happening in <span className="text-primary">{locationLabel}</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Live civil-rights activity, deadlines, and resources in your area.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Violations */}
          <TileCard
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Recent reports"
            href="/community"
            accent="text-orange-500"
            loading={loading}
            empty={violations.length === 0}
            emptyAction={{ label: "Report a violation", href: "/community" }}
          >
            {violations.slice(0, 3).map((v) => (
              <div key={v.id} className="border-b border-border/40 py-2 last:border-0">
                <p className="line-clamp-1 text-sm font-medium">{v.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {[v.location_city, v.location_state].filter(Boolean).join(", ")}
                  {" · "}
                  {formatDistanceToNow(new Date(v.created_at), { addSuffix: true })}
                </p>
              </div>
            ))}
          </TileCard>

          {/* FOIA */}
          <TileCard
            icon={<Clock className="h-4 w-4" />}
            title="Your FOIA deadlines"
            href="/tools"
            accent="text-blue-500"
            loading={loading}
            empty={foias.length === 0}
            emptyAction={
              userId
                ? { label: "File a FOIA request", href: "/tools" }
                : { label: "Sign in to track FOIAs", href: "/auth" }
            }
          >
            {foias.map((f) => {
              const due = f.response_due_date ? new Date(f.response_due_date) : null;
              const overdue = due && due < new Date();
              return (
                <div key={f.id} className="border-b border-border/40 py-2 last:border-0">
                  <p className="line-clamp-1 text-sm font-medium">{f.subject}</p>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="line-clamp-1">{f.agency_name}</span>
                    {due && (
                      <Badge
                        variant={overdue ? "destructive" : "secondary"}
                        className="h-4 px-1.5 text-[9px]"
                      >
                        {overdue ? "Overdue" : `Due ${formatDistanceToNow(due, { addSuffix: true })}`}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </TileCard>

          {/* Scanners */}
          <TileCard
            icon={<Radio className="h-4 w-4" />}
            title="Active scanners"
            href="/tools"
            accent="text-teal-500"
            loading={loading}
            empty={scanners.length === 0}
            emptyAction={{ label: "Browse all scanners", href: "/tools" }}
          >
            {scanners.map((s) => (
              <div key={s.id} className="border-b border-border/40 py-2 last:border-0">
                <p className="line-clamp-1 text-sm font-medium">{s.scanner_name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {[s.city, s.state].filter(Boolean).join(", ")}
                  {s.listener_count ? ` · ${s.listener_count} listening` : ""}
                </p>
              </div>
            ))}
          </TileCard>

          {/* Attorneys */}
          <TileCard
            icon={<Scale className="h-4 w-4" />}
            title="Attorneys nearby"
            href="/attorneys"
            accent="text-cyan-500"
            loading={loading}
            empty={attorneys.length === 0}
            emptyAction={{ label: "Find an attorney", href: "/attorneys" }}
          >
            {attorneys.map((a) => (
              <div key={a.id} className="border-b border-border/40 py-2 last:border-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="line-clamp-1 text-sm font-medium">{a.name}</p>
                  {a.accepts_pro_bono && (
                    <Badge variant="secondary" className="h-4 px-1.5 text-[9px]">
                      Pro bono
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                  {a.firm ?? "Independent"} · {[a.city, a.state].filter(Boolean).join(", ")}
                </p>
              </div>
            ))}
          </TileCard>
        </div>
      </div>
    </section>
  );
}

function TileCard({
  icon,
  title,
  href,
  accent,
  loading,
  empty,
  emptyAction,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  accent: string;
  loading: boolean;
  empty: boolean;
  emptyAction: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <Card className="group relative flex flex-col overflow-hidden border-border/60 bg-card/80 p-4 transition-all hover:border-primary/40 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={accent}>{icon}</span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
        </div>
        <Link
          to={href}
          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          aria-label={`See all ${title}`}
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex-1">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : empty ? (
          <div className="flex h-full flex-col items-start justify-center gap-2 py-2">
            <p className="text-xs text-muted-foreground">No activity yet.</p>
            <Button asChild size="sm" variant="outline" className="h-7 text-xs">
              <Link to={emptyAction.href}>{emptyAction.label}</Link>
            </Button>
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
