/* =========================================================================
   sync.js — Sincronización con el backend de Google Apps Script.
   Envío por POST con Content-Type: text/plain (evita el preflight CORS que
   Apps Script Web Apps no maneja) y JSON.stringify en el body. El backend
   responde {ok:true, record_id} o {ok:false, error}; solo entonces se marca
   el registro local como sincronizado — si no hay red o el backend falla,
   el registro queda pendiente y se reintenta en la próxima sincronización.
   ========================================================================= */
const SYNC_STORES = ['georef']; // única tabla de esta versión de propósito único

const Sync = {
  async getEndpoint() {
    return await cfgGet('endpoint_url', '');
  },
  async setEndpoint(url) {
    await cfgSet('endpoint_url', (url || '').trim());
  },
  async getDeviceId() {
    let id = await cfgGet('device_id', null);
    if (!id) {
      id = crypto.randomUUID();
      await cfgSet('device_id', id);
    }
    return id;
  },
  async getLastSyncAt() {
    return await cfgGet('last_sync_at', null);
  },

  async pushOne(store, record) {
    const url = await this.getEndpoint();
    if (!url) throw new Error('SIN_URL_CONFIGURADA');
    const deviceId = await this.getDeviceId();
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ store, record, device_id: deviceId }),
      });
    } catch (netErr) {
      // fetch solo lanza esto por: sin internet, URL mal escrita, o el navegador
      // bloqueó la petición (CORS/mixed-content). El backend nunca la recibió.
      throw new Error('RED: ' + (netErr && netErr.message ? netErr.message : netErr));
    }
    if (!res.ok) throw new Error('HTTP_' + res.status);
    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      // El backend respondió, pero no con el JSON esperado — normalmente pasa
      // cuando /exec todavía sirve una implementación vieja o pide iniciar sesión.
      throw new Error('RESPUESTA_NO_JSON');
    }
    if (!data.ok) throw new Error(data.error || 'ERROR_DESCONOCIDO');
    return data;
  },

  /* Sincroniza todos los registros pendientes de todas las tablas.
     onProgress(state) se llama tras cada intento para actualizar la UI. */
  async syncAll(onProgress) {
    const state = { sent: 0, failed: 0, total: 0, lastError: null };
    const pendingByStore = {};
    for (const st of SYNC_STORES) {
      const all = await dbAll(st);
      pendingByStore[st] = all.filter(r => !r._synced);
      state.total += pendingByStore[st].length;
    }
    if (onProgress) onProgress({ ...state });

    for (const st of SYNC_STORES) {
      for (const rec of pendingByStore[st]) {
        try {
          await this.pushOne(st, rec);
          await dbMarkSynced(st, rec.id);
          state.sent++;
        } catch (e) {
          state.failed++;
          state.lastError = e && e.message ? e.message : String(e);
          console.error('[ESPAC sync]', st, rec.id, state.lastError);
        }
        if (onProgress) onProgress({ ...state });
      }
    }
    if (state.sent > 0) await cfgSet('last_sync_at', new Date().toISOString());
    return state;
  },
};

/* =========================================================================
   AutoSync — sincronización automática en segundo plano, sin que el
   encuestador tenga que abrir la pantalla de sincronización ni presionar
   nada. Capas de respaldo (se complementan, no se excluyen):
     1) Intento inmediato tras guardar un registro (AutoSync.kick()),
        por si ya hay señal en ese instante.
     2) Evento 'online' del navegador — se dispara al recuperar conexión.
     3) 'visibilitychange' — al volver a primer plano la app (p. ej. tras
        salir de un predio y desbloquear el teléfono).
     4) Verificación periódica cada 45 s mientras la app está abierta,
        para redes intermitentes que no siempre disparan 'online'.
     5) Background Sync API (reg.sync), cuando el navegador la soporta
        (Chrome/Edge en Android): permite reintentar el envío aunque la
        pestaña esté cerrada o en segundo plano. iOS/Safari no la
        implementa — ahí rigen únicamente las capas 1-4, que solo actúan
        con la app abierta en algún momento.
   Nunca interrumpe al encuestador: no hay diálogos ni bloqueos; solo un
   toast breve cuando efectivamente se envía algo.
   ========================================================================= */
const AutoSync = {
  _running: false,
  _timer: null,

  init() {
    window.addEventListener('online', () => this.trigger('online'));
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this.trigger('visible');
    });
    if (!this._timer) this._timer = setInterval(() => this.trigger('watchdog'), 45000);
    this.trigger('arranque');
  },

  /* Llamar justo después de guardar cualquier registro localmente. */
  kick() {
    this._registerBackgroundSync();
    this.trigger('registro-nuevo');
  },

  async trigger(reason) {
    if (this._running || !navigator.onLine) return;
    const endpoint = await Sync.getEndpoint();
    if (!endpoint) return; // sin backend configurado aún: nada que enviar
    this._running = true;
    try {
      let pending = 0;
      for (const st of SYNC_STORES) pending += (await dbAll(st)).filter(r => !r._synced).length;
      if (pending === 0) return;
      const result = await Sync.syncAll();
      if (result.sent > 0) {
        toast(`${result.sent} registro(s) sincronizado(s) automáticamente.`, 'ok');
        if (typeof State !== 'undefined' && ['home', 'georef', 'sync'].includes(State.route)) render();
      }
    } catch (e) {
      console.warn('[ESPAC autosync]', reason, e && e.message ? e.message : e);
    } finally {
      this._running = false;
    }
  },

  _registerBackgroundSync() {
    if (!('serviceWorker' in navigator) || !('SyncManager' in window)) return;
    navigator.serviceWorker.ready.then(reg => {
      if (reg.sync) reg.sync.register('espac-sync').catch(() => {});
    }).catch(() => {});
  },
};
