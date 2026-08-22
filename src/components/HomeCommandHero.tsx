import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  FileSearch,
  FileText,
  Radio,
  Shield,
  ShieldCheck,
  Video,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveStats } from "@/hooks/useLiveStats";

const primaryActions = [
  {
    eyebrow: "Emergency",
    title: "I Need Help Now",
    description: "Open encounter checklists, document what is happening, share your location, and preserve information for follow-up.",
    to: "/do-this-now",
    icon: Zap,
    treatment: "border-red-500/35 bg-red-500/10 hover:bg-red-500/15 hover:border-red-400/60",
    iconTreatment: "bg-red-500/15 text-red-400 ring-red-500/30",
  },
  {
    eyebrow: "Rights",
    title: "Know My Rights",
    description: "Review plain-language constitutional references and jurisdiction-specific material before an encounter becomes a crisis.",
    to: "/rights",
    icon: ShieldCheck,
    treatment: "border-primary/35 bg-primary/10 hover:bg-primary/15 hover:border-primary/60",
    iconTreatment: "bg-primary/15 text-primary ring-primary/30",
  },
  {
    eyebrow: "Research",
    title: "Investigate & Take Action",
    description: "Build public-records requests, research cases and agencies, document incidents, and preserve source material.",
    to: "/tools",
    icon: FileSearch,
    treatment: "border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 hover:border-amber-400/55",
    iconTreatment: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  },
] as const;

const rapidLinks = [
  { label: "Report an Incident", to: "/do-this-now#report", icon: FileText },
  { label: "FOIA Builder", to: "/help#tools", icon: FileSearch },
  { label: "Go Live / Backup", to: "/do-this-now#golive", icon: Video },
  { label: "Live Scanners", to: "/help#tools", icon: Radio },
] as const;

export function HomeCommandHero() {
  const { stats, isLoading } = useLiveStats();

  const liveStats = [
    { value: stats.activeScanners, label: "live scanner feeds" },
  ].filter((item) => item.value > 0);

  return (
    <section className="relative isolate overflow-hidden border-b border-border/50 bg-[hsl(222_34%_7%)] text-white">
      <div
        className="absolute inset-0 -z-20 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.22) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
        }}
      />
      <div className="absolute -left-40 -top-48 -z-10 h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[150px]" />
      <div className="absolute -bottom-52 right-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-amber-500/10 blur-[150px]" />

      <div className="container mx-auto px-4 py-14 md:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_.88fr] lg:gap-14">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-white/75">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Civil Rights Research & Response Hub
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl lg:text-6xl">
                Know your rights.
                <span className="block bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent">
                  Document the truth.
                </span>
                <span className="block text-white/90">Take action.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                Civil Rights Hub brings together emergency encounter tools, constitutional references,
                public-records tools, research resources, incident reporting, and community features — free and independent.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-12 rounded-full bg-red-600 px-6 font-black text-white shadow-xl shadow-red-950/30 hover:bg-red-500">
                  <Link to="/do-this-now">
                    <Zap className="mr-2 h-4 w-4" />
                    Open Emergency Mode
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/20 bg-white/5 px-6 font-bold text-white hover:bg-white/10 hover:text-white">
                  <Link to="/rights">
                    Explore Rights References
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/60">
                <span>Free to use</span>
                <span className="hidden text-white/20 sm:inline">•</span>
                <span>No paywall</span>
                <span className="hidden text-white/20 sm:inline">•</span>
                <span>Source-first data policy</span>
                <span className="hidden text-white/20 sm:inline">•</span>
                <span>Powered by We The People News</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-amber-500/10 blur-2xl" />
              <div className="relative rounded-[1.6rem] border border-white/10 bg-black/25 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-4">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Choose your next move</p>
                    <p className="mt-1 text-sm font-bold text-white/80">Start with the situation you are in.</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Tools Online
                  </div>
                </div>

                <div className="space-y-2.5">
                  {primaryActions.map(({ eyebrow, title, description, to, icon: Icon, treatment, iconTreatment }) => (
                    <Link
                      key={title}
                      to={to}
                      className={`group flex items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200 ${treatment}`}
                    >
                      <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${iconTreatment}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">{eyebrow}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <h2 className="text-base font-black text-white sm:text-lg">{title}</h2>
                          <ArrowRight className="h-4 w-4 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-white/70" />
                        </div>
                        <p className="mt-1 text-xs leading-5 text-white/60">{description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {rapidLinks.map(({ label, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-bold text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-white/60" />
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
              <Activity className="h-3.5 w-3.5 text-emerald-300" />
              Live platform status
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/60">
              {isLoading ? (
                <span>Syncing live tools…</span>
              ) : (
                <>
                  {liveStats.map((item) => (
                    <span key={item.label}>
                      <strong className="mr-1 text-white">{item.value.toLocaleString()}</strong>
                      {item.label}
                    </span>
                  ))}
                  <span>
                    <strong className="mr-1 text-white">50</strong>
                    state navigation options
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
