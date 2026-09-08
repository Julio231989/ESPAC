/* =========================================================================
   app.js — ESPAC 2026 · Campo
   SPA vanilla sin frameworks (para minimizar dependencias offline).
   ========================================================================= */

/* ---------------------------------------------------------------- iconos */
const Icon = {
  home:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>`,
  pin:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.6A7 7 0 1 0 5 9.4C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.4" r="2.4"/></svg>`,
  map:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>`,
  clip:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/><path d="M9 11h6M9 15h6"/></svg>`,
  radar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.2"/><path d="M12 12L19 7"/></svg>`,
  gear:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.33-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/></svg>`,
  cam:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="14" r="3.6"/></svg>`,
  gps:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  back:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>`,
  sun:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  moon:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>`,
  seed:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21C7 21 4 17 4 12S7 3 12 3s8 4 8 9-3 9-8 9z"/><path d="M12 3v18"/></svg>`,
  flag:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4h13l-3 4.5L18 13H5"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>`,
};

/* --------------------------------------------------------------- estado */
const State = {
  profile: null,
  route: 'home',
  params: {},
};

const ESPAC_YEAR_CODE = '26'; // Año 2026 — actualizar si el operativo continúa en años siguientes

/* idCode: prefijo de perfil para el ID de personal (AÑO+ZONA+PERFIL+NÚMERO).
   phoneInSedes: si este perfil debe declarar teléfono al registrar una sede. */
const ROLE_META = {
  ml:       { code: 'encuestador_ml',    cargoCobertura: 'enc_ml',    label: 'Encuestador de Lista',  ico: Icon.map,  idCode: 'EL', phoneInSedes: true },
  areas:    { code: 'encuestador_areas', cargoCobertura: null,        label: 'Encuestador de Áreas',  ico: Icon.seed, idCode: 'EN', phoneInSedes: false },
  revisor:  { code: 'revisor_digitador', cargoCobertura: null,        label: 'Revisor - Digitador',   ico: Icon.clip, idCode: 'RD', phoneInSedes: true },
  supervisor:{ code: 'supervisor',       cargoCobertura: 'supervisor',label: 'Supervisor',            ico: Icon.gear, idCode: 'SU', phoneInSedes: true },
};

/* Matriz de acceso a módulos por rol. Ajustable aquí en un solo lugar. */
const MODULE_ACCESS = {
  sedes:      ['ml', 'areas', 'revisor', 'supervisor'],  // habilitado para los 4 perfiles
  georef:     ['ml'],
  cobertura:  ['ml', 'supervisor'],                      // según relevant de Kobo_cobertura_ma_ml.xlsx
  track:      ['ml', 'areas', 'supervisor'],             // revisor-digitador no fue incluido en el track solicitado
  plan:       ['supervisor'],                            // plan matutino de segmentos a trabajar
};

const MODULES = [
  { key: 'sedes',     tab: 'Sedes',     title: 'Registro de sede',        desc: 'Cada vez que cambie de sede',            icon: Icon.pin,   store: 'sedes' },
  { key: 'plan',      tab: 'Plan',      title: 'Plan del día',            desc: 'Segmentos que espera trabajar hoy',      icon: Icon.flag,  store: 'plan_diario' },
  { key: 'georef',    tab: 'Georref.',  title: 'Georreferencia ML',       desc: 'Una por cada UPA de lista',              icon: Icon.map,   store: 'georef' },
  { key: 'cobertura', tab: 'Cobertura', title: 'Cobertura MA / ML',       desc: 'Registro diario de avance',              icon: Icon.clip,  store: null },
  { key: 'track',     tab: 'Track',     title: 'Track de supervisión',    desc: 'Punto GPS de 3 s, mañana y tarde',       icon: Icon.radar, store: 'tracking' },
];

function hasAccess(moduleKey, role) {
  return (MODULE_ACCESS[moduleKey] || []).includes(role);
}
function accessibleModules(role) {
  return MODULES.filter(m => hasAccess(m.key, role));
}

/* ----------------------------------------------------------- utilidades */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function nowHM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
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

function setFieldInvalid(fieldEl, invalid, msg) {
  fieldEl.classList.toggle('invalid', !!invalid);
  const err = $('.err', fieldEl);
  if (err && msg) err.textContent = msg;
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
    refresh: (newList) => { root.dataset.code = ''; input.value = ''; },
    getCode: () => root.dataset.code || '',
  };
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
   PANTALLA: Selección de perfil (rol + datos base)
   ========================================================================= */
function screenProfileHTML(editing) {
  const p = State.profile || {};
  return `
  <div class="center-screen surco-bg">
    <div class="logo-wrap">
      <img class="logo-full" src="icons/logo-horizontal.png" alt="ESPAC">
      <div class="eyebrow">Operativo de campo · 2026</div>
      <h1 class="title-hero">¿Con qué perfil ingresa hoy?</h1>
      <p class="sub-hero">Esto habilita los formularios que le corresponden.</p>
    </div>
    <div class="role-grid" id="role-grid">
      ${Object.entries(ROLE_META).map(([key, r]) => `
        <div class="role-card ${p.role === key ? 'sel' : ''}" data-role="${key}">
          <div class="ico">${r.ico}</div>
          <b>${r.label}</b>
        </div>`).join('')}
    </div>

    <div class="card" style="margin-top:22px;">
      <h3>Sus datos</h3>
      <p class="hint">Se usarán para autocompletar los formularios. Puede editarlos en cualquier registro.</p>
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
        <p class="hint">No se registra cédula: este código identifica al personal en la hoja de cálculo y los visualizadores.</p>
      </div>
    </div>

    <button class="btn btn-primary" id="pf-continue">Continuar ${Icon.arrow}</button>
    ${editing ? `<button class="btn btn-ghost" id="pf-cancel" style="margin-top:10px;">Cancelar</button>` : ''}
  </div>`;
}

function bindProfileScreen(editing) {
  let selectedRole = (State.profile || {}).role || null;
  $$('.role-card').forEach(card => card.addEventListener('click', () => {
    selectedRole = card.dataset.role;
    $$('.role-card').forEach(c => c.classList.remove('sel'));
    card.classList.add('sel');
    updatePreview();
  }));
  const zonaGroup = bindChipGroup($('#pf-zona-chips'));
  $$('#pf-zona-chips .choice-chip').forEach(c => c.addEventListener('click', updatePreview));
  $('#pf-num').addEventListener('input', updatePreview);

  function updatePreview() {
    const zona = zonaGroup.getSelected()[0];
    const perfil = selectedRole ? ROLE_META[selectedRole].idCode : null;
    const num = $('#pf-num').value.trim();
    const preview = $('#pf-id-preview');
    if (zona && perfil && /^[0-9]{1,2}$/.test(num)) {
      preview.value = ESPAC_YEAR_CODE + zona + perfil + num.padStart(2, '0');
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
    if (!selectedRole) { toast('Seleccione un perfil para continuar.', 'err'); ok = false; }
    ok = requireField('#f-pf-nombre', !!nombre, 'Campo obligatorio.') && ok;
    ok = requireField('#f-pf-zona', !!zona, 'Seleccione su zona.') && ok;
    ok = requireField('#f-pf-num', /^[0-9]{1,2}$/.test(numRaw) && Number(num) >= 1, 'Ingrese un número de 01 a 99.') && ok;
    if (!ok) { toast('Revise los campos marcados en rojo.', 'err'); return; }

    const idPersonal = ESPAC_YEAR_CODE + zona + ROLE_META[selectedRole].idCode + num;
    await saveProfile({ role: selectedRole, nombre, zona, num_personal: num, id_personal: idPersonal });
    navigate('home');
  });
  if (editing) $('#pf-cancel')?.addEventListener('click', () => navigate('home'));
}

/* =========================================================================
   PANTALLA: Inicio (tablero)
   ========================================================================= */
async function screenHomeHTML() {
  const role = State.profile.role;
  const mods = accessibleModules(role).filter(m => m.key !== 'track'); // el track se maneja con los botones AM/PM, no como tile
  const dISO = todayISO();
  const sedeDone = !!(await cfgGet(`done_sedes_${dISO}`, false));
  const planDone = !!(await cfgGet(`done_plan_${dISO}`, false));
  const amDone = !!(await cfgGet(`done_track_am_${dISO}`, false));
  const pmDone = !!(await cfgGet(`done_track_pm_${dISO}`, false));

  /* Checklist de cumplimiento del día, distinto según lo que le corresponde a cada perfil */
  const checklist = [{ key: 'sedes', label: 'Sede', done: sedeDone }];
  if (role === 'supervisor') checklist.push({ key: 'plan', label: 'Plan', done: planDone });
  if (hasAccess('track', role)) {
    checklist.push({ key: 'am', label: 'AM', done: amDone });
    checklist.push({ key: 'pm', label: 'PM', done: pmDone });
  }

  const pendingCounts = {};
  for (const st of ['sedes', 'georef', 'tracking', 'plan_diario']) pendingCounts[st] = await dbCountPending(st);
  pendingCounts.cobertura = (await dbCountPending('cobertura_ma')) + (await dbCountPending('cobertura_ml'));

  const tiles = mods.map(m => {
    let count = 0;
    if (m.key === 'cobertura') count = pendingCounts.cobertura;
    else if (m.store) count = pendingCounts[m.store];
    return `
    <button class="tile" data-route="${m.key}">
      <div class="ico">${m.icon}</div>
      <b>${m.title}</b>
      <small>${m.desc}</small>
      ${count ? `<span class="badge-count">${count} sin sincronizar</span>` : ''}
    </button>`;
  }).join('');

  const doneCount = checklist.filter(c => c.done).length;

  return `
  <div class="topbar surco-bg">
    <div class="topbar-row">
      <div class="brand-row">
        <img src="icons/icon-192.png" class="brand-ico" alt="ESPAC 2026">
        <div class="brand"><b>ESPAC 2026 · Campo</b><span>${fmtDateLong()}</span></div>
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        <span class="role-pill">${ROLE_META[role].label}</span>
        <button class="icon-btn" id="btn-settings">${Icon.gear}</button>
      </div>
    </div>
    <div class="jornada-strip" title="Cumplimiento del día: ${doneCount}/${checklist.length}">
      ${checklist.map(c => `<div class="jornada-tick ${c.done ? 'done' : ''}"><span class="lbl">${c.label}</span></div>`).join('')}
    </div>
  </div>
  <main>
    ${!navigator.onLine ? `<div class="notice">Sin conexión. Los registros se guardan en el dispositivo y se sincronizarán cuando definamos la integración con Sheets.</div>` : ''}
    <div class="section-title">Módulos habilitados para su perfil</div>
    <div class="tile-grid">${tiles}</div>

    ${hasAccess('track', role) ? `
    <div class="section-title">Track rápido de supervisión</div>
    <div class="card">
      <p class="hint">Un punto GPS de 3 segundos. Uno en la mañana, otro en la tarde.</p>
      <div class="row-2">
        <button class="btn ${amDone ? 'btn-ghost' : 'btn-field'}" id="track-am">${Icon.sun} Mañana ${amDone ? '· hecho' : ''}</button>
        <button class="btn ${pmDone ? 'btn-ghost' : 'btn-field'}" id="track-pm">${Icon.moon} Tarde ${pmDone ? '· hecho' : ''}</button>
      </div>
    </div>` : ''}
  </main>
  ${tabbarHTML('home')}
  `;
}

function bindHomeScreen() {
  $('#btn-settings').addEventListener('click', () => navigate('sync'));
  $$('.tile').forEach(t => t.addEventListener('click', () => navigate(t.dataset.route)));
  $('#track-am')?.addEventListener('click', () => runTrack('am'));
  $('#track-pm')?.addEventListener('click', () => runTrack('pm'));
  bindTabbar();
}

async function runTrack(franja) {
  const dISO = todayISO();
  const already = await cfgGet(`done_track_${franja}_${dISO}`, false);
  if (already) {
    toast('Ya registró el track de este turno. Puede repetirlo si lo requiere.', '');
  }
  openTrackModal(franja);
}

/* =========================================================================
   Modal de captura de track (3 s) — overlay simple, reutilizable
   ========================================================================= */
function openTrackModal(franja) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(43,35,24,.55);z-index:80;display:flex;align-items:center;justify-content:center;padding:20px;';
  overlay.innerHTML = `
    <div class="card" style="max-width:340px; text-align:center;">
      <h3>Track ${franja === 'am' ? 'de mañana' : 'de tarde'}</h3>
      <p class="hint">Mantenga el dispositivo con vista al cielo durante 3 segundos.</p>
      <svg class="progressring" viewBox="0 0 64 64" style="margin:14px auto;">
        <circle class="bg" cx="32" cy="32" r="27"></circle>
        <circle class="fg" id="ring-fg" cx="32" cy="32" r="27" stroke-dasharray="169.6" stroke-dashoffset="169.6"></circle>
      </svg>
      <div class="gps-status" id="track-status">Obteniendo señal…</div>
      <button class="btn btn-ghost" id="track-cancel" style="margin-top:8px;">Cancelar</button>
    </div>`;
  document.body.appendChild(overlay);
  const ring = $('#ring-fg', overlay);
  const status = $('#track-status', overlay);
  const CIRC = 169.6;
  let cancelled = false;
  $('#track-cancel', overlay).addEventListener('click', () => { cancelled = true; overlay.remove(); });

  Geo.trackPing({
    durationMs: 3000,
    onTick: (p, reading) => {
      ring.setAttribute('stroke-dashoffset', String(CIRC * (1 - p)));
      status.textContent = `Precisión actual: ${Math.round(reading.acc)} m`;
    }
  }).then(async (reading) => {
    if (cancelled) return;
    const dISO = todayISO();
    await dbAdd('tracking', {
      id: crypto.randomUUID(), _synced: false, _fecha: dISO,
      fecha: dISO, hora: nowHM(), franja,
      rol: State.profile.role, nombre: State.profile.nombre,
      id_personal: State.profile.id_personal, zona: State.profile.zona,
      lat: reading.lat, lng: reading.lng, precision_m: Math.round(reading.acc),
    });
    await cfgSet(`done_track_${franja}_${dISO}`, true);
    status.className = 'gps-status good';
    status.textContent = 'Punto registrado ✓';
    setTimeout(() => { overlay.remove(); navigate('home'); toast('Track registrado correctamente.', 'ok'); }, 700);
  }).catch((err) => {
    if (cancelled) return;
    status.className = 'gps-status bad';
    status.textContent = 'No se pudo obtener el punto. Intente nuevamente.';
    setTimeout(() => overlay.remove(), 1800);
  });
}

/* =========================================================================
   Barra inferior de navegación
   ========================================================================= */
function tabbarHTML(active) {
  const role = State.profile.role;
  const items = [{ key: 'home', label: 'Inicio', icon: Icon.home }]
    .concat(accessibleModules(role).filter(m => m.key !== 'track').map(m => ({ key: m.key, label: m.tab, icon: m.icon })));
  return `<nav class="tabbar">
    ${items.map(it => `<button class="tab-btn ${active === it.key ? 'active' : ''}" data-route="${it.key}">${it.icon}<span>${it.label}</span></button>`).join('')}
  </nav>`;
}
function bindTabbar() {
  $$('.tab-btn').forEach(b => b.addEventListener('click', () => navigate(b.dataset.route)));
}

/* =========================================================================
   PANTALLA: Sedes  (habilitada para todos los perfiles)
   ========================================================================= */
function screenSedesHTML() {
  const p = State.profile;
  const role = ROLE_META[p.role];
  return `
  ${topHeaderHTML('Registro de sede', 'sedes')}
  <main>
    <div class="notice info">Diligencie este formulario al iniciar la jornada y cada vez que cambie de sede.</div>
    <div class="card">
      <div class="field"><label>1. Fecha</label><input type="text" value="${fmtDateLong()}" readonly></div>

      <div class="field"><label>2. Provincia <span class="req">*</span></label>
        ${comboHTML('cb-provincia', 'Buscar provincia…')}
      </div>
      <div class="field"><label>3. Cantón <span class="req">*</span></label>
        ${comboHTML('cb-canton', 'Seleccione primero la provincia')}
      </div>
      <div class="field"><label>4. Parroquia <span class="req">*</span></label>
        ${comboHTML('cb-parroquia', 'Seleccione primero el cantón')}
      </div>
      <div class="row-2">
        <div class="field"><label>5. Cargo</label>
          <input type="text" value="${role.label}" readonly>
        </div>
        <div class="field"><label>ID de personal</label>
          <input type="text" value="${p.id_personal || '—'}" readonly style="font-family:var(--font-mono);">
        </div>
      </div>
      <div class="field" id="f-nombre"><label>6. Nombre y apellido <span class="req">*</span></label>
        <input type="text" id="s-nombre" value="${p.nombre || ''}"><div class="err"></div>
      </div>
      ${role.phoneInSedes ? `
      <div class="field" id="f-telefono"><label>7. Teléfono móvil <span class="req">*</span></label>
        <input type="text" id="s-telefono" inputmode="numeric" maxlength="10" value="${p.telefono || ''}"><div class="err">Debe tener 10 dígitos numéricos.</div>
      </div>` : ''}
      <div class="field"><label>${role.phoneInSedes ? '8' : '7'}. Referencia de la sede <span class="req">*</span></label>
        <input type="text" id="s-ref" placeholder='Ej. "Hostal El Triunfo", casa amarilla 2do piso'>
      </div>

      <div class="field"><label>${role.phoneInSedes ? '9' : '8'}. Ubicación de la sede <span class="req">*</span></label>
        ${gpsBoxHTML('sede')}
      </div>

      <div class="field"><label>${role.phoneInSedes ? '10' : '9'}. Observación</label>
        <textarea id="s-obs" placeholder="Opcional"></textarea>
      </div>

      <button class="btn btn-primary" id="s-submit">${Icon.check} Guardar sede</button>
    </div>
  </main>
  ${tabbarHTML('sedes')}
  `;
}

function gpsBoxHTML(prefix) {
  return `
  <div class="gps-box" id="gps-${prefix}">
    <button class="btn btn-field" id="gps-btn-${prefix}" type="button">${Icon.gps} Capturar ubicación GPS</button>
    <div class="gps-status" id="gps-status-${prefix}">Esperando captura…</div>
  </div>`;
}

function bindGpsBox(prefix, { onCaptured }) {
  const btn = $(`#gps-btn-${prefix}`);
  const status = $(`#gps-status-${prefix}`);
  let point = null;
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    status.className = 'gps-status';
    status.textContent = 'Obteniendo señal GPS de alta precisión…';
    try {
      const p = await Geo.capturePoint({
        onUpdate: (reading) => { status.textContent = `Precisión actual: ${Math.round(reading.acc)} m (se requiere ≤ 30 m)`; }
      });
      point = p;
      status.className = 'gps-status good';
      status.innerHTML = `✓ Punto capturado — precisión ${Math.round(p.acc)} m<br>${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`;
      btn.textContent = 'Volver a capturar';
      btn.prepend();
      if (onCaptured) onCaptured(point);
    } catch (e) {
      status.className = 'gps-status bad';
      status.textContent = e.message || 'No se pudo obtener el punto GPS.';
    } finally {
      btn.disabled = false;
    }
  });
  return { getPoint: () => point };
}

function bindSedesScreen() {
  bindTabbar();
  const provCombo = mountCombo('cb-provincia', {
    list: () => Catalog.provincias,
    onSelect: (code) => {
      cantonCombo.refresh();
      $('#cb-canton .combo-input').value = '';
      $('#cb-canton').dataset.code = '';
      parroquiaCombo.refresh();
      $('#cb-parroquia .combo-input').value = '';
      $('#cb-parroquia').dataset.code = '';
    }
  });
  const cantonCombo = mountCombo('cb-canton', {
    list: () => Catalog.cantonesByProvincia(provCombo.getCode()),
    onSelect: (code) => {
      parroquiaCombo.refresh();
      $('#cb-parroquia .combo-input').value = '';
      $('#cb-parroquia').dataset.code = '';
    }
  });
  const parroquiaCombo = mountCombo('cb-parroquia', {
    list: () => Catalog.parroquiasByCanton(cantonCombo.getCode()),
  });
  const gps = bindGpsBox('sede', {});

  $('#s-submit').addEventListener('click', async () => {
    const role = ROLE_META[State.profile.role];
    const nombre = $('#s-nombre').value.trim();
    const telefono = role.phoneInSedes ? $('#s-telefono').value.trim() : '';
    const ref = $('#s-ref').value.trim();
    const provincia = provCombo.getCode();
    const canton = cantonCombo.getCode();
    const parroquia = parroquiaCombo.getCode();
    const point = gps.getPoint();

    let ok = true;
    ok = requireField('#cb-provincia', !!provincia, 'Seleccione una provincia.') && ok;
    ok = requireField('#cb-canton', !!canton, 'Seleccione un cantón.') && ok;
    ok = requireField('#cb-parroquia', !!parroquia, 'Seleccione una parroquia.') && ok;
    ok = requireField('#f-nombre', !!nombre, 'Campo obligatorio.') && ok;
    if (role.phoneInSedes) {
      ok = requireField('#f-telefono', /^[0-9]{10}$/.test(telefono), 'Debe tener 10 dígitos numéricos.') && ok;
    }
    ok = requireField('#s-ref', !!ref, 'Campo obligatorio.', true) && ok;
    if (!point) { toast('Capture la ubicación GPS antes de guardar.', 'err'); ok = false; }
    if (!ok) return;

    const dISO = todayISO();
    await dbAdd('sedes', {
      id: crypto.randomUUID(), _synced: false, _fecha: dISO,
      fecha: dISO, provincia, canton, parroquia, cargo: role.code,
      id_personal: State.profile.id_personal, zona: State.profile.zona,
      nombre, telefono, referencia: ref,
      lat: point.lat, lng: point.lng, precision_m: Math.round(point.acc),
      enlace_maps: Geo.mapsLink(point.lat, point.lng),
      observacion: $('#s-obs').value.trim(),
    });
    await cfgSet(`done_sedes_${dISO}`, true);
    toast('Sede registrada correctamente.', 'ok');
    navigate('home');
  });
}

function requireField(sel, valid, msg, isInput) {
  const el = $(sel);
  if (!el) return valid;
  el.classList.toggle('invalid', !valid);
  const err = $('.err', el);
  if (err) err.textContent = msg;
  return valid;
}

/* =========================================================================
   PANTALLA: Plan del día  (solo supervisor)
   Registrado en la mañana: qué segmentos (MA) espera trabajar el equipo hoy.
   Sirve de línea base para contrastar contra la Cobertura MA/ML reportada
   más tarde — esa comparación (planificado vs. ejecutado) se resuelve en
   la fase de Sheets / Power BI / Looker Studio, no en el dispositivo.
   ========================================================================= */
function screenPlanHTML() {
  const p = State.profile;
  return `
  ${topHeaderHTML('Plan del día', 'plan')}
  <main>
    <div class="notice info">Registre esto al iniciar la jornada: qué segmentos espera trabajar su equipo hoy. Puede agregar más segmentos si el plan cambia.</div>
    <div class="card">
      <div class="field"><label>Fecha</label><input type="text" value="${fmtDateLong()}" readonly></div>
      <div class="field"><label>Jornada <span class="req">*</span></label>
        <div class="choice-grid" id="plan-jornada-chips">
          ${Catalog.jornada.map(j => `<div class="choice-chip" data-code="${j.c}">${j.n}</div>`).join('')}
        </div>
      </div>
      <div class="field" id="f-plan-nombre"><label>Supervisor <span class="req">*</span></label>
        <input type="text" id="plan-nombre" value="${p.nombre || ''}"><div class="err">Campo obligatorio.</div>
      </div>
    </div>

    <div class="card">
      <h3>Agregar segmento esperado</h3>
      <div class="field"><label>Segmento (9 dígitos)</label>
        ${comboHTML('cb-plan-seg', 'Escriba el código del segmento…')}
      </div>
      <div class="field"><label>Encuestador de área asignado (opcional)</label>
        <input type="text" id="plan-enc">
      </div>
      <button class="btn btn-field" id="plan-add" type="button">${Icon.flag} Agregar a la lista</button>
    </div>

    <div class="section-title" id="plan-list-title" style="display:none;">Segmentos planificados para hoy</div>
    <div id="plan-list"></div>

    <button class="btn btn-primary" id="plan-submit" style="margin-top:6px;">${Icon.check} Guardar plan del día</button>
  </main>
  ${tabbarHTML('plan')}
  `;
}

function planRowHTML(idx, item) {
  return `
  <div class="rep-item" data-idx="${idx}">
    <span class="rep-num">${idx + 1}</span>
    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
      <div>
        <b style="font-family:var(--font-mono); font-size:14px;">${item.segmento}</b>
        <div class="hint">${item.encuestador ? 'Encuestador: ' + item.encuestador : 'Sin encuestador asignado aún'}</div>
      </div>
      <button class="icon-btn plan-remove" type="button" style="background:var(--red-tint); color:var(--red); border-color:var(--red);">${Icon.trash}</button>
    </div>
  </div>`;
}

function bindPlanScreen() {
  bindTabbar();
  const jornadaGroup = bindChipGroup($('#plan-jornada-chips'));
  const segCombo = mountCombo('cb-plan-seg', { list: () => Catalog.segmento_ma });
  const items = []; // { segmento, encuestador }

  function renderList() {
    const listEl = $('#plan-list');
    $('#plan-list-title').style.display = items.length ? 'block' : 'none';
    listEl.innerHTML = items.map(planRowHTML).join('');
    $$('.plan-remove', listEl).forEach((btn, i) => btn.addEventListener('click', () => {
      items.splice(i, 1);
      renderList();
    }));
  }

  $('#plan-add').addEventListener('click', () => {
    const segmento = segCombo.getCode();
    const encuestador = $('#plan-enc').value.trim();
    if (!segmento) { toast('Busque y seleccione un segmento antes de agregarlo.', 'err'); return; }
    if (items.some(it => it.segmento === segmento)) { toast('Ese segmento ya está en la lista.', 'err'); return; }
    items.push({ segmento, encuestador });
    segCombo.refresh();
    $('#cb-plan-seg .combo-input').value = '';
    $('#plan-enc').value = '';
    renderList();
  });

  $('#plan-submit').addEventListener('click', async () => {
    const jornada = jornadaGroup.getSelected()[0];
    const nombre = $('#plan-nombre').value.trim();
    let ok = true;
    if (!jornada) { toast('Seleccione la jornada.', 'err'); ok = false; }
    ok = requireField('#f-plan-nombre', !!nombre, 'Campo obligatorio.') && ok;
    if (!items.length) { toast('Agregue al menos un segmento esperado.', 'err'); ok = false; }
    if (!ok) return;

    const dISO = todayISO();
    await dbAdd('plan_diario', {
      id: crypto.randomUUID(), _synced: false, _fecha: dISO,
      fecha: dISO, jornada, supervisor: nombre,
      id_personal: State.profile.id_personal, zona: State.profile.zona,
      hora_registro: nowHM(),
      segmentos: items.slice(),
    });
    await cfgSet(`done_plan_${dISO}`, true);
    toast('Plan del día guardado correctamente.', 'ok');
    navigate('home');
  });
}

/* =========================================================================
   PANTALLA: Georreferencia ML  (solo rol ml)
   ========================================================================= */
function screenGeorefHTML() {
  const p = State.profile;
  return `
  ${topHeaderHTML('Georreferencia ML', 'georef')}
  <main>
    <div class="notice info">Un formulario por cada UPA del marco de lista, inmediatamente después de la entrevista.</div>
    <div class="card">
      <div class="field"><label>1. Fecha</label><input type="text" value="${fmtDateLong()}" readonly></div>
      <div class="field" id="f-g-nombre"><label>2. Nombre y apellido — encuestador ML <span class="req">*</span></label>
        <input type="text" id="g-nombre" value="${p.nombre || ''}"><div class="err">Campo obligatorio.</div>
      </div>
      <div class="field"><label>3. Provincia <span class="req">*</span></label>
        ${comboHTML('cb-g-provincia', 'Buscar provincia…')}
      </div>
      <div class="field"><label>4. Cuestionario (8 dígitos) <span class="req">*</span></label>
        ${comboHTML('cb-g-cuestionario', 'Escriba el código del cuestionario…')}
        <div class="hint">Provincia · estrato · cuestionario.</div>
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
  ${tabbarHTML('georef')}
  `;
}

function bindGeorefScreen() {
  bindTabbar();
  const provCombo = mountCombo('cb-g-provincia', {
    list: () => Catalog.provincias,
    onSelect: () => { $('#cb-g-cuestionario .combo-input').value = ''; $('#cb-g-cuestionario').dataset.code = ''; }
  });
  const cuestCombo = mountCombo('cb-g-cuestionario', {
    list: () => Catalog.cuestionarioMlByProvincia(provCombo.getCode()),
  });
  const gps = bindGpsBox('georef', {});

  $('#g-submit').addEventListener('click', async () => {
    const nombre = $('#g-nombre').value.trim();
    const provincia = provCombo.getCode();
    const cuestionario = cuestCombo.getCode();
    const point = gps.getPoint();

    let ok = true;
    ok = requireField('#f-g-nombre', !!nombre, 'Campo obligatorio.') && ok;
    if (!provincia) { toast('Seleccione la provincia.', 'err'); ok = false; }
    if (!cuestionario) { toast('Seleccione el cuestionario.', 'err'); ok = false; }
    if (!point) { toast('Capture la ubicación GPS antes de guardar.', 'err'); ok = false; }
    if (!ok) return;

    const dISO = todayISO();
    await dbAdd('georef', {
      id: crypto.randomUUID(), _synced: false, _fecha: dISO,
      fecha: dISO, cod_ml: nombre, provincia, cuestionario,
      id_personal: State.profile.id_personal, zona: State.profile.zona,
      lat: point.lat, lng: point.lng, precision_m: Math.round(point.acc),
      enlace_maps: Geo.mapsLink(point.lat, point.lng),
      observacion: $('#g-obs').value.trim(),
    });
    toast('UPA georreferenciada. Puede registrar la siguiente.', 'ok');
    render(); // recarga limpia el formulario para el siguiente registro
  });
}

/* =========================================================================
   PANTALLA: Cobertura MA / ML  (supervisor → segmentos MA · ml → cuestionarios)
   ========================================================================= */
function screenCoberturaHTML() {
  const role = State.profile.role;
  const isSup = role === 'supervisor';
  return `
  ${topHeaderHTML('Cobertura MA / ML', 'cobertura')}
  <main>
    <div class="card">
      <div class="field"><label>1. Fecha</label><input type="text" value="${fmtDateLong()}" readonly></div>
      <div class="field"><label>2. Jornada <span class="req">*</span></label>
        <div class="choice-grid" id="jornada-chips">
          ${Catalog.jornada.map(j => `<div class="choice-chip" data-code="${j.c}">${j.n}</div>`).join('')}
        </div>
      </div>
      <div class="field"><label>3. Cargo</label><input type="text" value="${ROLE_META[role].label}" readonly></div>
      <div class="field" id="f-c-nombre"><label>4. Nombre y apellido <span class="req">*</span></label>
        <input type="text" id="c-nombre" value="${State.profile.nombre || ''}"><div class="err">Campo obligatorio.</div>
      </div>
      <div class="field" id="f-c-n"><label>5. ¿Cuántos ${isSup ? 'SM (segmentos de área)' : 'cuestionarios ML'} va a reportar? <span class="req">*</span></label>
        <input type="number" id="c-n" min="1" inputmode="numeric" placeholder="Ingrese un número entero"><div class="err">Ingrese un número mayor a 0.</div>
      </div>
      <button class="btn btn-ghost" id="c-generar" type="button">Generar registros</button>
    </div>

    <div id="c-reps"></div>

    <div class="card" id="c-final" style="display:none;">
      <div class="field"><label>Observación general</label>
        <textarea id="c-obs" placeholder="Opcional"></textarea>
      </div>
      <button class="btn btn-primary" id="c-submit">${Icon.check} Guardar cobertura del día</button>
    </div>
  </main>
  ${tabbarHTML('cobertura')}
  `;
}

function repItemSupervisorHTML(i) {
  return `
  <div class="rep-item" data-idx="${i}">
    <span class="rep-num">SM ${i + 1}</span>
    <div class="field"><label>Segmento (9 dígitos) <span class="req">*</span></label>
      ${comboHTML(`cb-seg-${i}`, 'Escriba el código del segmento…')}
    </div>
    <div class="field"><label>Encuestador de área asignado <span class="req">*</span></label>
      <input type="text" class="rep-enc" placeholder="Nombre y apellido">
    </div>
    <div class="field"><label>Estado de levantamiento <span class="req">*</span></label>
      <div class="choice-grid rep-estado-lev">
        ${Catalog.estado_lev.map(e => `<div class="choice-chip" data-code="${e.c}">${e.n}</div>`).join('')}
      </div>
    </div>
    <div class="field"><label>N.º de productores <span class="req">*</span></label>
      <input type="number" class="rep-prod" min="0" inputmode="numeric">
    </div>
    <div class="field"><label>Estado de digitación <span class="req">*</span></label>
      <div class="choice-grid rep-estado-dig">
        ${Catalog.estado_dig.map(e => `<div class="choice-chip" data-code="${e.c}">${e.n}</div>`).join('')}
      </div>
    </div>
  </div>`;
}

function repItemMlHTML(i) {
  return `
  <div class="rep-item" data-idx="${i}">
    <span class="rep-num">Cuestionario ${i + 1}</span>
    <div class="field"><label>Cuestionario ML (17 dígitos) <span class="req">*</span></label>
      ${comboHTML(`cb-cue-${i}`, 'Escriba el código del cuestionario…')}
    </div>
    <div class="field"><label>Estado de levantamiento <span class="req">*</span></label>
      <div class="choice-grid rep-estado-lev-ml">
        ${Catalog.estado_lev_ml.map(e => `<div class="choice-chip ${e.efectiva ? '' : 'warn'}" data-code="${e.c}" data-efectiva="${e.efectiva}">${e.n}</div>`).join('')}
      </div>
    </div>
    <div class="rep-novedad" style="display:none;">
      <div class="notice">Encuesta no efectiva: la fotografía en vivo y la novedad son obligatorias.</div>
      <div class="field"><label>Fotografía de novedad <span class="req">*</span></label>
        ${camBoxHTML(`cam-${i}`)}
      </div>
      <div class="field"><label>Detalle de la novedad <span class="req">*</span></label>
        <textarea class="rep-nov-detalle" placeholder="Describa brevemente lo ocurrido"></textarea>
      </div>
    </div>
    <div class="field"><label>Estado de digitación <span class="req">*</span></label>
      <div class="choice-grid rep-estado-dig-ml">
        ${Catalog.estado_dig_ml.map(e => `<div class="choice-chip" data-code="${e.c}">${e.n}</div>`).join('')}
      </div>
    </div>
  </div>`;
}

function camLiveInnerHTML() {
  return `
    <div class="cam-live" style="display:flex; flex-direction:column;">
      <video autoplay playsinline muted></video>
      <div class="cam-controls">
        <button class="btn btn-ghost btn-sm cam-start" type="button" style="flex:1;">${Icon.cam} Activar cámara</button>
        <button class="btn btn-field btn-sm cam-shot" type="button" style="flex:1; display:none;">Tomar foto</button>
      </div>
    </div>`;
}
function camBoxHTML(id) {
  return `<div class="cam-box" id="${id}">${camLiveInnerHTML()}</div>`;
}

function bindChipGroup(container, { single = true } = {}) {
  const chips = $$('.choice-chip', container);
  chips.forEach(c => c.addEventListener('click', () => {
    if (single) chips.forEach(x => x.classList.remove('sel'));
    c.classList.toggle('sel');
  }));
  return { getSelected: () => chips.filter(c => c.classList.contains('sel')).map(c => c.dataset.code) };
}

function bindCamBox(id) {
  // El estado de la foto se guarda como propiedad del elemento (no en un
  // closure) para que getPhoto() siga siendo válido tras repetir la toma,
  // que reconstruye el contenido interno del cuadro.
  const box = document.getElementById(id);
  box._photoData = box._photoData || null;
  const video = $('video', box);
  const startBtn = $('.cam-start', box);
  const shotBtn = $('.cam-shot', box);
  if (!video) return { getPhoto: () => box._photoData };

  startBtn.addEventListener('click', async () => {
    try {
      await Cam.start(video);
      startBtn.style.display = 'none';
      shotBtn.style.display = 'block';
    } catch (e) {
      toast('No se pudo activar la cámara. Revise los permisos del navegador.', 'err');
    }
  });
  shotBtn.addEventListener('click', () => {
    box._photoData = Cam.snapshot(video);
    Cam.stop();
    box.innerHTML = `<div class="cam-shot-preview"><img src="${box._photoData}"><button class="retake" type="button">Repetir foto</button></div>`;
    $('.retake', box).addEventListener('click', () => {
      box._photoData = null;
      box.innerHTML = camLiveInnerHTML();
      bindCamBox(id);
    });
  });
  return { getPhoto: () => box._photoData };
}

function bindCoberturaScreen() {
  bindTabbar();
  const role = State.profile.role;
  const isSup = role === 'supervisor';
  const jornadaGroup = bindChipGroup($('#jornada-chips'));
  const reps = []; // { comboSeg / comboCue, chipsEstadoLev, chipsEstadoDig, camBinding }

  $('#c-generar').addEventListener('click', () => {
    const n = parseInt($('#c-n').value, 10);
    if (!n || n < 1) { requireField('#f-c-n', false, 'Ingrese un número entero mayor a 0.'); return; }
    requireField('#f-c-n', true, '');
    const wrap = $('#c-reps');
    wrap.innerHTML = '';
    reps.length = 0;
    for (let i = 0; i < n; i++) {
      wrap.insertAdjacentHTML('beforeend', isSup ? repItemSupervisorHTML(i) : repItemMlHTML(i));
    }
    if (isSup) {
      for (let i = 0; i < n; i++) {
        const item = $(`.rep-item[data-idx="${i}"]`);
        const seg = mountCombo(`cb-seg-${i}`, { list: () => Catalog.segmento_ma });
        const lev = bindChipGroup($('.rep-estado-lev', item));
        const dig = bindChipGroup($('.rep-estado-dig', item));
        reps.push({ seg, lev, dig, item });
      }
    } else {
      for (let i = 0; i < n; i++) {
        const item = $(`.rep-item[data-idx="${i}"]`);
        const cue = mountCombo(`cb-cue-${i}`, { list: () => Catalog.cuestionario_ml });
        const lev = bindChipGroup($('.rep-estado-lev-ml', item));
        const dig = bindChipGroup($('.rep-estado-dig-ml', item));
        const novedadBox = $('.rep-novedad', item);
        let cam = null;
        $('.rep-estado-lev-ml', item).addEventListener('click', (e) => {
          const chip = e.target.closest('.choice-chip');
          if (!chip) return;
          const efectiva = chip.dataset.efectiva === 'true';
          novedadBox.style.display = efectiva ? 'none' : 'block';
          if (!efectiva && !cam) cam = bindCamBox(`cam-${i}`);
        });
        reps.push({ cue, lev, dig, item, getCam: () => cam });
      }
    }
    $('#c-final').style.display = 'block';
  });

  $('#c-submit').addEventListener('click', async () => {
    const jornada = jornadaGroup.getSelected()[0];
    const nombre = $('#c-nombre').value.trim();
    let ok = true;
    if (!jornada) { toast('Seleccione la jornada.', 'err'); ok = false; }
    ok = requireField('#f-c-nombre', !!nombre, 'Campo obligatorio.') && ok;
    if (!reps.length) { toast('Genere los registros antes de guardar.', 'err'); ok = false; }

    const items = [];
    for (const r of reps) {
      if (isSup) {
        const segmento = r.seg.getCode();
        const enc = $('.rep-enc', r.item).value.trim();
        const lev = r.lev.getSelected()[0];
        const prod = $('.rep-prod', r.item).value;
        const dig = r.dig.getSelected()[0];
        const bad = !segmento || !enc || !lev || prod === '' || !dig;
        r.item.classList.toggle('complete', !bad);
        if (bad) ok = false;
        items.push({ segmento, encuestador: enc, estado_lev: lev, n_productores: Number(prod), estado_dig: dig });
      } else {
        const cuestionario = r.cue.getCode();
        const lev = r.lev.getSelected()[0];
        const dig = r.dig.getSelected()[0];
        const efectiva = lev ? Catalog.estado_lev_ml.find(e => e.c === lev)?.efectiva : null;
        let foto = null, detalle = '';
        if (efectiva === false) {
          const cam = r.getCam && r.getCam();
          foto = cam ? cam.getPhoto() : null;
          detalle = $('.rep-nov-detalle', r.item)?.value.trim() || '';
        }
        const bad = !cuestionario || !lev || !dig || (efectiva === false && (!foto || !detalle));
        r.item.classList.toggle('complete', !bad);
        r.item.classList.toggle('novedad', efectiva === false);
        if (bad) ok = false;
        items.push({ cuestionario, estado_lev_ml: lev, estado_dig_ml: dig, foto_novedad: foto, detalle_novedad: detalle });
      }
    }
    if (!ok) { toast('Complete todos los campos obligatorios de cada registro (incluida la foto de novedad si aplica).', 'err'); return; }

    const dISO = todayISO();
    const payload = {
      id: crypto.randomUUID(), _synced: false, _fecha: dISO,
      fecha: dISO, jornada, cargo: ROLE_META[role].cargoCobertura, nombre,
      id_personal: State.profile.id_personal, zona: State.profile.zona,
      items, observacion: $('#c-obs').value.trim(),
    };
    await dbAdd(isSup ? 'cobertura_ma' : 'cobertura_ml', payload);
    toast('Cobertura del día guardada correctamente.', 'ok');
    navigate('home');
  });
}

/* =========================================================================
   PANTALLA: Sincronización / ajustes
   ========================================================================= */
async function screenSyncHTML() {
  const counts = {};
  for (const st of SYNC_STORES) counts[st] = { total: await dbCount(st), pend: await dbCountPending(st) };
  const labels = { sedes: 'Sedes', plan_diario: 'Plan del día', georef: 'Georreferencia ML', cobertura_ma: 'Cobertura MA (supervisor)', cobertura_ml: 'Cobertura ML', tracking: 'Track de supervisión' };
  const endpoint = await Sync.getEndpoint();
  const lastSync = await Sync.getLastSyncAt();
  const totalPend = Object.values(counts).reduce((a, c) => a + c.pend, 0);

  return `
  ${topHeaderHTML('Sincronización y ajustes', 'sync')}
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

    <div class="card">
      <h3>Registros guardados en este dispositivo</h3>
      ${Object.entries(counts).map(([k, c]) => `
        <div class="sync-row"><span class="n">${labels[k]}</span>
          ${c.pend ? `<span class="pill-pending">${c.pend} pendientes</span>` : `<span class="pill-empty">${c.total} sincronizados</span>`}
        </div>
      `).join('')}
    </div>

    <button class="btn btn-primary" id="sync-now">${Icon.check} Sincronizar ahora${totalPend ? ` (${totalPend})` : ''}</button>
    <div id="sync-progress" class="hint" style="text-align:center; margin-top:8px;"></div>

    <button class="btn btn-ghost" id="sync-export" style="margin-top:14px;">Exportar respaldo (JSON)</button>
    <button class="btn btn-ghost" id="sync-profile" style="margin-top:10px;">Cambiar de perfil</button>
    <button class="btn btn-danger-ghost" id="sync-wipe" style="margin-top:10px;">Borrar todos los registros locales</button>

    <div class="app-credit">ESPAC 2026 · Campo<br>Desarrollado por Julio Márquez · WhatsApp 0962304236</div>
  </main>
  ${tabbarHTML('sync')}
  `;
}

function bindSyncScreen() {
  bindTabbar();

  $('#endpoint-save').addEventListener('click', async () => {
    const url = $('#endpoint-url').value.trim();
    const valid = /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(url);
    if (!requireField('#f-endpoint', valid, 'Ingrese una URL válida (https://…/exec).')) {
      toast('La URL no tiene el formato esperado de un despliegue de Apps Script.', 'err');
      return;
    }
    await Sync.setEndpoint(url);
    toast('URL del backend guardada.', 'ok');
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
      // No se navega de inmediato: así el detalle del error queda visible
      // en pantalla en vez de perderse al re-renderizar.
    }
  });

  $('#sync-export').addEventListener('click', async () => {
    const data = {};
    for (const st of SYNC_STORES) data[st] = await dbAll(st);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `espac_campo_${todayISO()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast('Respaldo exportado.', 'ok');
  });
  $('#sync-profile').addEventListener('click', () => navigate('profile', { editing: true }));
  $('#sync-wipe').addEventListener('click', async () => {
    if (!confirm('¿Borrar todos los registros locales? Esta acción no se puede deshacer.')) return;
    for (const st of SYNC_STORES) await dbClearStore(st);
    toast('Registros locales eliminados.', 'ok');
    navigate('home');
  });
}

/* --------------------------------------------------------- header común */
function topHeaderHTML(title, key) {
  return `
  <div class="topbar">
    <div class="topbar-row">
      <button class="icon-btn" id="btn-back">${Icon.back}</button>
      <div class="brand" style="align-items:flex-end; text-align:right;"><b>${title}</b><span>${ROLE_META[State.profile.role].label}</span></div>
    </div>
  </div>`;
}
function bindBack() { $('#btn-back')?.addEventListener('click', () => navigate('home')); }

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
    case 'sedes':
      main.innerHTML = screenSedesHTML(); bindBack(); bindSedesScreen(); break;
    case 'plan':
      main.innerHTML = screenPlanHTML(); bindBack(); bindPlanScreen(); break;
    case 'georef':
      main.innerHTML = screenGeorefHTML(); bindBack(); bindGeorefScreen(); break;
    case 'cobertura':
      main.innerHTML = screenCoberturaHTML(); bindBack(); bindCoberturaScreen(); break;
    case 'sync':
      main.innerHTML = await screenSyncHTML(); bindBack(); bindSyncScreen(); break;
    case 'home':
    default:
      main.innerHTML = await screenHomeHTML(); bindHomeScreen(); break;
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
}
document.addEventListener('DOMContentLoaded', boot);
