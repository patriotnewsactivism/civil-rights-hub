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
import Rights from "./pages/Rights";
import DoThisNow from "./pages/DoThisNow";
import Learn from "./pages/Learn";
import Newsroom from "./pages/Newsroom";
import GetHelp from "./pages/GetHelp";
import About from "./pages/About";
import Volunteer from "./pages/Volunteer";
import Contribute from "./pages/Contribute";
import Transparency from "./pages/Transparency";
import Donate from "./pages/Donate";
import Store from "./pages/Store";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AttorneyMatchPage from "./pages/AttorneyMatchPage";
import SolCalculatorPage from "./pages/SolCalculatorPage";
import StateComparisonPage from "./pages/StateComparisonPage";
import AttorneyPremiumPage from "./pages/AttorneyPremiumPage";
import AttorneyDashboardPage from "./pages/AttorneyDashboardPage";
import NewsletterPage from "./pages/NewsletterPage";
import { JurisdictionProvider } from "./hooks/useJurisdiction";
import { PageSkeleton } from "@/components/PageSkeleton";
import { SearchCommandDialog } from "@/components/SearchCommandDialog";

const CityPage = lazy(() => import("./pages/CityPage"));
const StatePage = lazy(() => import("./pages/StatePage"));
const StatesDirectory = lazy(() => import("./pages/StatesDirectory"));
const Sitemap = lazy(() => import("./pages/Sitemap"));

const queryClient = new QueryClient();

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      let ticks = 0;
      const maxTicks = 10;
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
              <Route path="/learn" element={<Learn />} />
              <Route path="/newsroom" element={<Newsroom />} />
              <Route path="/help" element={<GetHelp />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/community" element={<Community />} />
              <Route path="/find-attorney" element={<AttorneyMatchPage />} />
              <Route path="/sol-calculator" element={<SolCalculatorPage />} />
              <Route path="/compare-states" element={<StateComparisonPage />} />
              <Route path="/attorney-premium" element={<AttorneyPremiumPage />} />
              <Route path="/attorney-dashboard" element={<AttorneyDashboardPage />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route path="/tools" element={<Navigate to="/help#tools" replace />} />
              <Route path="/activists" element={<Navigate to="/help#activists" replace />} />
              <Route path="/attorneys" element={<Navigate to="/find-attorney" replace />} />
              <Route path="/resources" element={<Navigate to="/help#resources" replace />} />
              <Route
                path="/city/:slug"
                element={
                  <Suspense fallback={<PageSkeleton label="Loading city hub…" />}>
                    <CityPage />
                  </Suspense>
                }
              />
              <Route
                path="/states"
                element={
                  <Suspense fallback={<PageSkeleton label="Loading states…" />}>
                    <StatesDirectory />
                  </Suspense>
                }
              />
              <Route
                path="/state/:stateSlug"
                element={
                  <Suspense fallback={<PageSkeleton label="Loading state…" />}>
                    <StatePage />
                  </Suspense>
                }
              />
              <Route path="/notifications" element={<Navigate to="/community?tab=notifications" replace />} />
              <Route path="/messages" element={<Navigate to="/community?tab=messages" replace />} />
              <Route path="/network" element={<Navigate to="/community?tab=network" replace />} />
              <Route
                path="/sitemap"
                element={
                  <Suspense fallback={<PageSkeleton label="Loading sitemap…" />}>
                    <Sitemap />
                  </Suspense>
                }
              />
              <Route path="/public-records" element={<Navigate to="/help#records" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/contribute" element={<Contribute />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/store" element={<Store />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SearchCommandDialog />
          </BrowserRouter>
          <Analytics />
        </JurisdictionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
