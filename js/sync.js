/* =========================================================================
   sync.js — Sincronización con el backend de Google Apps Script.
   Envío por POST con Content-Type: text/plain (evita el preflight CORS que
   Apps Script Web Apps no maneja) y JSON.stringify en el body. El backend
   responde {ok:true, record_id} o {ok:false, error}; solo entonces se marca
   el registro local como sincronizado — si no hay red o el backend falla,
   el registro queda pendiente y se reintenta en la próxima sincronización.
   ========================================================================= */
const SYNC_STORES = ['sedes', 'plan_diario', 'georef', 'cobertura_ma', 'cobertura_ml', 'tracking'];

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
