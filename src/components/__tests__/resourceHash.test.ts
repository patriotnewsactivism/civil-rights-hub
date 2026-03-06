import { describe, expect, it } from "vitest";

import { getResourceIdFromHash } from "@/components/resourceHash";

describe("getResourceIdFromHash", () => {
  it("returns null when the hash is empty", () => {
    expect(getResourceIdFromHash("")).toBeNull();
    expect(getResourceIdFromHash("#")).toBeNull();
  });

  it("maps FOIA hash aliases to the FOIA builder resource", () => {
    expect(getResourceIdFromHash("#foia")).toBe("foia-builder");
    expect(getResourceIdFromHash("#foia-builder")).toBe("foia-builder");
  });

  it("maps scanner and map hash aliases", () => {
    expect(getResourceIdFromHash("#scanner")).toBe("police-scanner");
    expect(getResourceIdFromHash("#map")).toBe("interactive-map");
  });

  it("normalizes hash casing and extra spaces", () => {
    expect(getResourceIdFromHash(" #FOIA-TRACKER ")).toBe("foia-tracker");
  });

  it("returns null for unsupported hashes", () => {
    expect(getResourceIdFromHash("#unknown-resource")).toBeNull();
  });
});
