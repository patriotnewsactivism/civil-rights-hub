import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Attorney = Database["public"]["Tables"]["attorneys"]["Row"];

const PAGE_SIZE = 25;

interface AttorneyListProps {
  searchQuery: string;
  selectedState: string;
  selectedSpecialty: string;
}

export default function AttorneyList({ searchQuery, selectedState, selectedSpecialty }: AttorneyListProps) {
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedState, selectedSpecialty]);

  const fetchAttorneys = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("attorneys")
        .select("*", { count: "exact" })
        .eq("is_verified", true);

      if (selectedState && selectedState !== "All States") {
        query = query.eq("state", selectedState);
      }

      if (selectedSpecialty && selectedSpecialty !== "All Specialties") {
        query = query.contains("specialties", [selectedSpecialty]);
      }

      if (searchQuery.trim()) {
        // Use ilike for more flexible search — matches name, firm, city
        const term = `%${searchQuery.trim()}%`;
        query = query.or(`name.ilike.${term},firm.ilike.${term},city.ilike.${term}`);
      }

      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: fetchError, count } = await query
        .order("name")
        .range(from, to);

      if (fetchError) throw fetchError;

      setAttorneys(data ?? []);
      setTotalCount(count ?? 0);
      setHasMore((count ?? 0) > to + 1);
    } catch (err) {
      console.error("Supabase Fetch Error:", err);
      setError("Connection to the source-verified Civil Rights Database failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSpecialty, selectedState]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchAttorneys(page);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [fetchAttorneys, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const showingFrom = page * PAGE_SIZE + 1;
  const showingTo = Math.min((page + 1) * PAGE_SIZE, totalCount);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground animate-pulse">
        Searching the source-verified national directory…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-lg text-destructive">
        <strong>System Alert:</strong> {error}
      </div>
    );
  }

  if (attorneys.length === 0) {
    return (
      <div className="p-8 text-center bg-muted/50 rounded-lg border border-border">
        <h3 className="text-lg font-medium text-foreground">No source-verified attorneys found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters. Legacy records without durable source evidence are intentionally hidden.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results count + pagination header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
        <span>
          Showing {showingFrom}–{showingTo} of <strong className="text-gray-800">{totalCount.toLocaleString()}</strong> verified attorneys
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded-md border text-xs font-medium disabled:opacity-40 hover:bg-muted/50 transition"
            >
              ← Prev
            </button>
            <span className="text-xs tabular-nums">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="px-3 py-1 rounded-md border text-xs font-medium disabled:opacity-40 hover:bg-muted/50 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {attorneys.map((lawyer) => (
        <div
          key={lawyer.id}
          className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-foreground">{lawyer.name}</h3>
              {lawyer.firm && (
                <p className="text-sm text-muted-foreground font-medium">{lawyer.firm}</p>
              )}
            </div>
            <div className="flex gap-1.5">
              {lawyer.is_verified && (
                <span className="bg-accent/15 text-accent text-xs px-2 py-1 rounded-full font-semibold">
                  ✓ Source Verified
                </span>
              )}
              {lawyer.accepts_pro_bono && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold">
                  Pro Bono
                </span>
              )}
            </div>
          </div>

          {(lawyer.city || lawyer.state) && (
            <div className="mt-3 flex items-center text-muted-foreground text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {[lawyer.city, lawyer.state].filter(Boolean).join(", ")}
              {lawyer.years_experience && (
                <span className="ml-3 text-muted-foreground/70">· {lawyer.years_experience} yrs experience</span>
              )}
            </div>
          )}

          {/* Practice areas */}
          {lawyer.practice_areas && lawyer.practice_areas.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {lawyer.practice_areas.slice(0, 5).map((area) => (
                <span
                  key={`${lawyer.id}-pa-${area}`}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-secondary text-secondary-foreground border border-border"
                >
                  {area}
                </span>
              ))}
            </div>
          )}

          {/* Specialties */}
          {lawyer.specialties && lawyer.specialties.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {lawyer.specialties.slice(0, 4).map((spec) => (
                <span
                  key={`${lawyer.id}-${spec}`}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-secondary text-muted-foreground border border-border"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* Bio */}
          {lawyer.bio && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{lawyer.bio}</p>
          )}

          <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row gap-4">
            {lawyer.email && (
              <a href={`mailto:${lawyer.email}`} className="text-primary hover:text-primary/80 text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Email Attorney
              </a>
            )}
            {lawyer.phone && (
              <a href={`tel:${lawyer.phone}`} className="text-muted-foreground hover:text-foreground text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                {lawyer.phone}
              </a>
            )}
            {lawyer.website && (
              <a href={lawyer.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                Website
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4 border-t">
          <button
            onClick={() => { setPage(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === 0}
            className="px-3 py-1.5 rounded-md border text-xs font-medium disabled:opacity-40 hover:bg-muted/50 transition"
          >
            First
          </button>
          <button
            onClick={() => { setPage((p) => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === 0}
            className="px-3 py-1.5 rounded-md border text-xs font-medium disabled:opacity-40 hover:bg-muted/50 transition"
          >
            ← Prev
          </button>
          <span className="text-sm text-muted-foreground tabular-nums mx-2">
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={!hasMore}
            className="px-3 py-1.5 rounded-md border text-xs font-medium disabled:opacity-40 hover:bg-muted/50 transition"
          >
            Next →
          </button>
          <button
            onClick={() => { setPage(totalPages - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={!hasMore}
            className="px-3 py-1.5 rounded-md border text-xs font-medium disabled:opacity-40 hover:bg-muted/50 transition"
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
}
