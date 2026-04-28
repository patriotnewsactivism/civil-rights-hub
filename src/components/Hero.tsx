import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, FileText, Radio, AlertCircle, BookOpen, Users, Video, MapPin, Zap, ChevronRight, Scale, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface LiveStats {
  violations24h: number;
  violationsTotal: number;
  activeFoias: number;
  totalAttorneys: number;
  activeScanners: number;
}

export const Hero = () => {
  const [stats, setStats] = useState<LiveStats>({
    violations24h: 0,
    violationsTotal: 0,
    activeFoias: 0,
    totalAttorneys: 0,
    activeScanners: 0,
  });
  const [tickerIndex, setTickerIndex] = useState(0);
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const [v, vAll, a, sc, foia] = await Promise.all([
          supabase.from("violations").select("id", { count: "exact", head: true }).gte("created_at", since24h),
          supabase.from("violations").select("id", { count: "exact", head: true }),
          supabase.from("attorneys").select("id", { count: "exact", head: true }),
          supabase.from("scanner_links").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("foia_requests").select("id", { count: "exact", head: true }),
        ]);

        // Log errors but don't crash — use 0 as the safe fallback
        if (v.error) console.warn("Stats: violations 24h query error:", v.error.message);
        if (vAll.error) console.warn("Stats: violations total query error:", vAll.error.message);
        if (a.error) console.warn("Stats: attorneys query error:", a.error.message);
        if (sc.error) console.warn("Stats: scanners query error:", sc.error.message);
        if (foia.error) console.warn("Stats: FOIA query error:", foia.error.message);

        setStats({
          violations24h: v.count ?? 0,
          violationsTotal: vAll.count ?? 0,
          activeFoias: foia.count ?? 0,
          totalAttorneys: a.count ?? 0,
          activeScanners: sc.count ?? 0,
        });
      } catch (err) {
        console.error("Stats: failed to load live stats", err);
      }
      setStatsLoaded(true);
    };
    void loadStats();
  }, []);

  // Live ticker items — use nullish checks (??) instead of || to show real 0
  const tickerItems = [
    `🔴 ${stats.violationsTotal > 0 ? `${stats.violations24h} reports in last 24h · ${stats.violationsTotal.toLocaleString()} total` : `${stats.violations24h} reports in last 24h`}`,
    ...(stats.activeFoias > 0 ? [`📋 ${stats.activeFoias} active FOIAs tracked`] : []),
    `⚖️ ${stats.totalAttorneys.toLocaleString()} attorneys in directory`,
    `📡 ${stats.activeScanners.toLocaleString()} live scanner feeds`,
    "✊ Know your rights — it starts here",
    "🎥 Go Live and document anything, anywhere",
    "🚨 Emergency contacts one tap away",
  ];

  useEffect(() => {
    const t = setInterval(() => setTickerIndex((i) => (i + 1) % tickerItems.length), 3000);
    return () => clearInterval(t);
  }, [tickerItems.length]);

  return (
    <section className="relative overflow-hidden bg-background min-h-[85vh] flex flex-col">
      {/* Deep dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-background to-background z-0" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Ambient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-red-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Live ticker bar */}
      <div className="relative z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm py-2 px-4">
        <div className="container mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Live</span>
          </div>
          <div className="overflow-hidden flex-1">
            <p
              key={tickerIndex}
              className="text-xs md:text-sm text-foreground/80 animate-fade-in font-medium"
            >
              {tickerItems[tickerIndex]}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-muted-foreground flex-shrink-0">
            {tickerItems
              .filter((_, i) => i !== tickerIndex)
              .slice(0, 2)
              .map((item, i) => (
                <span key={i} className="opacity-50 truncate max-w-[180px]">{item}</span>
              ))}
          </div>
        </div>
      </div>

      {/* Main hero content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold">
              <Shield className="h-4 w-4" />
              Nation's Most Comprehensive Civil Rights Platform
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
                <span className="text-foreground">Your Rights.</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                  Defended.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Report violations. Find attorneys. File FOIAs. Know your rights. Go live.
                Everything you need when it matters most — in one place.
              </p>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 font-bold shadow-lg shadow-primary/25 group" asChild>
                <Link to="/do-this-now">
                  <Zap className="h-5 w-5 mr-2" />
                  Something is happening NOW
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 border-border/60 hover:bg-accent" asChild>
                <Link to="/rights">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Know Your Rights
                </Link>
              </Button>
            </div>

            {/* Quick access grid — expanded with new items */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 max-w-4xl mx-auto pt-4">
              {[
                { icon: AlertCircle, label: "Report Violation", to: "/do-this-now#report", color: "text-red-400", bg: "hover:bg-red-500/10" },
                { icon: Scale, label: "Conflicting Laws", to: "/rights?tab=conflicts", color: "text-amber-400", bg: "hover:bg-amber-500/10" },
                { icon: FileText, label: "FOIA Builder", to: "/tools", color: "text-blue-400", bg: "hover:bg-blue-500/10" },
                { icon: Users, label: "Find Attorney", to: "/attorneys", color: "text-green-400", bg: "hover:bg-green-500/10" },
                { icon: Radio, label: "Scanner Feeds", to: "/tools#scanner", color: "text-orange-400", bg: "hover:bg-orange-500/10" },
              ].map(({ icon: Icon, label, to, color, bg }) => (
                <Link
                  key={label}
                  to={to}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 ${bg} transition-all group`}
                >
                  <Icon className={`h-6 w-6 ${color} group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                    {label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Live stats strip */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                {statsLoaded ? stats.violations24h : "—"} reports (24h)
              </span>
              <span>·</span>
              <span>{statsLoaded ? stats.totalAttorneys.toLocaleString() : "—"} attorneys</span>
              <span>·</span>
              <span>{statsLoaded ? stats.activeScanners.toLocaleString() : "—"} live scanners</span>
              <span>·</span>
              <span>Free &amp; open to all</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
