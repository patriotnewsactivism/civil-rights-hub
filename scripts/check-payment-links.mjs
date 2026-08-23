import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const srcRoot = join(root, "src");
const canonicalPath = join(srcRoot, "config", "paymentLinks.ts");
const canonical = readFileSync(canonicalPath, "utf8");

const required = [
  'export const CASHAPP_HANDLE = "$1Aaudit";',
  'export const CASHAPP_URL = "https://cash.app/$1Aaudit";',
];

for (const expected of required) {
  if (!canonical.includes(expected)) {
    throw new Error(`Canonical payment configuration is missing: ${expected}`);
  }
}

const forbidden = ["$WeThePeopleNews", "https://cash.app/$WeThePeopleNews"];
const hardcodedCashApp = [];
const staleCashApp = [];

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

    for (const value of forbidden) {
      if (text.includes(value)) staleCashApp.push(`${rel}: ${value}`);
    }

    if (fullPath !== canonicalPath && text.includes("https://cash.app/")) {
      hardcodedCashApp.push(rel);
    }
  }
}

walk(srcRoot);

if (staleCashApp.length || hardcodedCashApp.length) {
  const problems = [
    ...staleCashApp.map((item) => `stale Cash App identity: ${item}`),
    ...hardcodedCashApp.map((item) => `hardcoded Cash App URL outside canonical config: ${item}`),
  ];
  throw new Error(`Payment-link integrity check failed:\n${problems.join("\n")}`);
}

console.log("Payment-link integrity check passed: Cash App is canonically $1Aaudit.");
