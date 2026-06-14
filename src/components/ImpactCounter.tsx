import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface CounterItem {
  label: string;
  value: number | null;
  suffix?: string;
  loading: boolean;
}

interface ImpactCounterProps {
  className?: string;
  layout?: "grid" | "strip";
}

export function ImpactCounter({ className, layout = "grid" }: ImpactCounterProps) {
  const [counts, setCounts] = useState({
    violations: null as number | null,
    attorneys: null as number | null,
    foiaRequests: null as number | null,
    statesCovered: 50,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [violations, attorneys, foiaRequests] = await Promise.all([
          supabase.from("violations").select("id", { count: "exact", head: true }),
          supabase.from("attorneys").select("id", { count: "exact", head: true }),
          supabase.from("foia_requests").select("id", { count: "exact", head: true }),
        ]);
        setCounts({
          violations: violations.count ?? 0,
          attorneys: attorneys.count ?? 0,
          foiaRequests: foiaRequests.count ?? 0,
          statesCovered: 50,
        });
      } catch {
        // silently keep nulls
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const items: CounterItem[] = [
    { label: "Violations reported", value: counts.violations, loading },
    { label: "Attorneys in directory", value: counts.attorneys, loading },
    { label: "FOIAs tracked", value: counts.foiaRequests, loading },
    { label: "States covered", value: counts.statesCovered, suffix: "", loading: false },
  ];

  if (layout === "strip") {
    return (
      <div className={cn("flex flex-wrap gap-8 justify-center", className)}>
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-2xl font-black text-foreground">
              {item.loading ? "—" : item.value?.toLocaleString() ?? "—"}
              {item.suffix}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-4 gap-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border bg-card p-4 text-center">
          <p className="text-3xl font-black text-primary">
            {item.loading ? (
              <span className="text-muted-foreground/30 animate-pulse">—</span>
            ) : (
              item.value?.toLocaleString() ?? "—"
            )}
            {!item.loading && item.suffix}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
