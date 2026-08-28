/**
 * Edge Caching & SEO Prerendering Headers Configuration
 * Bounded invalidation controls to ensure fresh civil rights data.
 */

export const EDGE_CACHE_PROFILES = {
  // 50 State Jurisdiction guides - cached at CDN edge with SWR
  stateGuides: {
    "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    "CDN-Cache-Control": "max-age=86400",
    "Vary": "Accept-Encoding, X-Jurisdiction",
  },
  // Emergency Encounter & Crisis HUD - never cache dynamically mutable emergency signals
  crisisHud: {
    "Cache-Control": "public, no-cache, no-store, must-revalidate",
    "CDN-Cache-Control": "no-store",
  },
  // Verified Public Directory (Attorneys / Scanners)
  directory: {
    "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=3600",
    "CDN-Cache-Control": "max-age=1800",
    "Vary": "Accept-Encoding",
  },
} as const;

export function getCacheHeadersForRoute(pathname: string): Record<string, string> {
  if (pathname.startsWith("/jurisdiction/") || pathname.startsWith("/states/")) {
    return EDGE_CACHE_PROFILES.stateGuides;
  }
  if (pathname.startsWith("/hud") || pathname.startsWith("/crisis")) {
    return EDGE_CACHE_PROFILES.crisisHud;
  }
  if (pathname.startsWith("/lawyers") || pathname.startsWith("/attorneys")) {
    return EDGE_CACHE_PROFILES.directory;
  }
  return { "Cache-Control": "public, max-age=600, s-maxage=3600" };
}
