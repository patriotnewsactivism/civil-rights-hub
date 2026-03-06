import { afterEach, describe, expect, it, vi } from "vitest";

import { buildSignupMetadata } from "@/lib/auth";

describe("buildSignupMetadata", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("uses display name when provided", () => {
    vi.stubGlobal("crypto", {
      randomUUID: () => "abcd1234-1234-5678-9abc-def012345678",
    });

    const metadata = buildSignupMetadata("Taylor+alerts@example.com", "Taylor Carter");

    expect(metadata).toEqual({
      username: "taylor_alerts_abcd1234",
      full_name: "Taylor Carter",
    });
  });

  it("falls back to email prefix for full_name and username", () => {
    vi.stubGlobal("crypto", {
      randomUUID: () => "zzzz9999-1234-5678-9abc-def012345678",
    });

    const metadata = buildSignupMetadata("Jordan@example.com");

    expect(metadata).toEqual({
      username: "jordan_zzzz9999",
      full_name: "Jordan",
    });
  });

  it("truncates long usernames to stay within max length", () => {
    vi.stubGlobal("crypto", {
      randomUUID: () => "12345678-1234-5678-9abc-def012345678",
    });

    const metadata = buildSignupMetadata("thisisaveryveryverylongusername@example.com");

    expect(metadata.username.length).toBeLessThanOrEqual(30);
    expect(metadata.username).toBe("thisisaveryveryverylo_12345678");
  });
});
