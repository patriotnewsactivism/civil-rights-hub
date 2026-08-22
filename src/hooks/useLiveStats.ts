import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LiveStats {
  violations24h: number;
  violationsTotal: number;
  activeFoias: number;
  totalAttorneys: number;
  activeScanners: number;
}

export interface RecentViolation {
  id: string;
  title: string;
  location_city: string | null;
  location_state: string;
  created_at: string;
}

const EMPTY_STATS: LiveStats = {
  violations24h: 0,
  violationsTotal: 0,
  activeFoias: 0,
  totalAttorneys: 0,
  activeScanners: 0,
};

// Publication hold: legacy attorney and incident verification flags cannot be
// trusted until the source-provenance migration has been applied and audited in
// production. Keep those public counts at zero regardless of the old DB flags.
async function fetchLiveStats(): Promise<{ stats: LiveStats; recent: RecentViolation[] }> {
  const [sc, foia] = await Promise.all([
    supabase.from("scanner_links").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("foia_requests").select("id", { count: "exact", head: true }),
  ]);

  return {
    stats: {
      violations24h: 0,
      violationsTotal: 0,
      activeFoias: foia.count ?? 0,
      totalAttorneys: 0,
      activeScanners: sc.count ?? 0,
    },
    recent: [],
  };
}

interface LiveStatsResult {
  stats: LiveStats;
  recent: RecentViolation[];
}

export const useLiveStats = (): UseQueryResult<LiveStatsResult> & { stats: LiveStats; recent: RecentViolation[] } => {
  const query = useQuery<LiveStatsResult>({
    queryKey: ["live-stats-publication-hold"],
    queryFn: fetchLiveStats,
    staleTime: 60_000,
    refetchInterval: 120_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
  return {
    ...query,
    stats: query.data?.stats ?? EMPTY_STATS,
    recent: query.data?.recent ?? [],
  };
};
