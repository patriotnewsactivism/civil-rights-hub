import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Community from "./pages/Community";
import Activists from "./pages/Activists";
import Attorneys from "./pages/Attorneys";
import ResourceLibrary from "./pages/ResourceLibrary";
import Rights from "./pages/Rights";
import DoThisNow from "./pages/DoThisNow";
import Tools from "./pages/Tools";
import PublicRecords from "./pages/PublicRecords";
import Learn from "./pages/Learn";
import Newsroom from "./pages/Newsroom";
import GetHelp from "./pages/GetHelp";
import { JurisdictionProvider } from "./hooks/useJurisdiction";

const CityPage = lazy(() => import("./pages/CityPage"));
const StatePage = lazy(() => import("./pages/StatePage"));
const StatesDirectory = lazy(() => import("./pages/StatesDirectory"));
const Sitemap = lazy(() => import("./pages/Sitemap"));

const queryClient = new QueryClient();

// ── Always scroll to the top when navigating to a new route ──────────────────
// Uses a MutationObserver to re-scroll after lazy-loaded components render and
// potentially steal focus (e.g. cmdk's CommandInput auto-focus).
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) {
      return;
    }

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    // Only scroll to top if there is no hash — hash links should still work
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      // Guard against lazy-loaded components that steal focus after initial
      // scroll (e.g. cmdk CommandInput). Watch for DOM mutations for a short
      // window and re-scroll if the viewport has been dragged away from 0.
      let ticks = 0;
      const maxTicks = 10; // stop after ~500ms
      const interval = setInterval(() => {
        ticks++;
        if (window.scrollY > 0) {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
        if (ticks >= maxTicks) clearInterval(interval);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [pathname, hash]);

  return null;
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <JurisdictionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rights" element={<Rights />} />
              <Route path="/do-this-now" element={<DoThisNow />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/newsroom" element={<Newsroom />} />
              <Route path="/help" element={<GetHelp />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/community" element={<Community />} />
              <Route path="/activists" element={<Activists />} />
              <Route path="/attorneys" element={<Attorneys />} />
              <Route path="/resources" element={<ResourceLibrary />} />
              {/* City pages – /city/los-angeles, /city/chicago, etc. */}
              <Route
                path="/city/:slug"
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Loading city hub…</div>}>
                    <CityPage />
                  </Suspense>
                }
              />
              {/* State pages – /state/california, /state/texas, etc. */}
              <Route
                path="/states"
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Loading states…</div>}>
                    <StatesDirectory />
                  </Suspense>
                }
              />
              <Route
                path="/state/:stateSlug"
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Loading state…</div>}>
                    <StatePage />
                  </Suspense>
                }
              />
              {/* Convenience routes that redirect to Community tabs */}
              <Route path="/notifications" element={<Navigate to="/community?tab=notifications" replace />} />
              <Route path="/messages" element={<Navigate to="/community?tab=messages" replace />} />
              <Route path="/network" element={<Navigate to="/community?tab=network" replace />} />
              {/* Sitemap */}
              <Route
                path="/sitemap"
                element={
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">Loading sitemap…</div>}>
                    <Sitemap />
                  </Suspense>
                }
              />
              <Route path="/public-records" element={<PublicRecords />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
        </JurisdictionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
