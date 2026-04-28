import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import { JurisdictionProvider, useJurisdiction } from "./useJurisdiction";

const Consumer = () => {
  const { state, setState } = useJurisdiction();

  return (
    <div>
      <span data-testid="current-state">{state ?? "none"}</span>
      <button type="button" onClick={() => setState("Texas")}>Select Texas</button>
      <button type="button" onClick={() => setState(null)}>Clear</button>
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

    expect(screen.getByTestId("current-state").textContent).toBe("none");

    await user.click(screen.getByText("Select Texas"));

    expect(screen.getByTestId("current-state").textContent).toBe("Texas");
    expect(window.localStorage.getItem("jurisdiction-state")).toBe("Texas");

    await user.click(screen.getByText("Clear"));

    expect(screen.getByTestId("current-state").textContent).toBe("none");
    expect(window.localStorage.getItem("jurisdiction-state")).toBeNull();
  });

  it("hydrates from previously stored state", () => {
    window.localStorage.setItem("jurisdiction-state", "Ohio");

    render(
      <JurisdictionProvider>
        <Consumer />
      </JurisdictionProvider>
    );

    expect(screen.getByTestId("current-state").textContent).toBe("Ohio");
  });
});
