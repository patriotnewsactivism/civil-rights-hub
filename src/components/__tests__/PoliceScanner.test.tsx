import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PoliceScanner } from "../PoliceScanner";
import type { ScannerLinkRecord } from "@/types/scanner";

vi.mock("@/hooks/useGeolocation", () => ({
  useGeolocation: () => ({
    state: null,
    city: null,
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  }),
}));

const mockResponse: { data: ScannerLinkRecord[] | null; error: Error | null } = {
  data: [],
  error: null,
};

const fromSpy = vi.fn();

vi.mock("@/integrations/supabase/client", () => {
  const createQueryBuilder = () => {
    const promise = Promise.resolve({ ...mockResponse });
    const builder = {
      select: () => builder,
      eq: () => builder,
      order: () => builder,
      then: promise.then.bind(promise),
      catch: promise.catch.bind(promise),
      finally: promise.finally.bind(promise),
    } as const;

    return builder;
  };

  return {
    supabase: {
      from: (...args: unknown[]) => {
        fromSpy(...args);
        return createQueryBuilder();
      },
    },
  };
});

const buildScanner = (overrides: Partial<ScannerLinkRecord> = {}): ScannerLinkRecord => ({
  id: "1",
  state: "Ohio",
  state_code: "OH",
  city: "Columbus",
  county: "Franklin",
  scanner_name: "Central Dispatch",
  description: "Test feed",
  frequency: "154.010 MHz",
  broadcastify_url: "https://broadcastify.test",
  scanner_radio_url: null,
  other_url: null,
  link_type: "broadcastify",
  listener_count: 12,
  is_active: true,
  notes: null,
  ...overrides,
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockResponse.data = [];
  mockResponse.error = null;
});

describe("PoliceScanner", () => {
  it("shows live scanner feeds when Supabase returns data", async () => {
    mockResponse.data = [buildScanner()];

    render(<PoliceScanner />);

    await waitFor(() => expect(screen.queryByText(/Loaded cached scanner feeds/i)).not.toBeInTheDocument());
    expect(screen.getByText(/Found 1 active feed/)).toBeInTheDocument();
    expect(fromSpy).toHaveBeenCalledWith("scanner_links");
  });

  it("explains when the Supabase table is empty but shows seed data", async () => {
    mockResponse.data = [];

    render(<PoliceScanner />);

    await waitFor(() =>
      expect(
        screen.getByText(
          /live Supabase database doesn't have scanner feeds yet. Showing bundled Broadcastify and OpenMHZ seed data/i,
        ),
      ).toBeInTheDocument(),
    );
  });

  it("shows an offline message when Supabase cannot be reached", async () => {
    mockResponse.data = null;
    mockResponse.error = new Error("Connection failed");

    render(<PoliceScanner />);

    await waitFor(() =>
      expect(
        screen.getByText(
          /couldn't reach Supabase right now. These Broadcastify and OpenMHZ feeds come from the bundled seed data/i,
        ),
      ).toBeInTheDocument(),
    );
  });
});
