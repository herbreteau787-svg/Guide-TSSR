const CACHE = 'guide-tssr-v7';
const OFFLINE_URL = './index.html';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data.js',
  './manifest.json',
  './sw.js'
];

// Installation : stocke une version fraÃ®che du shell applicatif.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activation : toutes les anciennes versions de cache sont supprimÃ©es.
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

// RÃ©seau en prioritÃ©, cache en secours offline.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  // Ne pas intercepter les tÃ©lÃ©chargements lourds du PDF.
  if (url.pathname.endsWith('.pdf')) return;

  event.respondWith((async () => {
    try {
      // no-store force la rÃ©cupÃ©ration de la derniÃ¨re version dÃ©ployÃ©e.
      const networkResponse = await fetch(event.request, { cache: 'no-store' });
      if (networkResponse && networkResponse.ok) {
        const cache = await caches.open(CACHE);
        cache.put(event.request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cached = await caches.match(event.request);
      return cached || caches.match(OFFLINE_URL);
    }
  })());
});
