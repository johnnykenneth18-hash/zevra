// ========================================
// ZEVRA INVESTMENTS - SERVICE WORKER
// ========================================

const CACHE_NAME = "zevra-v1.0";
const CACHE_VERSION = "1.0.0";
const urlsToCache = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/login.html",
  "/register.html",
  "/admin.html",
  "/aboutUs.html",
  "/privacy-policy.html",
  "/terms-of-service.html",

  // CSS Files
  "/CSS/main.css",
  "/CSS/dashboard.css",
  "/CSS/login.css",
  "/CSS/admin.css",

  // JS Files
  "/JAVASCRIPT/main.js",
  "/JAVASCRIPT/dashboard.js",
  "/JAVASCRIPT/login.js",
  "/JAVASCRIPT/supabase-local.js",
  "/JAVASCRIPT/admin.js",

  // External Libraries (optional to cache)
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/dist/umd/supabase.min.js",

  // Icons
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",

  // Manifest
  "/manifest.json",
];

// Install Event
self.addEventListener("install", (event) => {
  console.log("🟢 Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Service Worker: Caching app shell");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("✅ Service Worker: Installation complete");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("❌ Service Worker: Installation failed", error);
      }),
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  console.log("🟡 Service Worker: Activating...");

  // Clean up old caches
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("🧹 Service Worker: Deleting old cache", cache);
              return caches.delete(cache);
            }
          }),
        );
      })
      .then(() => {
        console.log("✅ Service Worker: Activation complete");
        return self.clients.claim();
      }),
  );
});

// Fetch Event - Cache First Strategy
self.addEventListener("fetch", (event) => {
  // Skip Supabase requests
  if (event.request.url.includes("supabase.co")) {
    return;
  }

  // Skip external resources (except FontAwesome)
  if (
    event.request.url.includes("http") &&
    !event.request.url.includes(self.location.origin) &&
    !event.request.url.includes("cdnjs.cloudflare.com")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("📁 Serving from cache:", event.request.url);
        return cachedResponse;
      }

      // Clone the request
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Add to cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.log("❌ Fetch failed, returning offline page:", error);

          // If HTML page request, return cached version
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/index.html");
          }

          // Return offline fallback for other requests
          return new Response("Network error. You are offline.", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          });
        });
    }),
  );
});

// Background Sync for offline deposits/withdrawals
self.addEventListener("sync", (event) => {
  console.log("🔄 Background Sync:", event.tag);

  if (event.tag === "sync-deposits") {
    event.waitUntil(syncDeposits());
  }

  if (event.tag === "sync-withdrawals") {
    event.waitUntil(syncWithdrawals());
  }
});

// Push Notifications
self.addEventListener("push", (event) => {
  console.log("📱 Push Notification received");

  const data = event.data ? event.data.json() : {};
  const title = data.title || "ZEVRA Investments";
  const options = {
    body: data.body || "New update from ZEVRA Investments",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/",
    },
    actions: [
      {
        action: "open",
        title: "Open App",
      },
      {
        action: "close",
        title: "Close",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Handler
self.addEventListener("notificationclick", (event) => {
  console.log("🖱️ Notification clicked:", event.action);

  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const url = event.notification.data.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});

// Background Sync Functions
async function syncDeposits() {
  try {
    // Get pending deposits from IndexedDB
    const pendingDeposits = await getPendingDeposits();

    for (const deposit of pendingDeposits) {
      // Try to sync with server
      const success = await syncDepositToServer(deposit);

      if (success) {
        // Remove from pending
        await removePendingDeposit(deposit.id);
      }
    }
  } catch (error) {
    console.error("Background sync error:", error);
  }
}

async function syncWithdrawals() {
  try {
    // Get pending withdrawals from IndexedDB
    const pendingWithdrawals = await getPendingWithdrawals();

    for (const withdrawal of pendingWithdrawals) {
      // Try to sync with server
      const success = await syncWithdrawalToServer(withdrawal);

      if (success) {
        // Remove from pending
        await removePendingWithdrawal(withdrawal.id);
      }
    }
  } catch (error) {
    console.error("Background sync error:", error);
  }
}

// Helper functions for IndexedDB
async function getPendingDeposits() {
  // This would use IndexedDB to get pending deposits
  return [];
}

async function syncDepositToServer(deposit) {
  // This would sync the deposit with Supabase
  return true;
}

async function removePendingDeposit(id) {
  // Remove from IndexedDB
}

async function getPendingWithdrawals() {
  // This would use IndexedDB to get pending withdrawals
  return [];
}

async function syncWithdrawalToServer(withdrawal) {
  // This would sync the withdrawal with Supabase
  return true;
}

async function removePendingWithdrawal(id) {
  // Remove from IndexedDB
}

// Periodic sync for background updates
if ("periodicSync" in self.registration) {
  self.addEventListener("periodicsync", (event) => {
    if (event.tag === "update-investments") {
      console.log("⏰ Periodic sync for investments");
      event.waitUntil(updateInvestmentData());
    }
  });
}

async function updateInvestmentData() {
  // Update investment data in background
  console.log("Updating investment data in background");
}
