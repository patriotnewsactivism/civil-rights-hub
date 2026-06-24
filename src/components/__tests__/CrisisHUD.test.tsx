import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CrisisHUD } from "../CrisisHUD";
import { useJurisdiction } from "@/hooks/useJurisdiction";
import { useToast } from "@/hooks/use-toast";

// Mock the context hooks
vi.mock("@/hooks/useJurisdiction", () => ({
  useJurisdiction: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

// Mock React Router Link
vi.mock("react-router-dom", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("CrisisHUD", () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
    (useJurisdiction as any).mockReturnValue({ state: "Nationwide" }); // default fallback
    
    // Mock clipboard and speech synthesis
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(true),
      },
    });

    Object.assign(window, {
      speechSynthesis: {
        speak: vi.fn(),
        cancel: vi.fn(),
      },
    });
  });

  it("renders the CrisisHUD component with default situations", () => {
    render(<CrisisHUD />);
    
    // The main title should be visible
    expect(screen.getByText("Civil Defense Command HUD")).toBeInTheDocument();
    
    // The situation buttons should be present (use getAllByText because it appears in button and active title)
    expect(screen.getAllByText("Pulled Over").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Police at Door").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Stopped on Street").length).toBeGreaterThan(0);
    
    // Default active situation "Pulled Over" script should be visible
    expect(screen.getByText(/Officer, I am keeping my hands on the wheel/i)).toBeInTheDocument();
  });

  it("switches situation correctly when a button is clicked", () => {
    render(<CrisisHUD />);
    
    // Click "Police at Door"
    const doorButton = screen.getAllByText("Police at Door")[0].closest("button");
    expect(doorButton).not.toBeNull();
    fireEvent.click(doorButton!);

    // Wait for the new script to appear
    expect(screen.getByText(/Officer, I will not open the door/i)).toBeInTheDocument();
    expect(screen.getByText(/Keep the door closed/i)).toBeInTheDocument(); // Checklist item
  });

  it("handles copy script action correctly", async () => {
    render(<CrisisHUD />);
    
    // Find the copy button
    const copyButton = screen.getByTitle("Copy Script");
    fireEvent.click(copyButton);
    
    // Verify clipboard was called
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    // Wait for async toast
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Script Copied"
      }));
    });
  });

  it("renders state specific threat index when a specific state is active", () => {
    (useJurisdiction as any).mockReturnValue({ state: "California" });
    render(<CrisisHUD />);
    
    // Should display California-specific recording info
    expect(screen.getByText("Two-party consent")).toBeInTheDocument();
    expect(screen.getByText("Strict two-party (all-party) consent for private recordings", { exact: false })).toBeInTheDocument();
  });

  it("falls back to federal baseline if state is not matched", () => {
    (useJurisdiction as any).mockReturnValue({ state: "Nationwide" });
    render(<CrisisHUD />);
    
    // Should display the federal fallback message
    expect(screen.getByText("Federal baseline active.")).toBeInTheDocument();
  });
});
