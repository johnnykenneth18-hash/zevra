// ========================================
// ZEVRA INVESTMENTS - SIMPLE SERVICE WORKER
// ========================================

const CACHE_NAME = "zevra-cache-v4";
const CORE_FILES = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/login.html",
  "/register.html",
  "/manifest.json",
];

// Install event
self.addEventListener("install", (event) => {
  console.log("🟢 SW: Installing");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching core app files");
      return cache.addAll(CORE_FILES);
    }),
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("🟡 SW: Activating");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("🗑️ Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        return self.clients.claim();
      }),
  );
});

// Fetch event - ONLY cache local files
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // IMPORTANT: Skip ALL external requests
  if (!url.hostname.includes("zevrabank.vercel.app")) {
    return; // Let browser handle external resources
  }

  // Skip Service Worker itself and API calls
  if (
    url.pathname.includes("/service-worker.js") ||
    url.pathname.includes("/api/")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Only cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch((error) => {
          console.log("🌐 Network failed:", error);
          // Return offline page for HTML requests
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/index.html");
          }
          return new Response("ZEVRA - You are offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        });
    }),
  );
});
