const CACHE_NAME = "task-app-v1";
const API_CACHE = "api-cache-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const { request } = event;

  // ✅ Handle API request specifically
  if (
    request.url === "http://localhost:9999/taskListSummary"
  ) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          return caches.open(API_CACHE).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // ✅ Default handling for everything else
  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request);
    })
  );
});