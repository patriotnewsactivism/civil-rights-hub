import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield, ArrowRight, FileText, Radio, AlertCircle,
  Users, Video, Zap, ChevronRight, ChevronLeft, Scale,
  Activity, Clock, MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLiveStats } from "@/hooks/useLiveStats";
import type { RecentViolation } from "@/hooks/useLiveStats";
import { cn } from "@/lib/utils";

type LucideIcon = typeof Shield;

interface TickerItem {
  text: string;
  to: string;
  icon?: LucideIcon;
  priority?: "normal" | "alert";
}

interface QuickAccessItem {
  icon: LucideIcon;
  label: string;
  to: string;
  color: string;
  border: string;
  featured?: boolean;
}

const TICKER_INTERVAL = 4000;

function getAlertLevel(count: number): { label: string; color: string; ring: string } {
  if (count >= 20) return { label: "CRITICAL", color: "text-destructive", ring: "ring-destructive/40" };
  if (count >= 5) return { label: "ELEVATED", color: "text-accent", ring: "ring-accent/40" };
  return { label: "MONITORING", color: "text-primary", ring: "ring-primary/30" };
}

function formatRelative(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const QUICK_ACCESS: QuickAccessItem[] = [
  { icon: AlertCircle, label: "Report Violation", to: "/do-this-now#report", color: "text-destructive", border: "hover:border-destructive/50 hover:bg-destructive/10", featured: true },
  { icon: Scale, label: "Know Your Rights", to: "/rights", color: "text-primary", border: "hover:border-primary/50 hover:bg-primary/10" },
  { icon: FileText, label: "FOIA Request", to: "/help#records", color: "text-accent", border: "hover:border-accent/50 hover:bg-accent/10" },
  { icon: Users, label: "Find Attorney", to: "/help#attorneys", color: "text-primary", border: "hover:border-primary/50 hover:bg-primary/10" },
  { icon: Radio, label: "Live Scanners", to: "/help#tools", color: "text-accent", border: "hover:border-accent/50 hover:bg-accent/10" },
  { icon: Video, label: "Go Live", to: "/community", color: "text-primary", border: "hover:border-primary/50 hover:bg-primary/10" },
];

const STAT_CHIPS: { key: keyof import("@/hooks/useLiveStats").LiveStats; icon: LucideIcon; label: string; to: string }[] = [
  { key: "violations24h", icon: AlertCircle, label: "reports today", to: "/do-this-now#report" },
  { key: "totalAttorneys", icon: Scale, label: "attorneys", to: "/help#attorneys" },
  { key: "activeScanners", icon: Radio, label: "live scanners", to: "/help#tools" },
  { key: "activeFoias", icon: FileText, label: "FOIA requests", to: "/help#records" },
];

export const Hero = () => {
  const { stats, recent, isLoading, isSuccess, dataUpdatedAt } = useLiveStats();
  const [tickerIndex, setTickerIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recentItems: TickerItem[] = recent.map((v: RecentViolation) => {
    const loc = [v.location_city, v.location_state].filter(Boolean).join(", ");
    return {
      text: `New report: ${v.title}${loc ? ` — ${loc}` : ""} · ${formatRelative(new Date(v.created_at).getTime())}`,
      to: "/community?tab=feed",
      icon: MapPin,
      priority: "alert" as const,
    };
  });

  const tickerItems: TickerItem[] = [
    ...recentItems,
    {
      text: `${stats.violations24h} violation reports in last 24h · ${stats.violationsTotal.toLocaleString()} total documented`,
      to: "/do-this-now#report",
      icon: AlertCircle,
      priority: "alert",
    },
    ...(stats.activeFoias > 0
      ? [{ text: `${stats.activeFoias} active FOIA requests being tracked`, to: "/help#records", icon: FileText }]
      : []),
    { text: `${stats.totalAttorneys.toLocaleString()} civil rights attorneys in our directory`, to: "/help#attorneys", icon: Scale },
    { text: `${stats.activeScanners.toLocaleString()} live scanner feeds monitored`, to: "/help#tools", icon: Radio },
    { text: "Go live and document encounters — recordings saved to your account", to: "/community", icon: Video },
    { text: "Emergency contacts and legal aid one tap away", to: "/do-this-now", icon: Zap },
    { text: "Anti-censorship · No shadow-banning · No engagement bait", to: "/about", icon: Shield },
  ];

  const safeIndex = tickerItems.length > 0 ? tickerIndex % tickerItems.length : 0;
  const advance = useCallback(
    (dir: number) => setTickerIndex((i) => (i + dir + tickerItems.length) % tickerItems.length),
    [tickerItems.length],
  );

  useEffect(() => {
    if (paused || tickerItems.length <= 1) return;
    intervalRef.current = setInterval(() => advance(1), TICKER_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, tickerItems.length, advance]);

  // Reset ticker index when items change (e.g. after stats load)
  useEffect(() => { setTickerIndex(0); }, [tickerItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); advance(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); advance(-1); }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [advance]);

  const currentItem = tickerItems[safeIndex];
  const alert = getAlertLevel(stats.violations24h);
  const synced = isSuccess && !isLoading;

  return (
    <section className="relative overflow-hidden bg-background min-h-[90vh] flex flex-col">

      {/* ── Background treatment ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222_30%_7%)] via-background to-background dark:from-[hsl(222_35%_5%)] dark:to-background z-0" />
      {/* Navy ambient glow — top left */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
      {/* Gold ambient glow — bottom right */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-accent/6 rounded-full blur-[140px] pointer-events-none" />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />

      {/* ── LIVE ticker bar ── */}
      <div
        ref={tickerRef}
        className="relative z-10 bg-gradient-to-r from-primary/25 via-primary/20 to-accent/15 border-b border-primary/50 py-2.5 px-4 shadow-lg shadow-primary/20"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        tabIndex={0}
        role="region"
        aria-label="Live activity ticker — use arrow keys to navigate"
      >
        <div className="container mx-auto flex items-center gap-3">
          {/* LIVE / SYNCING badge with radar sweep */}
          <div
            className={cn(
              "flex items-center gap-1.5 shrink-0 rounded-full px-3 py-0.5 shadow-md transition-colors",
              synced
                ? "bg-primary text-primary-foreground shadow-primary/40"
                : "bg-accent/20 text-accent border border-accent/40 shadow-accent/20",
            )}
          >
            <div className="relative h-3 w-3 flex items-center justify-center">
              {synced ? (
                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
              ) : (
                <span className="absolute h-3 w-3 rounded-full border-2 border-accent/60 animate-radar-sweep" />
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {synced ? "LIVE" : "SYNCING"}
            </span>
          </div>

          {/* Ticker text — clickable link */}
          <div className="overflow-hidden flex-1" aria-live="polite" aria-atomic="true">
            <Link
              key={safeIndex}
              to={currentItem.to}
              className="flex items-center gap-2 text-xs md:text-sm text-foreground font-semibold animate-fade-in hover:text-accent transition-colors group"
              aria-label={currentItem.text}
            >
              {currentItem.icon && (
                <currentItem.icon className={cn("h-3.5 w-3.5 shrink-0", currentItem.priority === "alert" ? "text-destructive" : "text-accent")} />
              )}
              <span className="truncate group-hover:underline decoration-accent/50 underline-offset-2">
                {currentItem.text}
              </span>
              <ArrowRight className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => advance(-1)}
              className="p-1 rounded hover:bg-primary/20 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Previous ticker item"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => advance(1)}
              className="p-1 rounded hover:bg-primary/20 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Next ticker item"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="container mx-auto mt-1.5 h-0.5 bg-primary/15 rounded-full overflow-hidden">
          <div
            key={safeIndex}
            className="h-full origin-left rounded-full bg-accent animate-ticker-progress"
            style={{ animationPlayState: paused ? "paused" : "running" }}
            aria-hidden
          />
        </div>

        {/* Dot indicators */}
        <div className="container mx-auto mt-1 flex items-center justify-center gap-1">
          {tickerItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setTickerIndex(i)}
              className={cn(
                "h-1 rounded-full transition-all",
                i === safeIndex ? "w-4 bg-accent" : "w-1 bg-foreground/30 hover:bg-foreground/50",
              )}
              aria-label={`Go to ticker item ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Main hero ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">

            {/* Platform badge */}
            <div className="flex justify-center mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/8 text-primary text-xs font-bold uppercase tracking-wider">
                <Shield className="h-3.5 w-3.5" />
                Free · Anti-Censorship · Open to All
              </div>
            </div>

            {/* Headline */}
            <div className="text-center space-y-4 mb-10">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter">
                <span className="block text-foreground animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}>
                  KNOW YOUR
                </span>
                <span
                  className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-fade-in-up"
                  style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
                >
                  RIGHTS.
                </span>
                <span
                  className="block text-foreground/90 text-4xl md:text-5xl lg:text-6xl mt-2 font-black animate-fade-in-up"
                  style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
                >
                  USE THEM.
                </span>
              </h1>
              <p
                className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-6 animate-fade-in-up"
                style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}
              >
                The nation's most complete civil rights platform. Report violations, find attorneys,
                file FOIAs, go live, and organize — built to replace the platforms that silence you.
              </p>
            </div>

            {/* Primary CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 justify-center mb-12 animate-fade-in-up"
              style={{ animationDelay: "0.5s", animationFillMode: "backwards" }}
            >
              <Button
                size="lg"
                className="group text-base px-8 py-6 font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 border-0"
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
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 max-w-5xl mx-auto mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}
            >
              {QUICK_ACCESS.map(({ icon: Icon, label, to, color, border, featured }) => (
                <Link
                  key={label}
                  to={to}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg border bg-card/40 backdrop-blur-sm transition-all group",
                    featured
                      ? "border-destructive/40 ring-1 ring-destructive/30 bg-destructive/5 hover:border-destructive/60 hover:bg-destructive/10"
                      : cn("border-border/40", border),
                  )}
                >
                  <Icon className={cn("h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform", color)} />
                  <span className="text-[10px] md:text-xs font-semibold text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                    {label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Live stats strip */}
            <div
              className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-xs animate-fade-in-up"
              style={{ animationDelay: "0.7s", animationFillMode: "backwards" }}
            >
              {/* Alert level indicator */}
              <span className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-card/60 ring-1", alert.ring)}>
                <Activity className={cn("h-3 w-3", alert.color)} />
                <span className={cn("font-bold uppercase tracking-wide", alert.color)}>{alert.label}</span>
              </span>

              {/* Stat chips */}
              {STAT_CHIPS.map(({ key, icon: Icon, label, to }) => (
                <Link
                  key={key}
                  to={to}
                  className="flex items-center gap-1.5 hover:text-accent transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {isLoading ? (
                    <span className="inline-block h-3 w-8 rounded bg-muted animate-pulse" />
                  ) : (
                    <strong className="text-foreground">{stats[key].toLocaleString()}</strong>
                  )}
                  <span className="text-muted-foreground">{label}</span>
                </Link>
              ))}

              <span className="text-border">·</span>

              {/* Last updated */}
              {synced && dataUpdatedAt ? (
                <span className="flex items-center gap-1 text-muted-foreground/70">
                  <Clock className="h-3 w-3" />
                  Updated {formatRelative(dataUpdatedAt)}
                </span>
              ) : null}

              <span className="text-border">·</span>

              <span className="text-accent font-semibold">Free forever · No algorithms · No censorship</span>
            </div>

          </div>
        </div>
      </div>

      {/* Gradient transition to page body */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background z-0 pointer-events-none" />
    </section>
  );
};
