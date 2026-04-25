import { useState, useEffect, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, ChevronRight, UserPlus, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  location: string | null;
  role: string | null;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CYCLE_MS = 4000;

const ROLE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  admin:      { bg: "bg-red-500/20",     text: "text-red-400",     label: "Admin" },
  moderator:  { bg: "bg-amber-500/20",   text: "text-amber-400",   label: "Moderator" },
  journalist: { bg: "bg-sky-500/20",     text: "text-sky-400",     label: "Journalist" },
  activist:   { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Activist" },
  attorney:   { bg: "bg-teal-500/20",  text: "text-teal-300",  label: "Attorney" },
  member:     { bg: "bg-slate-500/20",   text: "text-slate-400",   label: "Member" },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRoleStyle(role: string | null) {
  return ROLE_STYLES[role ?? "member"] ?? ROLE_STYLES.member;
}

/* ------------------------------------------------------------------ */
/*  Hook: responsive visible-count                                     */
/* ------------------------------------------------------------------ */

function useVisibleCount() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setCount(5);
      else if (w >= 768) setCount(3);
      else setCount(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const CommunityCarousel = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const visibleCount = useVisibleCount();

  /* ---------- data fetch (once) ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, display_name, avatar_url, location, role")
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (!error && data) setProfiles(data as Profile[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ---------- derived ---------- */
  const total = profiles.length;
  const canScroll = total > visibleCount;
  const maxIndex = Math.max(0, total - visibleCount);
  const totalPages = canScroll ? Math.ceil(total / visibleCount) : 1;
  const currentPage = canScroll ? Math.min(Math.floor(currentIndex / visibleCount), totalPages - 1) : 0;
  const itemPct = 100 / visibleCount;

  /* ---------- navigation ---------- */
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToPage = useCallback(
    (page: number) => setCurrentIndex(Math.min(page * visibleCount, maxIndex)),
    [visibleCount, maxIndex],
  );

  /* ---------- auto-cycle ---------- */
  useEffect(() => {
    if (isPaused || !canScroll) return;
    const id = setInterval(goNext, CYCLE_MS);
    return () => clearInterval(id);
  }, [isPaused, canScroll, goNext]);

  /* ---------- skeleton loading ---------- */
  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 animate-pulse w-48">
                <div className="h-16 w-16 rounded-full bg-white/10" />
                <div className="h-4 w-24 rounded bg-white/10" />
                <div className="h-3 w-16 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---------- empty state ---------- */
  if (total === 0) {
    return (
      <section className="py-20 relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[140px] -z-10" />
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="inline-flex p-4 rounded-full bg-primary/10 border border-primary/20">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Join Our Growing{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Community
              </span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Be part of a nationwide network of citizens, journalists, attorneys, and activists defending civil rights.
            </p>
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link to="/auth">
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- center-card index for glow ---------- */
  const centerVisibleIdx = currentIndex + Math.floor(visibleCount / 2);

  return (
    <section className="py-20 relative overflow-hidden bg-slate-950 text-white">
      {/* Ambient background blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-accent/6 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* -------- Section header -------- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="text-center sm:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
              <Users className="h-4 w-4" />
              Community Network
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Our Growing{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Community
              </span>
            </h2>
            <p className="text-slate-400 max-w-lg leading-relaxed">
              Meet the people building a more just future — journalists, attorneys, activists, and citizens standing up for civil rights.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Badge variant="outline" className="text-sm px-3 py-1 border-primary/30 text-primary bg-primary/5">
              {total} {total === 1 ? "Member" : "Members"}
            </Badge>
            <Button asChild variant="outline" size="sm" className="border-white/10 hover:bg-white/5 backdrop-blur-sm">
              <Link to="/community">
                <UserPlus className="mr-2 h-4 w-4" />
                Join the Network
              </Link>
            </Button>
          </div>
        </div>

        {/* -------- Carousel -------- */}
        <div
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Track viewport */}
          <div className="overflow-hidden mx-auto">
            <div
              ref={trackRef}
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{ transform: `translateX(-${currentIndex * itemPct}%)` }}
            >
              {profiles.map((profile, idx) => {
                const rs = getRoleStyle(profile.role);
                const isCenter = idx === centerVisibleIdx;

                return (
                  <div
                    key={profile.id}
                    className="shrink-0 px-2 md:px-3"
                    style={{ width: `${itemPct}%` }}
                  >
                    <div
                      className={[
                        "flex flex-col items-center py-6 px-4 md:py-8 md:px-5 rounded-2xl border transition-all duration-500",
                        isCenter
                          ? "bg-white/[0.08] border-primary/30 shadow-[0_0_30px_-5px] shadow-primary/15 scale-[1.03]"
                          : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07] hover:border-white/10",
                      ].join(" ")}
                    >
                      {/* Avatar */}
                      <Avatar
                        className={[
                          "transition-all duration-500 ring-2 ring-offset-2 ring-offset-slate-950",
                          isCenter
                            ? "h-16 w-16 md:h-20 md:w-20 ring-primary/40"
                            : "h-12 w-12 md:h-16 md:w-16 ring-white/10",
                        ].join(" ")}
                      >
                        {profile.avatar_url && (
                          <AvatarImage
                            src={profile.avatar_url}
                            alt={profile.display_name ?? "Member"}
                          />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-white font-bold text-sm md:text-base">
                          {getInitials(profile.display_name)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Name */}
                      <h3 className="mt-3 font-semibold text-sm md:text-base text-white truncate max-w-[90%] text-center">
                        {profile.display_name || "Community Member"}
                      </h3>

                      {/* Location */}
                      {profile.location && (
                        <p className="flex items-center gap-1 text-xs text-slate-400 mt-1 truncate max-w-[90%]">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {profile.location}
                        </p>
                      )}

                      {/* Role badge */}
                      {profile.role && (
                        <Badge
                          variant="outline"
                          className={`mt-2.5 text-[10px] md:text-xs border-0 ${rs.bg} ${rs.text}`}
                        >
                          {rs.label}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* -------- Arrow nav (hover-reveal) -------- */}
          {canScroll && (
            <>
              <button
                onClick={goPrev}
                aria-label="Previous members"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-3 z-10 p-2 rounded-full bg-slate-900/90 border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-slate-800 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goNext}
                aria-label="Next members"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-3 z-10 p-2 rounded-full bg-slate-900/90 border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-slate-800 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* -------- Dot indicators -------- */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Carousel pages">
            {Array.from({ length: totalPages }).map((_, pageIdx) => (
              <button
                key={pageIdx}
                role="tab"
                aria-selected={pageIdx === currentPage}
                aria-label={`Page ${pageIdx + 1}`}
                onClick={() => goToPage(pageIdx)}
                className={[
                  "h-2 rounded-full transition-all duration-300",
                  pageIdx === currentPage
                    ? "w-8 bg-primary"
                    : "w-2 bg-white/20 hover:bg-white/40",
                ].join(" ")}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
