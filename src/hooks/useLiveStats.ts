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

async function fetchLiveStats(): Promise<{ stats: LiveStats; recent: RecentViolation[] }> {
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const [v, vAll, a, sc, foia, recent] = await Promise.all([
    supabase.from("violations").select("id", { count: "exact", head: true }).gte("created_at", since24h),
    supabase.from("violations").select("id", { count: "exact", head: true }),
    supabase.from("attorneys").select("id", { count: "exact", head: true }),
    supabase.from("scanner_links").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("foia_requests").select("id", { count: "exact", head: true }),
    supabase
      .from("violations")
      .select("id, title, location_city, location_state, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  return {
    stats: {
      violations24h: v.count ?? 0,
      violationsTotal: vAll.count ?? 0,
      activeFoias: foia.count ?? 0,
      totalAttorneys: a.count ?? 0,
      activeScanners: sc.count ?? 0,
    },
    recent: (recent.data as RecentViolation[]) ?? [],
  };
}

interface LiveStatsResult {
  stats: LiveStats;
  recent: RecentViolation[];
}

export const useLiveStats = (): UseQueryResult<LiveStatsResult> & { stats: LiveStats; recent: RecentViolation[] } => {
  const query = useQuery<LiveStatsResult>({
    queryKey: ["live-stats"],
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
