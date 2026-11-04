// TPDF Service Worker for Offline Resilience and PWA Compliance
const CACHE_NAME = "tpdf-cache-v3";
const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/icons/tpdf-favicon-64.png",
  "/icons/tpdf-icon-192.png",
  "/icons/tpdf-icon-512.png",
  "/icons/tpdf-icon.svg",
  "/ScreenShot/S1.png",
  "/ScreenShot/S2.png",
  "/ScreenShot/S3.png",
  "/pdf.worker.min.mjs",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Continue even if partial
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          if (
            event.request.mode === "navigate" ||
            event.request.headers.get("accept")?.includes("text/html")
          ) {
            return caches.match("/");
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
