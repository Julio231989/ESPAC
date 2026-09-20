/* =========================================================================
   geo.js — Captura GPS
   1) capturePoint(): punto único, con objetivo de precisión ≤30 m (igual
      que la constraint sugerida en los XLSForm de sedes / georreferencia
      ML). En modo avión / sin datos, el GPS del teléfono sigue funcionando
      (usa solo satélites), pero un "cold start" sin asistencia de red
      (A-GPS) puede tardar bastante más que con conexión — por eso la
      ventana de espera es más larga y, si no se alcanza el umbral de 30 m
      a tiempo, igual se acepta la mejor lectura obtenida en vez de
      bloquear el registro (queda marcada como "fuera de objetivo" para
      que el encuestador decida si reintentar).
   2) trackPing(): muestreo continuo de 3 segundos para el track de
      supervisión mañana/tarde — se guarda la lectura de mejor precisión.
   ========================================================================= */
const Geo = {
  ACCURACY_THRESHOLD: 30, // metros — objetivo, no bloqueante
  CAPTURE_TIMEOUT_MS: 60000, // 60 s: cubre un "cold start" de GPS sin A-GPS (offline)

  capturePoint({ onUpdate } = {}) {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Este dispositivo no expone geolocalización.'));
        return;
      }
      let watchId = null;
      let best = null;
      const timeout = setTimeout(() => {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        if (best) {
          resolve({ ...best, precise: best.acc <= Geo.ACCURACY_THRESHOLD });
        } else {
          reject(new Error('No se obtuvo ninguna señal GPS en 60 s. Verifique que la ubicación esté activada y, si está sin conexión, aléjese de techos/paredes — el primer punto sin internet puede tardar más.'));
        }
      }, Geo.CAPTURE_TIMEOUT_MS);

      watchId = navigator.geolocation.watchPosition((pos) => {
        const reading = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          acc: pos.coords.accuracy,
          alt: pos.coords.altitude,
          ts: pos.timestamp
        };
        if (!best || reading.acc < best.acc) best = reading;
        if (onUpdate) onUpdate(reading, best);
        if (reading.acc <= Geo.ACCURACY_THRESHOLD) {
          clearTimeout(timeout);
          navigator.geolocation.clearWatch(watchId);
          resolve({ ...reading, precise: true });
        }
      }, (err) => {
        clearTimeout(timeout);
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        reject(err);
      }, { enableHighAccuracy: true, maximumAge: 0, timeout: Geo.CAPTURE_TIMEOUT_MS });
    });
  },

  /* Muestreo de 3 segundos para el track de supervisión (no exige el
     umbral de 30 m: es solo un punto de verificación de presencia). */
  trackPing({ durationMs = 3000, onTick } = {}) {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Este dispositivo no expone geolocalización.'));
        return;
      }
      let best = null;
      const startedAt = Date.now();
      const watchId = navigator.geolocation.watchPosition((pos) => {
        const reading = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          acc: pos.coords.accuracy,
          ts: pos.timestamp
        };
        if (!best || reading.acc < best.acc) best = reading;
        if (onTick) onTick(Math.min(1, (Date.now() - startedAt) / durationMs), reading);
      }, (err) => { /* seguimos esperando el timeout; puede recuperarse */ },
      { enableHighAccuracy: true, maximumAge: 0, timeout: durationMs + 2000 });

      setTimeout(() => {
        navigator.geolocation.clearWatch(watchId);
        if (best) resolve(best);
        else reject(new Error('No se pudo obtener el punto en 3 segundos.'));
      }, durationMs);
    });
  },

  mapsLink(lat, lng) {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
};
