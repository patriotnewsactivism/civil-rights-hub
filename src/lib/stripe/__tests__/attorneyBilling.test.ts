import { describe, it, expect } from "vitest";
import {
  processAttorneySubscriptionWebhook,
  sortAttorneysByRank,
  StripeWebhookEvent,
} from "../attorneyBilling";

describe("Attorney Stripe Billing & Placement Engine", () => {
  it("promotes attorney to featured upon subscription creation", () => {
    const event: StripeWebhookEvent = {
      id: "evt_1",
      type: "customer.subscription.created",
      data: {
        object: {
          id: "sub_123",
          customer: "cus_abc",
          status: "active",
          metadata: {
            attorney_id: "attorney-999",
          },
        },
      },
    };

    const result = processAttorneySubscriptionWebhook(event);
    expect(result).not.toBeNull();
    expect(result?.attorneyId).toBe("attorney-999");
    expect(result?.isFeatured).toBe(true);
    expect(result?.subscriptionTier).toBe("featured");
  });

  it("demotes attorney when subscription is cancelled or deleted", () => {
    const event: StripeWebhookEvent = {
      id: "evt_2",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_123",
          customer: "cus_abc",
          metadata: {
            attorney_id: "attorney-999",
          },
        },
      },
    };

    const result = processAttorneySubscriptionWebhook(event);
    expect(result).not.toBeNull();
    expect(result?.isFeatured).toBe(false);
    expect(result?.subscriptionTier).toBe("standard");
  });

  it("sorts featured attorneys ahead of unfeatured and verified ahead of unverified", () => {
    const attorneys = [
      { name: "Charlie Standard Unverified", is_featured: false, is_verified: false },
      { name: "Alice Featured", is_featured: true, is_verified: true },
      { name: "Bob Standard Verified", is_featured: false, is_verified: true },
    ];

    const sorted = sortAttorneysByRank(attorneys);
    expect(sorted[0].name).toBe("Alice Featured");
    expect(sorted[1].name).toBe("Bob Standard Verified");
    expect(sorted[2].name).toBe("Charlie Standard Unverified");
  });
});
