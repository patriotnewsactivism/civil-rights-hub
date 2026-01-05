import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LawyerFinder } from "../LawyerFinder";
import type { AttorneyRecord } from "@/types/attorney";

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

const mockResponse: { data: AttorneyRecord[] | null; error: Error | null } = {
  data: [],
  error: null,
};

const fromSpy = vi.fn();

vi.mock("@/integrations/supabase/client", () => {
  const createQueryBuilder = () => {
    const promise = Promise.resolve({ ...mockResponse });
    const builder = {
      select: () => builder,
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

const buildAttorney = (overrides: Partial<AttorneyRecord> = {}): AttorneyRecord => ({
  id: "1",
  name: "Jane Doe",
  firm_name: "Doe & Partners",
  state: "Ohio",
  city: "Columbus",
  email: "jane@example.com",
  phone: "555-123-4567",
  website: "https://example.com",
  specialties: ["Civil Rights"],
  accepts_pro_bono: true,
  bar_number: "OH12345",
  years_experience: 10,
  bio: "Test attorney",
  ...overrides,
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockResponse.data = [];
  mockResponse.error = null;
});

describe("LawyerFinder", () => {
  it("renders live attorney results when Supabase returns records", async () => {
    mockResponse.data = [buildAttorney()];

    render(<LawyerFinder />);

    await waitFor(() =>
      expect(screen.queryByText(/Supabase offline — using verified directory/i)).not.toBeInTheDocument(),
    );

    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(fromSpy).toHaveBeenCalledWith("attorneys");
  });

  it("shows a sync notice when Supabase has no attorney records", async () => {
    mockResponse.data = [];

    render(<LawyerFinder />);

    await waitFor(() =>
      expect(
        screen.getByText(
          /Supabase is online but has no attorney records yet. Showing the verified national and state roster until the live directory syncs./i,
        ),
      ).toBeInTheDocument(),
    );
  });

  it("explains when Supabase cannot be reached and uses the fallback directory", async () => {
    mockResponse.data = null;
    mockResponse.error = new Error("Connection failed");

    render(<LawyerFinder />);

    await waitFor(() =>
      expect(
        screen.getByText(
          /Supabase is unreachable \(maintenance, network issue, or offline\). The verified national and state attorney roster is bundled locally so search stays available./i,
        ),
      ).toBeInTheDocument(),
    );
  });
});
