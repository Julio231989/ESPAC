/* =========================================================================
   catalog.js — Catálogos ESPAC 2026 · Georreferencia ML
   Solo lo que necesita esta versión de propósito único: provincias (para
   el formulario), zonas (para el ID de personal) y el marco de lista
   precargado (para validar en el dispositivo el número de cuestionario
   de 4 dígitos digitado por el encuestador). Los catálogos de cantones,
   parroquias, segmento MA, cargos, jornadas y estados de cobertura se
   retiraron junto con los módulos que los usaban (Sedes, Plan, Cobertura).
   Marco de muestra actualizado desde muestra2026_F.xlsx.
   ========================================================================= */
const Catalog = {
  provincias: [],
  cuestionario_ml: [],

  // Zonas para el ID de personal (AÑO+ZONA+PERFIL+NÚMERO). Códigos fijados
  // por instrucción interna: no modificar sin coordinar con los responsables zonales.
  zonas: [
    { c: 'ACC', n: 'AC Campo' },
    { c: 'LIT', n: 'Litoral' },
    { c: 'CEN', n: 'Centro' },
    { c: 'SUR', n: 'Sur' }
  ],

  async load() {
    const [prov, cuestMl] = await Promise.all([
      fetch('data/provincias.json').then(r => r.json()),
      fetch('data/cuestionario_ml_2026.json').then(r => r.json()),
    ]);
    this.provincias = prov;
    this.cuestionario_ml = cuestMl;
  },
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
