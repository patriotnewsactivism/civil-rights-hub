import { renderHook, act, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { vi } from "vitest";
import { JurisdictionProvider, useJurisdiction } from "./useJurisdiction";
import { DEFAULT_JURISDICTION, JURISDICTION_STORAGE_KEY } from "@/data/usStates";

describe("useJurisdiction", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <JurisdictionProvider>{children}</JurisdictionProvider>
  );

  it("returns the default jurisdiction when nothing is stored", () => {
    const { result } = renderHook(() => useJurisdiction(), { wrapper });
    expect(result.current.state).toBe(DEFAULT_JURISDICTION);
  });

  it("hydrates from localStorage and persists updates", async () => {
    window.localStorage.setItem(JURISDICTION_STORAGE_KEY, "Florida");
    const { result } = renderHook(() => useJurisdiction(), { wrapper });

    await waitFor(() => expect(result.current.state).toBe("Florida"));

    act(() => {
      result.current.setState("California");
    });

    expect(result.current.state).toBe("California");
    expect(window.localStorage.getItem(JURISDICTION_STORAGE_KEY)).toBe("California");
  });

  it("throws when used outside of provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useJurisdiction())).toThrow(
      "useJurisdiction must be used within a JurisdictionProvider"
    );
    consoleSpy.mockRestore();
  });
});
