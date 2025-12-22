import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";

vi.mock("@/components/Header", () => ({ Header: () => <div role="banner">Header</div> }));
vi.mock("@/components/Footer", () => ({ Footer: () => <div role="contentinfo">Footer</div> }));
vi.mock("@/components/KnowYourRights", () => ({ KnowYourRights: () => <div>Know Your Rights</div> }));
vi.mock("@/components/IncidentGuide", () => ({ IncidentGuide: () => <div>Incident Guide</div> }));
vi.mock("@/components/FOIABuilder", () => ({ FOIABuilder: () => <div>FOIA Builder</div> }));
vi.mock("@/components/FOIATracker", () => ({ FOIATracker: () => <div>FOIA Tracker</div> }));
vi.mock("@/components/ResourceCommandCenter", () => ({
  ResourceCommandCenter: () => <div>Resource Command Center</div>
}));
vi.mock("@/components/InteractiveMap", () => ({ InteractiveMap: () => <div>Interactive Map</div> }));
vi.mock("@/components/FeaturedNews", () => ({ FeaturedNews: () => <div>Featured News</div> }));
vi.mock("@/components/LawyerFinder", () => ({ LawyerFinder: () => <div>Lawyer Finder</div> }));
vi.mock("@/components/EmergencyContacts", () => ({ EmergencyContacts: () => <div>Emergency Contacts</div> }));
vi.mock("@/components/Resources", () => ({ Resources: () => <div>Resources</div> }));

import Rights from "./Rights";
import DoThisNow from "./DoThisNow";
import Tools from "./Tools";
import Learn from "./Learn";
import News from "./News";
import Help from "./Help";

const renderWithRoute = (path: string, element: JSX.Element) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={path} element={element} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );

describe("Navigation pages", () => {
  it("shows rights hero", () => {
    renderWithRoute("/rights", <Rights />);
    expect(screen.getByRole("heading", { name: /know your rights by jurisdiction/i })).toBeInTheDocument();
  });

  it("shows do this now hero", () => {
    renderWithRoute("/do-this-now", <DoThisNow />);
    expect(
      screen.getByRole("heading", { name: /scenario playbooks for urgent situations/i })
    ).toBeInTheDocument();
  });

  it("shows tools hero", () => {
    renderWithRoute("/tools", <Tools />);
    expect(screen.getByRole("heading", { name: /accountability tools and generators/i })).toBeInTheDocument();
  });

  it("shows learn hero", () => {
    renderWithRoute("/learn", <Learn />);
    expect(screen.getByRole("heading", { name: /deepen your understanding/i })).toBeInTheDocument();
  });

  it("shows newsroom hero", () => {
    renderWithRoute("/news", <News />);
    expect(screen.getByRole("heading", { name: /investigations and explainers/i })).toBeInTheDocument();
  });

  it("shows help hero", () => {
    renderWithRoute("/help", <Help />);
    expect(screen.getByRole("heading", { name: /legal help and emergency support/i })).toBeInTheDocument();
  });
});
