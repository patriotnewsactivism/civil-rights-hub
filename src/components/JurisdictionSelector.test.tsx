import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { type ReactNode } from "react";
import { JurisdictionSelector } from "./JurisdictionSelector";
import { JurisdictionProvider, useJurisdiction } from "@/hooks/useJurisdiction";

type WrapperProps = {
  children: ReactNode;
};

const SelectedState = () => {
  const { state } = useJurisdiction();
  return <p data-testid="selected-state">{state ?? "none"}</p>;
};

const Wrapper = ({ children }: WrapperProps) => (
  <JurisdictionProvider>
    {children}
    <SelectedState />
  </JurisdictionProvider>
);

describe("JurisdictionSelector", () => {
  beforeAll(() => {
    if (!Element.prototype.hasPointerCapture) {
      Element.prototype.hasPointerCapture = () => false;
    }

    if (!Element.prototype.releasePointerCapture) {
      Element.prototype.releasePointerCapture = () => {};
    }

    if (!Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = () => {};
    }
  });

  it("allows manual state selection", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(
      <Wrapper>
        <JurisdictionSelector detectedState={null} />
      </Wrapper>
    );

    expect(screen.getByTestId("selected-state").textContent).toBe("none");

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("California"));

    expect(screen.getByTestId("selected-state").textContent).toBe("California");
  });

  it("applies the detected state when requested", async () => {
    const user = userEvent.setup();
    render(
      <Wrapper>
        <JurisdictionSelector detectedState="Virginia" />
      </Wrapper>
    );

    await user.click(screen.getByRole("button", { name: /Use Virginia/i }));

    expect(screen.getByTestId("selected-state").textContent).toBe("Virginia");
  });
});
