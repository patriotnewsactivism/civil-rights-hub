import { describe, expect, it } from "vitest";
import {
  CASHAPP_HANDLE,
  CASHAPP_URL,
  VENMO_HANDLE,
  VENMO_URL,
} from "./paymentLinks";

describe("verified payment destinations", () => {
  it("keeps the verified Cash App destination", () => {
    const url = new URL(CASHAPP_URL);
    expect(CASHAPP_HANDLE).toBe("$1Aaudit");
    expect(url.hostname).toBe("cash.app");
    expect(url.pathname).toBe("/$1Aaudit");
  });

  it("keeps the verified Venmo destination", () => {
    const url = new URL(VENMO_URL);
    expect(VENMO_HANDLE).toBe("@badactors");
    expect(url.hostname).toBe("venmo.com");
    expect(url.pathname).toBe("/badactors");
  });
});
