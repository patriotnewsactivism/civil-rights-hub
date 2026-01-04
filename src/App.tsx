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
import Newsroom from "./pages/Newsroom";
import GetHelp from "./pages/GetHelp";
import { JurisdictionProvider } from "./hooks/useJurisdiction";
import Attorneys from "./components/AttorneyList";
<AttorneyList 
  searchQuery={searchQuery} // State from your search input
  selectedState={selectedState} // State from your dropdown
  selectedSpecialty={selectedSpecialty} // State from specialty dropdown
/>


const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <JurisdictionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
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
