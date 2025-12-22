import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
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
import Learn from "./pages/Learn";
import News from "./pages/News";
import Help from "./pages/Help";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/community" element={<Community />} />
            <Route path="/activists" element={<Activists />} />
            <Route path="/attorneys" element={<Attorneys />} />
            <Route path="/resources" element={<ResourceLibrary />} />
            <Route path="/rights" element={<Rights />} />
            <Route path="/do-this-now" element={<DoThisNow />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/news" element={<News />} />
            <Route path="/help" element={<Help />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
