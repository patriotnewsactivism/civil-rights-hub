import { render, screen, fireEvent } from "@testing-library/react";
import { CommunityActionBar } from "../CommunityActionBar";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";

// Mock the child components to focus on ActionBar logic
vi.mock("../GoLiveRecorder", () => ({
  GoLiveRecorder: () => <div data-testid="go-live-recorder">Go Live Recorder</div>,
}));

vi.mock("../QuickViolationReport", () => ({
  QuickViolationReport: () => <div data-testid="quick-violation-report">Violation Report</div>,
}));

describe("CommunityActionBar", () => {
  const userId = "test-user-123";

  it("renders all action buttons", () => {
    render(
      <BrowserRouter>
        <CommunityActionBar userId={userId} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Go Live/i)).toBeInTheDocument();
    expect(screen.getByText(/Report Violation/i)).toBeInTheDocument();
    expect(screen.getByText(/FOIA Request/i)).toBeInTheDocument();
    expect(screen.getByText(/Find Attorney/i)).toBeInTheDocument();
    expect(screen.getByText(/Activists/i)).toBeInTheDocument();
  });

  it("toggles Go Live recorder when button is clicked", () => {
    render(
      <BrowserRouter>
        <CommunityActionBar userId={userId} />
      </BrowserRouter>
    );

    const goLiveBtn = screen.getByText(/Go Live/i);
    fireEvent.click(goLiveBtn);
    expect(screen.getByTestId("go-live-recorder")).toBeInTheDocument();

    fireEvent.click(goLiveBtn);
    expect(screen.queryByTestId("go-live-recorder")).not.toBeInTheDocument();
  });

  it("toggles Violation Report when button is clicked", () => {
    render(
      <BrowserRouter>
        <CommunityActionBar userId={userId} />
      </BrowserRouter>
    );

    const reportBtn = screen.getByText(/Report Violation/i);
    fireEvent.click(reportBtn);
    expect(screen.getByTestId("quick-violation-report")).toBeInTheDocument();

    fireEvent.click(reportBtn);
    expect(screen.queryByTestId("quick-violation-report")).not.toBeInTheDocument();
  });

  it("only shows one panel at a time", () => {
    render(
      <BrowserRouter>
        <CommunityActionBar userId={userId} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Go Live/i));
    expect(screen.getByTestId("go-live-recorder")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Report Violation/i));
    expect(screen.queryByTestId("go-live-recorder")).not.toBeInTheDocument();
    expect(screen.getByTestId("quick-violation-report")).toBeInTheDocument();
  });
});
