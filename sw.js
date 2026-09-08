/* =========================================================================
   sw.js — Caché offline-first del PWA ESPAC · Campo.
   Incrementar CACHE_VERSION cuando se publique una nueva versión para
   forzar la actualización del app shell en los dispositivos de campo.
   ========================================================================= */
const CACHE_VERSION = 'espac-campo-v9';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/db.js',
  './js/catalog.js',
  './js/geo.js',
  './js/camera.js',
  './js/sync.js',
  './js/app.js',
  './data/provincias.json',
  './data/cantones.json',
  './data/parroquias.json',
  './data/segmento_ma_2026.json',
  './data/cuestionario_ml_2026.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/logo-horizontal.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Cache-first para el app shell y catálogos; las peticiones POST (envío de
   datos al backend de Apps Script en sync.js) nunca pasan por aquí. */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return resp;
      }).catch(() => cached);
    })
  );
});
