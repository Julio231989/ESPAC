/* =========================================================================
   db.js — Persistencia local offline-first (IndexedDB)
   Stores: sedes, georef, cobertura_ma, cobertura_ml, tracking, plan_diario, config
   Cada registro guarda _synced:false hasta que exista integración real
   con Google Sheets / Apps Script (fase siguiente del proyecto).
   ========================================================================= */
const DB_NAME = 'espac_campo_db';
const DB_VERSION = 2;
const STORES = ['sedes', 'georef', 'cobertura_ma', 'cobertura_ml', 'tracking', 'plan_diario', 'config'];

let _dbPromise = null;

function openDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      STORES.forEach(name => {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: 'id', autoIncrement: true });
          if (name !== 'config') {
            store.createIndex('by_synced', '_synced');
            store.createIndex('by_fecha', '_fecha');
          }
        }
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _dbPromise;
}

async function dbAdd(store, record) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbPut(store, record) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).put(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbAll(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbCount(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbCountPending(store) {
  const all = await dbAll(store);
  return all.filter(r => r._synced === false).length;
}

async function dbClearStore(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const req = tx.objectStore(store).clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/* Marca un registro como sincronizado tras una respuesta {ok:true} del backend. */
async function dbMarkSynced(store, id) {
  const db = await openDB();
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

/* --- config key/value simple (perfil activo, contadores de track diario, etc.) --- */
async function cfgGet(key, fallback = null) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('config', 'readonly');
    const req = tx.objectStore('config').get(key);
    req.onsuccess = () => resolve(req.result ? req.result.value : fallback);
    req.onerror = () => reject(req.error);
  });
}
async function cfgSet(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('config', 'readwrite');
    const req = tx.objectStore('config').put({ id: key, value });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
