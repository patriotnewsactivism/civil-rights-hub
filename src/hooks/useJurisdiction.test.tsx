import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import { JurisdictionProvider, useJurisdiction } from "./useJurisdiction";
import { DEFAULT_JURISDICTION, JURISDICTION_STORAGE_KEY } from "@/data/usStates";

const Consumer = () => {
  const { state, setState } = useJurisdiction();

  return (
    <div>
      <span data-testid="current-state">{state}</span>
      <button type="button" onClick={() => setState("Texas")}>Select Texas</button>
      <button type="button" onClick={() => setState(DEFAULT_JURISDICTION)}>Clear</button>
    </div>
  );
};

describe("useJurisdiction", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores and retrieves the selected state", async () => {
    const user = userEvent.setup();
    render(
      <JurisdictionProvider>
        <Consumer />
      </JurisdictionProvider>
    );

    expect(screen.getByTestId("current-state").textContent).toBe(DEFAULT_JURISDICTION);

    await user.click(screen.getByText("Select Texas"));

    expect(screen.getByTestId("current-state").textContent).toBe("Texas");
    expect(window.localStorage.getItem(JURISDICTION_STORAGE_KEY)).toBe("Texas");

    await user.click(screen.getByText("Clear"));

    expect(screen.getByTestId("current-state").textContent).toBe(DEFAULT_JURISDICTION);
    expect(window.localStorage.getItem(JURISDICTION_STORAGE_KEY)).toBe(DEFAULT_JURISDICTION);
  });

  it("hydrates from previously stored state", () => {
    window.localStorage.setItem(JURISDICTION_STORAGE_KEY, "Ohio");

    render(
      <JurisdictionProvider>
        <Consumer />
      </JurisdictionProvider>
    );

    expect(screen.getByTestId("current-state").textContent).toBe("Ohio");
  });
});
