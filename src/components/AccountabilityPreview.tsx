import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Building2, Database, MapPin, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLiveStats } from "@/hooks/useLiveStats";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ViolationPreview {
  id: string;
  title: string;
  location_city: string | null;
  location_state: string;
  incident_date: string;
  agency_name: string | null;
}

export function AccountabilityPreview() {
  const [items, setItems] = useState<ViolationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const { stats } = useLiveStats();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("violations")
        .select("id, title, location_city, location_state, incident_date, agency_name")
        .order("incident_date", { ascending: false })
        .limit(6);

      setItems((data ?? []) as ViolationPreview[]);
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <section className="border-y border-border/50 bg-muted/20 py-14 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              <Database className="h-3.5 w-3.5" />
              Accountability Intelligence
            </div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">Document patterns. Search the record.</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
              Review recent incident reports, then move into the full officer, agency, Brady-list, and public-records research tools when you need deeper context.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="font-bold">
              <Link to="/help#tools">
                Open accountability tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild className="font-bold">
              <Link to="/do-this-now#report">
                Report an incident
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-background/70 p-4">
            <p className="text-2xl font-black">{stats.violationsTotal.toLocaleString()}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documented reports</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/70 p-4">
            <div className="flex items-center gap-2 text-foreground">
              <Building2 className="h-5 w-5 text-primary" />
              <p className="text-lg font-black">Officer & agency search</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Cross-reference reported names, departments, and locations.</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/70 p-4">
            <div className="flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="text-lg font-black">Brady / Giglio guidance</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Understand credibility disclosures and how to research them.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 md:grid-cols-2">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : items.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-border/60 bg-background p-4 transition-colors hover:border-primary/35">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-bold leading-5">{item.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.location_city ? `${item.location_city}, ` : ""}{item.location_state}
                      </span>
                      {item.agency_name ? <span className="truncate">{item.agency_name}</span> : null}
                      <span>{new Date(item.incident_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No recent reports are available in the preview. The reporting and research tools remain available.
          </div>
        )}

        <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
          Accountability entries may include user-submitted reports or allegations. A listing does not by itself establish wrongdoing or an adjudicated finding; review underlying sources and official records where available.
        </p>
      </div>
    </section>
  );
}
