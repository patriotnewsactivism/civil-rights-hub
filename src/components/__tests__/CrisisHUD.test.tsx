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

const mockUseJurisdiction = vi.mocked(useJurisdiction);
const mockUseToast = vi.mocked(useToast);

describe("CrisisHUD", () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseToast.mockReturnValue({ toast: mockToast } as unknown as ReturnType<typeof useToast>);
    mockUseJurisdiction.mockReturnValue({
      state: "Nationwide", // default fallback
    } as ReturnType<typeof useJurisdiction>);

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
    expect(screen.getByText(/I will provide the driving documents required by law/i)).toBeInTheDocument();
  });

  it("switches situation correctly when a button is clicked", () => {
    render(<CrisisHUD />);

    // Click "Police at Door"
    const doorButton = screen.getAllByText("Police at Door")[0].closest("button");
    expect(doorButton).not.toBeNull();
    fireEvent.click(doorButton!);

    // Wait for the new script to appear
    expect(screen.getByText(/I do not consent to entry or a search/i)).toBeInTheDocument();
    expect(screen.getByText(/Ask whether officers have a warrant/i)).toBeInTheDocument(); // Checklist item
  });

  it("handles copy script action correctly", async () => {
    render(<CrisisHUD />);

    // Find the copy button
    const copyButton = screen.getByTitle("Copy wording");
    fireEvent.click(copyButton);

    // Verify clipboard was called
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    // Wait for async toast
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Copied"
      }));
    });
  });

  it("does not render per-state legal claims even when a specific state is active", () => {
    mockUseJurisdiction.mockReturnValue({ state: "California" } as ReturnType<typeof useJurisdiction>);
    render(<CrisisHUD />);

    // The jurisdiction badge reflects the active state...
    expect(screen.getByText("California")).toBeInTheDocument();

    // ...but per-state legal content stays disabled until it has verified source provenance.
    expect(screen.getByText("50-state risk scores are temporarily disabled.")).toBeInTheDocument();
    expect(screen.queryByText(/Two-party consent/i)).not.toBeInTheDocument();
  });

  it("shows the disabled risk-index notice for the nationwide default", () => {
    render(<CrisisHUD />);

    expect(screen.getByText("Nationwide")).toBeInTheDocument();
    expect(screen.getByText("50-state risk scores are temporarily disabled.")).toBeInTheDocument();
  });
});
