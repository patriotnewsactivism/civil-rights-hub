import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative } from "node:path";

const root = process.cwd();
const srcRoot = join(root, "src");
const canonicalPath = join(srcRoot, "config", "paymentLinks.ts");
const canonical = readFileSync(canonicalPath, "utf8");

const required = [
  'export const CASHAPP_HANDLE = "$1Aaudit";',
  'export const CASHAPP_URL = "https://cash.app/$1Aaudit";',
  'export const VENMO_HANDLE = "@badactors";',
  'export const VENMO_URL = "https://venmo.com/badactors";',
];

for (const expected of required) {
  if (!canonical.includes(expected)) {
    throw new Error(`Canonical payment configuration is missing: ${expected}`);
  }
}

const forbiddenUrls = [
  "https://cash.app/$WeThePeopleNews",
  "https://venmo.com/WeThePeopleNews",
];
const hardcodedPaymentUrls = [];
const stalePaymentIdentities = [];

function isPaymentSurface(fullPath, text) {
  const file = basename(fullPath).toLowerCase();
  return /(donat|contribut|payment|support)/.test(file) || /cashapp|venmo|payment method|financial contribution/i.test(text);
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!/\.(ts|tsx|js|jsx|html)$/.test(entry)) continue;

    const text = readFileSync(fullPath, "utf8");
    const rel = relative(root, fullPath);

    for (const value of forbiddenUrls) {
      if (text.includes(value)) stalePaymentIdentities.push(`${rel}: ${value}`);
    }

    if (isPaymentSurface(fullPath, text) && text.includes("$WeThePeopleNews")) {
      stalePaymentIdentities.push(`${rel}: stale Cash App handle $WeThePeopleNews`);
    }

    if (isPaymentSurface(fullPath, text) && text.includes("@WeThePeopleNews")) {
      stalePaymentIdentities.push(`${rel}: stale Venmo handle @WeThePeopleNews`);
    }

    if (fullPath !== canonicalPath && (text.includes("https://cash.app/") || text.includes("https://venmo.com/"))) {
      hardcodedPaymentUrls.push(rel);
    }
  }
}

walk(srcRoot);

if (stalePaymentIdentities.length || hardcodedPaymentUrls.length) {
  const problems = [
    ...stalePaymentIdentities.map((item) => `stale payment identity: ${item}`),
    ...hardcodedPaymentUrls.map((item) => `hardcoded payment URL outside canonical config: ${item}`),
  ];
  throw new Error(`Payment-link integrity check failed:\n${problems.join("\n")}`);
}

console.log("Payment-link integrity check passed: Cash App is $1Aaudit and Venmo is @badactors.");
