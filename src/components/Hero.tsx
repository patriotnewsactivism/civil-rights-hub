import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, FileText, Radio, AlertCircle, BookOpen, Users, Video, MapPin, Zap, ChevronRight, Scale, Flag, Mic } from "lucide-react";
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
        setStats({
          violations24h: v.count ?? 0,
          violationsTotal: vAll.count ?? 0,
          activeFoias: foia.count ?? 0,
          totalAttorneys: a.count ?? 0,
          activeScanners: sc.count ?? 0,
        });
      } catch { /* silent */ }
      setStatsLoaded(true);
    };
    void loadStats();
  }, []);

  const tickerItems = [
    `${stats.violations24h} violation reports in last 24h · ${stats.violationsTotal.toLocaleString()} total documented`,
    ...(stats.activeFoias > 0 ? [`${stats.activeFoias} active FOIA requests being tracked`] : []),
    `${stats.totalAttorneys.toLocaleString()} civil rights attorneys in our directory`,
    `${stats.activeScanners.toLocaleString()} live scanner feeds monitored`,
    "Go live and document encounters — recordings saved to your account",
    "Emergency contacts and legal aid one tap away",
    "Anti-censorship · No shadow-banning · No engagement bait",
  ];

  useEffect(() => {
    const t = setInterval(() => setTickerIndex((i) => (i + 1) % tickerItems.length), 3500);
    return () => clearInterval(t);
  }, [tickerItems.length]);

  return (
    <section className="relative overflow-hidden bg-background min-h-[90vh] flex flex-col">

      {/* Background treatment */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(20_12%_6%)] via-background to-background dark:from-[hsl(20_15%_5%)] dark:to-background z-0" />

      {/* Crimson ambient glow — top left */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
      {/* Amber ambient glow — bottom right */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-accent/6 rounded-full blur-[140px] pointer-events-none" />

      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />

      {/* LIVE ticker bar */}
      <div className="relative z-10 bg-primary/5 border-b border-primary/20 py-2 px-4">
        <div className="container mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 shrink-0 bg-primary/10 rounded-full px-3 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">LIVE</span>
          </div>
          <div className="overflow-hidden flex-1">
            <p key={tickerIndex} className="text-xs md:text-sm text-foreground/75 font-medium animate-fade-in">
              {tickerItems[tickerIndex]}
            </p>
          </div>
        </div>
      </div>

      {/* Main hero */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">

            {/* Platform badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/8 text-primary text-xs font-bold uppercase tracking-wider">
                <Shield className="h-3.5 w-3.5" />
                Free · Anti-Censorship · Open to All
              </div>
            </div>

            {/* Headline */}
            <div className="text-center space-y-4 mb-10">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter">
                <span className="block text-foreground">KNOW YOUR</span>
                <span className="block bg-gradient-to-r from-primary via-red-400 to-amber-500 bg-clip-text text-transparent">
                  RIGHTS.
                </span>
                <span className="block text-foreground/90 text-4xl md:text-5xl lg:text-6xl mt-2 font-black">
                  USE THEM.
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-6">
                The nation's most complete civil rights platform. Report violations, find attorneys,
                file FOIAs, go live, and organize — built to replace the platforms that silence you.
              </p>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Button
                size="lg"
                className="group text-base px-8 py-6 font-black bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 border-0"
                asChild
              >
                <Link to="/do-this-now">
                  <Zap className="h-5 w-5 mr-2" />
                  Something Is Happening NOW
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 border-border/60 hover:bg-accent/10 hover:border-accent/60 hover:text-accent font-bold"
                asChild
              >
                <Link to="/community">
                  <Users className="h-5 w-5 mr-2" />
                  Join the Community
                </Link>
              </Button>
            </div>

            {/* Quick-access action grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 max-w-5xl mx-auto mb-10">
              {[
                { icon: AlertCircle, label: "Report Violation", to: "/do-this-now#report", color: "text-red-500", border: "hover:border-red-500/50 hover:bg-red-500/8" },
                { icon: Scale, label: "Know Your Rights", to: "/rights", color: "text-amber-500", border: "hover:border-amber-500/50 hover:bg-amber-500/8" },
                { icon: FileText, label: "FOIA Request", to: "/tools", color: "text-sky-400", border: "hover:border-sky-400/50 hover:bg-sky-400/8" },
                { icon: Users, label: "Find Attorney", to: "/attorneys", color: "text-emerald-400", border: "hover:border-emerald-400/50 hover:bg-emerald-400/8" },
                { icon: Radio, label: "Live Scanners", to: "/tools#scanner", color: "text-orange-400", border: "hover:border-orange-400/50 hover:bg-orange-400/8" },
                { icon: Video, label: "Go Live", to: "/community", color: "text-primary", border: "hover:border-primary/50 hover:bg-primary/8" },
              ].map(({ icon: Icon, label, to, color, border }) => (
                <Link
                  key={label}
                  to={to}
                  className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm ${border} transition-all group`}
                >
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color} group-hover:scale-110 transition-transform`} />
                  <span className="text-[10px] md:text-xs font-semibold text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                    {label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Live stats strip */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <strong className="text-foreground">{statsLoaded ? stats.violations24h : "—"}</strong> reports today
              </span>
              <span className="text-border">·</span>
              <span><strong className="text-foreground">{statsLoaded ? stats.totalAttorneys.toLocaleString() : "—"}</strong> attorneys</span>
              <span className="text-border">·</span>
              <span><strong className="text-foreground">{statsLoaded ? stats.activeScanners.toLocaleString() : "—"}</strong> live scanners</span>
              <span className="text-border">·</span>
              <span className="text-accent font-semibold">Free forever · No algorithms · No censorship</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
