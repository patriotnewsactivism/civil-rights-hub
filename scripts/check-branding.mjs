import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const vendorToken = ["lo", "vable"].join("");
const requiredAssets = [
  "public/favicon.ico",
  "public/favicon.svg",
  "public/icon-32.png",
  "public/icon-180.png",
  "public/icon-192.png",
  "public/icon-512.png",
  "public/civil-rights-hub-social.png",
];

for (const asset of requiredAssets) {
  if (!existsSync(join(root, asset))) {
    throw new Error(`Brand integrity check failed: missing ${asset}`);
  }
}

const indexHtml = readFileSync(join(root, "index.html"), "utf8");
const seo = readFileSync(join(root, "src/components/SEO.tsx"), "utf8");
const socialPath = "https://civilrightshub.org/civil-rights-hub-social.png";

if (!indexHtml.includes(socialPath) || !seo.includes(socialPath)) {
  throw new Error("Brand integrity check failed: crawler and runtime metadata must use the canonical Civil Rights Hub social image.");
}

if (indexHtml.includes("/og-image.png") || indexHtml.includes("/twitter-image.png") || seo.includes("/og-image.png") || seo.includes("/twitter-image.png")) {
  throw new Error("Brand integrity check failed: removed placeholder social-image paths were reintroduced.");
}

const ignoredDirectories = new Set([".git", "node_modules", "dist", ".vercel"]);
const textExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".md", ".html", ".toml", ".yml", ".yaml", ".sql"]);
const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirectories.has(entry)) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!textExtensions.has(extname(entry).toLowerCase())) continue;

    const text = readFileSync(fullPath, "utf8").toLowerCase();
    if (text.includes(vendorToken)) {
      violations.push(relative(root, fullPath));
    }
  }
}

walk(root);

if (violations.length) {
  throw new Error(`Brand integrity check failed: removed builder/vendor branding remains in current-tree files:\n${violations.join("\n")}`);
}

console.log("Brand integrity check passed: Civil Rights Hub owns crawler metadata and current-tree branding.");
