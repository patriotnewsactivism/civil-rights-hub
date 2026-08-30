import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PoliceScanner } from "../PoliceScanner";

describe("PoliceScanner", () => {
  it("renders the scanner verification hold with links to provider directories", () => {
    render(<PoliceScanner />);

    expect(screen.getByText("Public-Safety Audio Resources")).toBeInTheDocument();
    expect(screen.getByText("Scanner directory verification in progress")).toBeInTheDocument();
    expect(
      screen.getByText(/unsourced listener counts, frequencies, descriptions/i),
    ).toBeInTheDocument();

    expect(screen.getByText("Broadcastify Audio Feeds")).toBeInTheDocument();
    expect(screen.getByText("OpenMHz")).toBeInTheDocument();

    const links = screen.getAllByRole("link", { name: /Open provider directory/i });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "https://www.broadcastify.com/listen/");
    expect(links[1]).toHaveAttribute("href", "https://openmhz.com/");
  });
});
