// Civil Rights Hub — Service Worker
// Caches critical pages for offline access (rights cards, emergency contacts, attorney list)

const CACHE_NAME = "crh-v1";
const OFFLINE_URL = "/offline.html";

// Pages that MUST work offline — critical for people being detained
const PRECACHE_URLS = [
  "/",
  "/rights",
  "/do-this-now",
  "/attorneys",
  "/offline.html",
];

// Install: precache critical routes
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback
self.addEventListener("fetch", (event) => {
  // Only handle same-origin GET requests
  if (event.request.method !== "GET") return;

  // Skip Supabase API calls — these should never be cached
  const url = new URL(event.request.url);
  if (url.hostname.includes("supabase")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful HTML responses
        if (response.ok && event.request.headers.get("accept")?.includes("text/html")) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline — serve from cache or fallback page
        return caches.match(event.request).then(
          (cached) => cached || caches.match(OFFLINE_URL)
        );
      })
  );
});
