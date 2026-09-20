/* =========================================================================
   app.js — ESPAC 2026 · Campo · Georreferencia ML
   SPA vanilla sin frameworks (para minimizar dependencias offline).
   App de propósito único: captura offline de la coordenada de cada
   cuestionario del marco de lista por parte del encuestador ML, con
   sincronización automática hacia Google Sheets/Apps Script. No incluye
   otros perfiles ni otros módulos (Sedes, Plan, Cobertura, Track): esas
   pantallas se retiraron a propósito de esta versión.
   ========================================================================= */

/* ---------------------------------------------------------------- iconos */
const Icon = {
  gear:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.33-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/></svg>`,
  gps:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  back:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>`,
};

/* --------------------------------------------------------------- estado */
const State = {
  profile: null,
  route: 'georef',
  params: {},
};

const ESPAC_YEAR_CODE = '26'; // Año 2026 — actualizar si el operativo continúa en años siguientes

/* Único perfil que usa esta versión de la app. idCode: prefijo del ID de
   personal (AÑO+ZONA+PERFIL+NÚMERO), igual que en el resto del operativo. */
const ROLE_ML = { code: 'encuestador_ml', label: 'Encuestador de Lista', idCode: 'EL' };

/* ----------------------------------------------------------- utilidades */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function fmtDateLong() {
  const d = new Date();
  return d.toLocaleDateString('es-EC', { weekday: 'long', day: '2-digit', month: 'long' });
}

function toast(msg, type = '') {
  const host = $('#toast-host');
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 320); }, 2600);
}

/* ------------------------------------------------------- combobox util */
function comboHTML(id, placeholder) {
  return `<div class="combo" id="${id}">
    <input type="text" class="combo-input" placeholder="${placeholder}" autocomplete="off" inputmode="search">
    <div class="combo-list"></div>
  </div>`;
}

function mountCombo(containerId, { list, limit = 40, onSelect, initialCode = null, initialLabel = '' }) {
  const root = document.getElementById(containerId);
  const input = $('.combo-input', root);
  const listEl = $('.combo-list', root);
  root.dataset.code = initialCode || '';
  if (initialLabel) input.value = initialLabel;

  function renderList(items) {
    if (!items.length) {
      listEl.innerHTML = `<div class="combo-empty">Sin coincidencias. Verifique el código o consulte al supervisor.</div>`;
    } else {
      listEl.innerHTML = items.map(it =>
        `<div class="combo-opt" data-code="${it.c}" data-label="${(it.n || it.c)}">${it.n ? `${it.c} — ${it.n}` : it.c}</div>`
      ).join('');
    }
    listEl.classList.add('open');
  }

  input.addEventListener('focus', () => renderList(searchCodes(list(), input.value, limit)));
  input.addEventListener('input', () => {
    root.dataset.code = '';
    renderList(searchCodes(list(), input.value, limit));
  });
  input.addEventListener('blur', () => setTimeout(() => listEl.classList.remove('open'), 150));
  listEl.addEventListener('mousedown', (e) => e.preventDefault());
  listEl.addEventListener('click', (e) => {
    const opt = e.target.closest('.combo-opt');
    if (!opt) return;
    const code = opt.dataset.code, label = opt.dataset.label;
    root.dataset.code = code;
    input.value = label && label !== code ? `${code} — ${label}` : code;
    listEl.classList.remove('open');
    if (onSelect) onSelect(code, label);
  });

  return {
    refresh: () => { root.dataset.code = ''; input.value = ''; },
    getCode: () => root.dataset.code || '',
  };
}

function bindChipGroup(container, { single = true } = {}) {
  const chips = $$('.choice-chip', container);
  chips.forEach(c => c.addEventListener('click', () => {
    if (single) chips.forEach(x => x.classList.remove('sel'));
    c.classList.toggle('sel', single ? true : !c.classList.contains('sel'));
  }));
  return { getSelected: () => chips.filter(c => c.classList.contains('sel')).map(c => c.dataset.code) };
}

function requireField(sel, valid, msg) {
  const el = $(sel);
  if (!el) return valid;
  el.classList.toggle('invalid', !valid);
  const err = $('.err', el);
  if (err && msg) err.textContent = msg;
  return valid;
}

function gpsBoxHTML(prefix) {
  return `
  <div class="gps-box" id="gps-${prefix}">
    <button class="btn btn-field" id="gps-btn-${prefix}" type="button">${Icon.gps} Capturar ubicación GPS</button>
    <div class="gps-status" id="gps-status-${prefix}">Esperando captura…</div>
  </div>`;
}

function bindGpsBox(prefix) {
  const btn = $(`#gps-btn-${prefix}`);
  const status = $(`#gps-status-${prefix}`);
  let point = null;
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    status.className = 'gps-status';
    status.textContent = 'Obteniendo señal GPS de alta precisión…';
    try {
      const p = await Geo.capturePoint({
        onUpdate: (reading) => { status.textContent = `Precisión actual: ${Math.round(reading.acc)} m (objetivo ≤ 30 m) — puede tardar más sin conexión`; }
      });
      point = p;
      if (p.precise) {
        status.className = 'gps-status good';
        status.innerHTML = `✓ Punto capturado — precisión ${Math.round(p.acc)} m<br>${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`;
      } else {
        status.className = 'gps-status bad';
        status.innerHTML = `⚠ Punto capturado fuera del objetivo — precisión ${Math.round(p.acc)} m<br>${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}<br>Puede guardarlo así o volver a capturar en espacio más abierto.`;
      }
      btn.textContent = 'Volver a capturar';
    } catch (e) {
      status.className = 'gps-status bad';
      status.textContent = e.message || 'No se pudo obtener el punto GPS.';
    } finally {
      btn.disabled = false;
    }
  });
  return { getPoint: () => point };
}

/* --------------------------------------------------------------- perfil */
async function loadProfile() {
  State.profile = await cfgGet('perfil', null);
}
async function saveProfile(p) {
  State.profile = p;
  await cfgSet('perfil', p);
}

/* =========================================================================
   PANTALLA: Datos del encuestador (una sola vez por dispositivo)
   ========================================================================= */
function screenProfileHTML(editing) {
  const p = State.profile || {};
  return `
  <div class="center-screen surco-bg">
    <div class="logo-wrap">
      <img class="logo-full" src="icons/logo-horizontal.png" alt="ESPAC">
      <div class="eyebrow">Georreferencia ML · Encuestador de Lista · 2026</div>
      <h1 class="title-hero">Sus datos</h1>
      <p class="sub-hero">Se registran una sola vez en este dispositivo y se usan en cada cuestionario que capture.</p>
    </div>

    <div class="card">
      <div class="field" id="f-pf-nombre">
        <label>Nombre y apellido <span class="req">*</span></label>
        <input type="text" id="pf-nombre" value="${p.nombre || ''}" placeholder="Ej. Julio Márquez">
        <div class="err">Campo obligatorio.</div>
      </div>
      <div class="field" id="f-pf-zona">
        <label>Zonal <span class="req">*</span></label>
        <div class="choice-grid" id="pf-zona-chips">
          ${Catalog.zonas.map(z => `<div class="choice-chip ${p.zona === z.c ? 'sel' : ''}" data-code="${z.c}">${z.n}</div>`).join('')}
        </div>
        <div class="err">Seleccione su zona.</div>
      </div>
      <div class="field" id="f-pf-num">
        <label>Número de personal <span class="req">*</span></label>
        <input type="text" id="pf-num" inputmode="numeric" maxlength="2" value="${p.num_personal || ''}" placeholder="01–99, asignado por su responsable zonal">
        <div class="err">Ingrese un número de 01 a 99.</div>
      </div>
      <div class="field">
        <label>ID de personal (se arma solo)</label>
        <input type="text" id="pf-id-preview" readonly style="font-family:var(--font-mono); letter-spacing:.06em;" value="${p.id_personal || '— · —'}">
        <p class="hint">No se registra cédula: este código identifica al personal en la hoja de cálculo.</p>
      </div>
    </div>

    <button class="btn btn-primary" id="pf-continue">Continuar ${Icon.arrow}</button>
    ${editing ? `<button class="btn btn-ghost" id="pf-cancel" style="margin-top:10px;">Cancelar</button>` : ''}
  </div>`;
}

function bindProfileScreen(editing) {
  const zonaGroup = bindChipGroup($('#pf-zona-chips'));
  $$('#pf-zona-chips .choice-chip').forEach(c => c.addEventListener('click', updatePreview));
  $('#pf-num').addEventListener('input', updatePreview);

  function updatePreview() {
    const zona = zonaGroup.getSelected()[0];
    const num = $('#pf-num').value.trim();
    const preview = $('#pf-id-preview');
    if (zona && /^[0-9]{1,2}$/.test(num)) {
      preview.value = ESPAC_YEAR_CODE + zona + ROLE_ML.idCode + num.padStart(2, '0');
    } else {
      preview.value = '— · —';
    }
  }

  $('#pf-continue').addEventListener('click', async () => {
    const nombre = $('#pf-nombre').value.trim();
    const zona = zonaGroup.getSelected()[0];
    const numRaw = $('#pf-num').value.trim();
    const num = numRaw.padStart(2, '0');

    let ok = true;
    ok = requireField('#f-pf-nombre', !!nombre, 'Campo obligatorio.') && ok;
    ok = requireField('#f-pf-zona', !!zona, 'Seleccione su zona.') && ok;
    ok = requireField('#f-pf-num', /^[0-9]{1,2}$/.test(numRaw) && Number(num) >= 1, 'Ingrese un número de 01 a 99.') && ok;
    if (!ok) { toast('Revise los campos marcados en rojo.', 'err'); return; }

    const idPersonal = ESPAC_YEAR_CODE + zona + ROLE_ML.idCode + num;
    await saveProfile({ role: 'ml', nombre, zona, num_personal: num, id_personal: idPersonal });
    navigate('georef');
  });
  if (editing) $('#pf-cancel')?.addEventListener('click', () => navigate('georef'));
}

/* =========================================================================
   PANTALLA: Georreferencia ML (única funcionalidad de captura de esta app)
   ========================================================================= */
function screenGeorefHTML() {
  const p = State.profile;
  return `
  ${topHeaderHTML('Georreferencia ML')}
  <main>
    <div class="notice info">Un formulario por cada UPA del marco de lista, inmediatamente después de la entrevista.</div>
    <div class="card">
      <div class="field"><label>1. Fecha</label><input type="text" value="${fmtDateLong()}" readonly></div>
      <div class="field"><label>2. Encuestador ML</label>
        <input type="text" value="${p.nombre || ''}" readonly>
        <p class="hint">Tomado de su perfil — no necesita volver a escribirlo.</p>
      </div>
      <div class="field"><label>3. Provincia <span class="req">*</span></label>
        ${comboHTML('cb-g-provincia', 'Buscar provincia…')}
      </div>
      <div class="field" id="f-g-cuestionario"><label>4. Cuestionario (4 dígitos) <span class="req">*</span></label>
        <input type="text" id="g-cuestionario" inputmode="numeric" maxlength="4" placeholder="Ej. 0001" style="font-family:var(--font-mono); letter-spacing:.1em;">
        <div class="err">Ingrese los 4 dígitos del cuestionario.</div>
        <p class="hint" id="g-cuestionario-hint">Escriba el número tal como aparece impreso en el cuestionario.</p>
      </div>
      <div class="field"><label>5. Ubicación GPS del predio <span class="req">*</span></label>
        ${gpsBoxHTML('georef')}
      </div>
      <div class="field"><label>6. Observación</label>
        <textarea id="g-obs" placeholder="Opcional"></textarea>
      </div>
      <button class="btn btn-primary" id="g-submit">${Icon.check} Guardar y registrar otra UPA</button>
    </div>
  </main>
  `;
}

function bindGeorefScreen() {
  let matched = null; // coincidencia en el marco de lista precargado, si existe

  const hintEl = $('#g-cuestionario-hint');
  const cuestInput = $('#g-cuestionario');

  function refreshMatch() {
    const provincia = provCombo.getCode();
    const cod = cuestInput.value.trim();
    matched = null;
    if (!provincia || !/^[0-9]{4}$/.test(cod)) {
      hintEl.textContent = 'Escriba el número tal como aparece impreso en el cuestionario.';
      hintEl.className = 'hint';
      return;
    }
    const found = Catalog.cuestionario_ml.filter(x => x.p === provincia && x.cod === cod);
    if (found.length === 1) {
      matched = found[0];
      const provName = (Catalog.provincias.find(p => p.c === provincia) || {}).n || provincia;
      const supTxt = matched.sup != null ? `${matched.sup.toLocaleString('es-EC')} m²` : 'superficie no registrada';
      hintEl.textContent = `✓ Coincide con el marco de lista: Cantón ${matched.ct.slice(2)} · Parroquia ${matched.pq} · ${provName} · ${supTxt}`;
      hintEl.className = 'hint good';
    } else if (found.length > 1) {
      hintEl.textContent = `⚠ ${found.length} coincidencias para este número en la provincia. Verifique con su supervisor.`;
      hintEl.className = 'hint bad';
    } else {
      hintEl.textContent = '⚠ No se encontró en el marco de lista precargado. Verifique el número; si es correcto, puede continuar.';
      hintEl.className = 'hint bad';
    }
  }

  const provCombo = mountCombo('cb-g-provincia', {
    list: () => Catalog.provincias,
    onSelect: () => refreshMatch(),
  });
  cuestInput.addEventListener('input', () => {
    cuestInput.value = cuestInput.value.replace(/\D/g, '').slice(0, 4);
    refreshMatch();
  });
  const gps = bindGpsBox('georef');

  $('#btn-settings').addEventListener('click', () => navigate('sync'));

  $('#g-submit').addEventListener('click', async () => {
    const provincia = provCombo.getCode();
    const cuestionario = cuestInput.value.trim();
    const point = gps.getPoint();

    let ok = true;
    if (!provincia) { toast('Seleccione la provincia.', 'err'); ok = false; }
    ok = requireField('#f-g-cuestionario', /^[0-9]{4}$/.test(cuestionario), 'Ingrese los 4 dígitos del cuestionario.') && ok;
    if (!point) { toast('Capture la ubicación GPS antes de guardar.', 'err'); ok = false; }
    if (!ok) return;

    const dISO = todayISO();
    await dbAdd('georef', {
      id: crypto.randomUUID(), _synced: false, _fecha: dISO,
      fecha: dISO, cod_ml: State.profile.nombre, provincia, cuestionario,
      id_personal: State.profile.id_personal, zona: State.profile.zona,
      lat: point.lat, lng: point.lng, precision_m: Math.round(point.acc),
      enlace_maps: Geo.mapsLink(point.lat, point.lng),
      canton: matched ? matched.ct : '', parroquia: matched ? matched.pq : '',
      cod_completo_ml: matched ? matched.c : '',
      en_marco_lista: matched ? 'si' : 'no',
      observacion: $('#g-obs').value.trim(),
    });
    AutoSync.kick();
    toast('UPA georreferenciada. Puede registrar la siguiente.', 'ok');
    render(); // recarga limpia el formulario para el siguiente registro
  });
}

/* =========================================================================
   PANTALLA: Sincronización y ajustes
   ========================================================================= */
async function screenSyncHTML() {
  const total = await dbCount('georef');
  const pend = await dbCountPending('georef');
  const endpoint = await Sync.getEndpoint();
  const lastSync = await Sync.getLastSyncAt();

  return `
  ${topHeaderHTML('Sincronización y ajustes')}
  <main>
    <div class="card">
      <h3>Backend (Google Apps Script)</h3>
      <p class="hint">Pegue aquí la URL /exec que entrega Apps Script al implementar el proyecto como aplicación web.</p>
      <div class="field" id="f-endpoint">
        <label>URL del backend</label>
        <input type="url" id="endpoint-url" placeholder="https://script.google.com/macros/s/…/exec" value="${endpoint || ''}">
        <div class="err">Ingrese una URL válida (https://…/exec).</div>
      </div>
      <button class="btn btn-ghost" id="endpoint-save" type="button">Guardar URL</button>
      <p class="hint" style="margin-top:8px;">${lastSync ? 'Última sincronización: ' + new Date(lastSync).toLocaleString('es-EC') : 'Aún no se ha sincronizado desde este dispositivo.'}</p>
    </div>

    <div class="notice info">La sincronización es automática: en cuanto el dispositivo tenga señal, los registros pendientes se envían solos, sin que tenga que hacer nada. Este botón solo sirve para forzar el envío inmediato.</div>

    <div class="card">
      <h3>Registros de Georreferencia ML en este dispositivo</h3>
      <div class="sync-row"><span class="n">Cuestionarios capturados</span>
        ${pend ? `<span class="pill-pending">${pend} pendientes</span>` : `<span class="pill-empty">${total} sincronizados</span>`}
      </div>
    </div>

    <button class="btn btn-primary" id="sync-now">${Icon.check} Forzar sincronización ahora${pend ? ` (${pend})` : ''}</button>
    <div id="sync-progress" class="hint" style="text-align:center; margin-top:8px;"></div>

    <button class="btn btn-ghost" id="sync-export" style="margin-top:14px;">Exportar respaldo (JSON)</button>
    <button class="btn btn-ghost" id="sync-profile" style="margin-top:10px;">Editar mis datos</button>
    <button class="btn btn-danger-ghost" id="sync-wipe" style="margin-top:10px;">Borrar todos los registros locales</button>

    <div class="app-credit">ESPAC 2026 · Campo · Georreferencia ML<br>Desarrollado por Julio Márquez · WhatsApp 0962304236</div>
  </main>
  `;
}

function bindSyncScreen() {
  $('#endpoint-save').addEventListener('click', async () => {
    const url = $('#endpoint-url').value.trim();
    const valid = /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(url);
    if (!requireField('#f-endpoint', valid, 'Ingrese una URL válida (https://…/exec).')) {
      toast('La URL no tiene el formato esperado de un despliegue de Apps Script.', 'err');
      return;
    }
    await Sync.setEndpoint(url);
    toast('URL del backend guardada.', 'ok');
    AutoSync.kick();
  });

  $('#sync-now').addEventListener('click', async (e) => {
    const url = await Sync.getEndpoint();
    if (!url) { toast('Configure primero la URL del backend.', 'err'); return; }
    const btn = e.currentTarget;
    if (btn) btn.disabled = true;
    const prog = $('#sync-progress');
    if (prog) prog.textContent = 'Sincronizando…';
    let result;
    try {
      result = await Sync.syncAll((state) => {
        if (prog) prog.textContent = `Enviados ${state.sent} de ${state.total}${state.failed ? ` · ${state.failed} con error` : ''}`;
      });
    } catch (err) {
      if (btn) btn.disabled = false;
      toast('Error inesperado al sincronizar: ' + (err && err.message ? err.message : err), 'err');
      return;
    }
    if (btn) btn.disabled = false;
    if (result.total === 0) {
      toast('No hay registros pendientes por sincronizar.', 'ok');
      navigate('sync');
    } else if (result.failed === 0) {
      toast(`${result.sent} registro(s) sincronizado(s) correctamente.`, 'ok');
      navigate('sync');
    } else {
      if (prog) prog.textContent = `${result.sent} enviados, ${result.failed} con error · último error: ${result.lastError}`;
      toast(`${result.sent} enviados, ${result.failed} con error. Revise el detalle bajo el botón.`, 'err');
    }
  });

  $('#sync-export').addEventListener('click', async () => {
    const data = { georef: await dbAll('georef') };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `espac_campo_georef_${todayISO()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast('Respaldo exportado.', 'ok');
  });
  $('#sync-profile').addEventListener('click', () => navigate('profile', { editing: true }));
  $('#sync-wipe').addEventListener('click', async () => {
    if (!confirm('¿Borrar todos los registros locales? Esta acción no se puede deshacer.')) return;
    await dbClearStore('georef');
    toast('Registros locales eliminados.', 'ok');
    navigate('georef');
  });
}

/* --------------------------------------------------------- header común */
function topHeaderHTML(title) {
  const showBack = State.route !== 'georef';
  return `
  <div class="topbar">
    <div class="topbar-row">
      ${showBack ? `<button class="icon-btn" id="btn-back">${Icon.back}</button>` : `<div class="brand-row"><img src="icons/icon-192.png" class="brand-ico" alt="ESPAC 2026"></div>`}
      <div class="brand" style="align-items:flex-end; text-align:right;"><b>${title}</b><span>${ROLE_ML.label} · ${State.profile.nombre || ''}</span></div>
      ${!showBack ? `<button class="icon-btn" id="btn-settings">${Icon.gear}</button>` : ''}
    </div>
  </div>`;
}
function bindBack() { $('#btn-back')?.addEventListener('click', () => navigate('georef')); }

/* =========================================================================
   Router
   ========================================================================= */
async function navigate(route, params = {}) {
  State.route = route;
  State.params = params;
  await render();
  window.scrollTo(0, 0);
}

async function render() {
  const main = $('#app');
  if (!State.profile || State.route === 'profile') {
    main.innerHTML = screenProfileHTML(State.route === 'profile');
    bindProfileScreen(State.route === 'profile');
    return;
  }
  switch (State.route) {
    case 'sync':
      main.innerHTML = await screenSyncHTML(); bindBack(); bindSyncScreen(); break;
    case 'georef':
    default:
      main.innerHTML = screenGeorefHTML(); bindGeorefScreen(); break;
  }
}

/* =========================================================================
   Arranque
   ========================================================================= */
async function boot() {
  await Catalog.load();
  await loadProfile();
  await render();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  AutoSync.init();
}
document.addEventListener('DOMContentLoaded', boot);
