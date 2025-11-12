import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SectionQuickNav } from "../SectionQuickNav";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "incident-guide", label: "Incident Guide" },
  { id: "resources", label: "Resources" }
];

const renderComponent = () =>
  render(
    <div>
      {sections.map((section) => (
        <section id={section.id} key={section.id}>
          Section {section.label}
        </section>
      ))}
      <SectionQuickNav sections={sections} />
    </div>
  );

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("SectionQuickNav", () => {
  it("renders quick navigation items", () => {
    renderComponent();

    expect(
      screen.getByRole("navigation", { name: /quick section navigation/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /incident guide/i })).toBeInTheDocument();
  });

  it("scrolls to the selected section", () => {
    const scrollSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderComponent();

    const target = document.getElementById("incident-guide");
    expect(target).not.toBeNull();
    if (target) {
      vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
        top: 400,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect);
    }

    fireEvent.click(screen.getByRole("button", { name: /incident guide/i }));

    expect(scrollSpy).toHaveBeenCalledWith({ top: expect.any(Number), behavior: "smooth" });
  });

  it("disables navigation buttons at the boundaries", () => {
    renderComponent();

    expect(screen.getByRole("button", { name: /scroll to previous section/i })).toBeDisabled();

    const target = document.getElementById("resources");
    expect(target).not.toBeNull();
    if (target) {
      vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
        top: 800,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({})
      } as DOMRect);
    }

    fireEvent.click(screen.getByRole("button", { name: /resources/i }));

    expect(screen.getByRole("button", { name: /scroll to next section/i })).toBeDisabled();
  });
});
