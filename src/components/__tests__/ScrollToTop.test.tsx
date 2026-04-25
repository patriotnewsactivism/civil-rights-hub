import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { ScrollToTop } from "@/App";

describe("ScrollToTop", () => {
  const scrollToSpy = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

  beforeEach(() => {
    Object.defineProperty(window.history, "scrollRestoration", {
      configurable: true,
      writable: true,
      value: "auto"
    });

    scrollToSpy.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("scrolls to the top for routes without hashes", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ScrollToTop />
        <Routes>
          <Route path="*" element={<div>Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
    expect(window.history.scrollRestoration).toBe("manual");
  });

  it("does not override hash anchor navigation", () => {
    render(
      <MemoryRouter initialEntries={["/#rights"]}>
        <ScrollToTop />
        <Routes>
          <Route path="*" element={<div>Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(scrollToSpy).not.toHaveBeenCalled();
    expect(window.history.scrollRestoration).toBe("manual");
  });
});
