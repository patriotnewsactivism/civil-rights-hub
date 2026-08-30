import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LawyerFinder } from "../LawyerFinder";

describe("LawyerFinder", () => {
  it("renders the verified-data hold while the attorney directory is unverified", () => {
    render(<LawyerFinder />);

    expect(screen.getByText("Verified data rebuild in progress")).toBeInTheDocument();
    expect(
      screen.getByText(/temporarily withholding public datasets that cannot yet prove every published factual claim/i),
    ).toBeInTheDocument();
  });
});
