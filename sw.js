// Your Wedding Planner — service worker for installability + offline shell
//
// Network-first strategy: while we're actively shipping changes, we always
// want the freshest version when online, falling back to cache only when
// offline. (A cache-first strategy silently freezes the app on old code
// until this file itself changes — bump CACHE_VERSION on every meaningful
// release so installed devices pick up the update.)
const CACHE_VERSION = 'v2';
const CACHE = 'ywp-cache-' + CACHE_VERSION;
const ASSETS = [
  'index.html',
  'css/styles.css',
  'js/app.js',
  'manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
