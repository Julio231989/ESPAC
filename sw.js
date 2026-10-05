/* =========================================================================
   sw.js — Caché offline-first del PWA ESPAC · Campo.
   Incrementar CACHE_VERSION cuando se publique una nueva versión para
   forzar la actualización del app shell en los dispositivos de campo.
   ========================================================================= */
const CACHE_VERSION = 'espac-campo-v18';
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

/* La instalación cachea cada archivo por separado (no con cache.addAll,
   que es atómico: si UN solo archivo fallara al descargarse — un hipo de
   red, un 404 pasajero — toda la instalación del Service Worker aborta
   en silencio y el dispositivo se queda SIN soporte offline, sin ningún
   aviso, hasta que alguna futura carga logre traer los 14 archivos a la
   vez). Aquí cada archivo se cachea de forma independiente: si uno falla,
   se registra en consola y el resto sigue cacheándose con normalidad. */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const results = await Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)));
      const failed = results
        .map((r, i) => (r.status === 'rejected' ? CORE_ASSETS[i] : null))
        .filter(Boolean);
      if (failed.length) console.warn('[ESPAC sw] no se pudieron precachear en la instalación:', failed);
      // NO se llama a self.skipWaiting() aquí a propósito: si la app sigue
      // abierta en el teléfono mientras se publica una versión nueva, este
      // Service Worker nuevo se queda "esperando" en vez de tomar control
      // de inmediato — así app.js puede avisarle al encuestador ("hay una
      // actualización") y dejar que decida el momento, en vez de que la
      // app se recargue sola a mitad de un formulario sin guardar. Si el
      // dispositivo cierra la app por completo y la reabre, esta espera no
      // aplica: al no haber ninguna pestaña controlada por la versión
      // vieja, la nueva se activa de inmediato, igual que antes.
    })
  );
});

/* Permite que app.js dispare la activación inmediata cuando el
   encuestador toca "Actualizar ahora" en el aviso de nueva versión. */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Cache-first para el app shell y catálogos; las peticiones POST (envío de
   datos al backend de Apps Script en sync.js) nunca pasan por aquí.
   CRÍTICO: event.respondWith() nunca debe recibir undefined — si eso pasa,
   Chrome muestra "No se puede acceder a este sitio" / ERR_FAILED, incluso
   con la app instalada y el Service Worker activo. Por eso, si no hay red
   NI copia en caché del recurso exacto pedido, respondemos con el app
   shell (para navegaciones, como abrir la app) o con una respuesta vacía
   válida (para todo lo demás) — nunca con undefined. */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return resp;
      }).catch(async () => {
        const acceptsHtml = (event.request.headers.get('accept') || '').includes('text/html');
        if (event.request.mode === 'navigate' || acceptsHtml) {
          const shell = (await caches.match('./index.html')) || (await caches.match('./'));
          if (shell) return shell;
        }
        return new Response('', { status: 503, statusText: 'Sin conexión y recurso no disponible en caché.' });
      });
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
