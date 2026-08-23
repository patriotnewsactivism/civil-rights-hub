import { describe, expect, it } from "vitest";
import {
  CASHAPP_HANDLE,
  CASHAPP_URL,
  VENMO_HANDLE,
  VENMO_URL,
} from "./paymentLinks";

describe("verified payment destinations", () => {
  it("keeps the verified Cash App destination", () => {
    expect(CASHAPP_HANDLE).toBe("$1Aaudit");
    expect(CASHAPP_URL).toBe("https://cash.app/$1Aaudit");
    expect(CASHAPP_URL).not.toContain("$WeThePeopleNews");
  });

  it("keeps the verified Venmo destination", () => {
    expect(VENMO_HANDLE).toBe("@badactors");
    expect(VENMO_URL).toBe("https://venmo.com/badactors");
    expect(VENMO_URL).not.toContain("WeThePeopleNews");
  });
});
