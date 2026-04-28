import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TaskNavigation } from "./TaskNavigation";

describe("TaskNavigation", () => {
  it("renders all task links with labels", () => {
    render(
      <MemoryRouter>
        <TaskNavigation />
      </MemoryRouter>
    );

    const links = [
      "Know Your Rights",
      "Do This Now",
      "Tools",
      "Learn",
      "Newsroom",
      "Get Help"
    ];

    links.forEach((label) => {
      expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: `Open ${label}` })).toBeInTheDocument();
    });
  });
});
