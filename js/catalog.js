/* =========================================================================
   catalog.js — Catálogos ESPAC 2026 (provincias, cantones, marco de áreas
   y marco de lista). Marco de muestra actualizado desde muestra2026_F.xlsx
   (reemplaza el marco de ejemplo 2025 usado en las primeras versiones).
   Se cargan una sola vez y quedan cacheados por el service worker.
   ========================================================================= */
const Catalog = {
  provincias: [],
  cantones: [],
  parroquias: [],
  segmento_ma: [],
  cuestionario_ml: [],
  // NOTA DE CONSISTENCIA (revisar antes de publicar en KoboToolbox):
  // - Kobo_sedes.xlsx → choices "cargo" trae solo: supervisor, revisor_digitador, encuestador_ml.
  //   "encuestador_areas" se añade aquí porque el requerimiento pide sedes habilitado para
  //   los 4 perfiles; hay que agregar esa choice en el XLSForm real antes de publicar la versión final en Kobo.
  // - Kobo_cobertura_ma_ml.xlsx → choices "cargo" trae solo: supervisor, enc_ml (sin revisor ni áreas),
  //   coherente con que cobertura solo la diligencian supervisor y encuestador ML.
  cargo: [
    { c: 'supervisor',        n: 'Supervisor' },
    { c: 'revisor_digitador', n: 'Revisor - Digitador' },
    { c: 'encuestador_ml',    n: 'Encuestador de Lista' },
    { c: 'encuestador_areas', n: 'Encuestador de Áreas' }
  ],
  jornada: [
    { c: '1', n: 'Jornada 1' }, { c: '2', n: 'Jornada 2' }, { c: '3', n: 'Jornada 3' },
    { c: '4', n: 'Jornada 4' }, { c: '5', n: 'Jornada 5' }
  ],
  // Zonas para el ID de personal (AÑO+ZONA+PERFIL+NÚMERO). Códigos fijados
  // por instrucción interna: no modificar sin coordinar con los responsables zonales.
  zonas: [
    { c: 'ACC', n: 'AC Campo' },
    { c: 'LIT', n: 'Litoral' },
    { c: 'CEN', n: 'Centro' },
    { c: 'SUR', n: 'Sur' }
  ],
  estado_lev: [
    { c: 'cerrado_completamente', n: 'Cerrado completamente' },
    { c: 'en_ejecucion', n: 'En ejecución (levantamiento de encuestas)' }
  ],
  estado_dig: [
    { c: 'proceso', n: 'En proceso' },
    { c: 'no_entregado', n: 'SM no entregado' },
    { c: 'terminado', n: 'Terminado' }
  ],
  estado_lev_ml: [
    { c: 'info_completa_cerrado', n: 'Información Completa', efectiva: true },
    { c: 'no_ubi', n: 'No ubicados', efectiva: false },
    { c: 'rechazo', n: 'Rechazo', efectiva: false },
    { c: 'repetida', n: 'Repetida', efectiva: false }
  ],
  estado_dig_ml: [
    { c: 'proceso_ml', n: 'En proceso' },
    { c: 'no_entregado_ml', n: 'Cuestionario ML no entregado' },
    { c: 'terminado_ml', n: 'Terminado' }
  ],

  async load() {
    const [prov, cant, parr, segMa, cuestMl] = await Promise.all([
      fetch('data/provincias.json').then(r => r.json()),
      fetch('data/cantones.json').then(r => r.json()),
      fetch('data/parroquias.json').then(r => r.json()),
      fetch('data/segmento_ma_2026.json').then(r => r.json()),
      fetch('data/cuestionario_ml_2026.json').then(r => r.json()),
    ]);
    this.provincias = prov;
    this.cantones = cant;
    this.parroquias = parr;
    this.segmento_ma = segMa;
    this.cuestionario_ml = cuestMl;
  },

  cantonesByProvincia(provCode) {
    if (!provCode) return [];
    return this.cantones.filter(x => x.p === provCode);
  },
  parroquiasByCanton(cantonCode) {
    if (!cantonCode) return [];
    return this.parroquias.filter(x => x.ct === cantonCode);
  },
  segmentoMaByProvincia(provCode) {
    if (!provCode) return this.segmento_ma;
    return this.segmento_ma.filter(x => x.p === provCode);
  },
  cuestionarioMlByProvincia(provCode) {
    if (!provCode) return this.cuestionario_ml;
    return this.cuestionario_ml.filter(x => x.p === provCode);
  },
  labelCargo(code) { return (this.cargo.find(c => c.c === code) || {}).n || code; },
  labelFromList(list, code) { const f = (this[list] || []).find(c => c.c === code); return f ? f.n : code; }
};

/* ---- búsqueda por prefijo/substring, limitada para rendimiento ---- */
function searchCodes(list, query, limit = 40) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return list.slice(0, limit);
  const starts = [];
  const contains = [];
  for (const item of list) {
    const code = String(item.c).toLowerCase();
    const label = String(item.n || '').toLowerCase();
    if (code.startsWith(q) || label.startsWith(q)) starts.push(item);
    else if (code.includes(q) || label.includes(q)) contains.push(item);
    if (starts.length >= limit) break;
  }
  return starts.concat(contains).slice(0, limit);
}
