const CACHE_NAME = "bus-tracker-v1";

const ASSETS = [
  "/bus-tracking/",
  "/bus-tracking/index.html",
  "/bus-tracking/create.html",
  "/bus-tracking/dashboard.html",
  "/bus-tracking/map.html",
  "/bus-tracking/style.css",
  "/bus-tracking/script.js",
  "/bus-tracking/logo.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
