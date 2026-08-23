export const CASHAPP_HANDLE = "$1Aaudit";
export const CASHAPP_URL = "https://cash.app/$1Aaudit";

export const VENMO_HANDLE = "@badactors";
export const VENMO_URL = "https://venmo.com/badactors";

export const STRIPE_DONATION_URL = import.meta.env.VITE_STRIPE_DONATION_URL as string | undefined;

export const PRIMARY_DONATION_URL = STRIPE_DONATION_URL ?? CASHAPP_URL;
export const PRIMARY_DONATION_LABEL = STRIPE_DONATION_URL ? "Stripe" : "CashApp";
