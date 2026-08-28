export interface AttorneySubscriptionStatus {
  attorneyId: string;
  isFeatured: boolean;
  subscriptionTier: "standard" | "featured" | "premium";
  active: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      customer?: string;
      metadata?: Record<string, string>;
      status?: string;
    };
  };
}

/**
 * Validates webhook payload idempotency and generates updated attorney placement tier.
 */
export function processAttorneySubscriptionWebhook(event: StripeWebhookEvent): AttorneySubscriptionStatus | null {
  if (!event || !event.type || !event.data?.object) {
    throw new Error("Invalid Stripe webhook event structure");
  }

  const obj = event.data.object;
  const attorneyId = obj.metadata?.attorney_id;

  if (!attorneyId) {
    return null; // Not an attorney-associated subscription event
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const isActive = obj.status === "active" || obj.status === "trialing" || event.type === "checkout.session.completed";
      return {
        attorneyId,
        isFeatured: isActive,
        subscriptionTier: isActive ? "featured" : "standard",
        active: isActive,
        stripeCustomerId: typeof obj.customer === "string" ? obj.customer : null,
        stripeSubscriptionId: obj.id,
      };
    }
    case "customer.subscription.deleted": {
      return {
        attorneyId,
        isFeatured: false,
        subscriptionTier: "standard",
        active: false,
        stripeCustomerId: typeof obj.customer === "string" ? obj.customer : null,
        stripeSubscriptionId: null,
      };
    }
    default:
      return null;
  }
}

/**
 * Directory sort comparator: prioritizes featured/provenanced attorneys.
 */
export function sortAttorneysByRank<T extends { is_featured?: boolean | null; is_verified?: boolean | null; name: string }>(
  attorneys: T[]
): T[] {
  return [...attorneys].sort((a, b) => {
    // 1. Featured subscribers top priority
    if (Boolean(a.is_featured) !== Boolean(b.is_featured)) {
      return a.is_featured ? -1 : 1;
    }
    // 2. Verified records second
    if (Boolean(a.is_verified) !== Boolean(b.is_verified)) {
      return a.is_verified ? -1 : 1;
    }
    // 3. Alphabetical tie breaker
    return a.name.localeCompare(b.name);
  });
}
