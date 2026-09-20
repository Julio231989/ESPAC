/* =========================================================================
   sw.js — Caché offline-first del PWA ESPAC · Campo.
   Incrementar CACHE_VERSION cuando se publique una nueva versión para
   forzar la actualización del app shell en los dispositivos de campo.
   ========================================================================= */
const CACHE_VERSION = 'espac-campo-v12';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/db.js',
  './js/catalog.js',
  './js/geo.js',
  './js/sync.js',
  './js/app.js',
  './data/provincias.json',
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

/* =========================================================================
   Background Sync — reintento de envío al backend aunque la app esté
   cerrada o en segundo plano (js/sync.js registra la etiqueta 'espac-sync'
   tras guardar cada registro y al recuperar señal). Solo lo soportan
   Chrome/Edge en Android; en navegadores sin SyncManager este bloque
   simplemente no se activa y el envío queda a cargo de app.js/sync.js
   mientras la pestaña esté abierta.
   Duplica aquí lo mínimo indispensable (abrir IndexedDB, leer pendientes,
   hacer POST, marcar sincronizado) porque el Service Worker corre en un
   contexto separado del de la página y no puede invocar sus funciones.
   ========================================================================= */
const DB_NAME = 'espac_campo_db';
const SYNC_STORES = ['georef']; // única tabla de esta versión de propósito único

function swOpenDB_() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function swDbAll_(db, store) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function swDbMarkSynced_(db, store, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const os = tx.objectStore(store);
    const getReq = os.get(id);
    getReq.onsuccess = () => {
      const rec = getReq.result;
      if (!rec) { resolve(); return; }
      rec._synced = true;
      rec._synced_at = new Date().toISOString();
      const putReq = os.put(rec);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}
function swCfgGet_(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('config', 'readonly');
    const req = tx.objectStore('config').get(key);
    req.onsuccess = () => resolve(req.result ? req.result.value : null);
    req.onerror = () => reject(req.error);
  });
}

async function backgroundSyncPending_() {
  const db = await swOpenDB_();
  const endpoint = await swCfgGet_(db, 'endpoint_url');
  if (!endpoint) return;
  let deviceId = await swCfgGet_(db, 'device_id');
  if (!deviceId) return; // se genera desde la página; si nunca abrió, no hay nada que enviar aún
  for (const store of SYNC_STORES) {
    const all = await swDbAll_(db, store);
    for (const record of all.filter(r => !r._synced)) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ store, record, device_id: deviceId }),
        });
        if (!res.ok) continue;
        const data = await res.json().catch(() => null);
        if (data && data.ok) await swDbMarkSynced_(db, store, record.id);
      } catch (e) {
        // sin red todavía o backend no disponible: se reintentará en el
        // próximo evento 'sync' o cuando la app vuelva a abrirse.
      }
    }
  }
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'espac-sync') event.waitUntil(backgroundSyncPending_());
});
