const G = window.GUIDE;
const STORAGE = {
  done: 'tssr-done',
  fav: 'tssr-fav',
  theme: 'tssr-theme',
  qhistory: 'tssr-qhistory',
  settings: 'tssr-settings'
};
const state = {
  tab: 'cours',
  section: (G.sections && G.sections[0]) ? G.sections[0].id : null,
  q: '',
  level: '',
  favOnly: false,
  glossaryQ: '',
  cheatCat: 'Tous',
  cheatQ: '',
  qcm: {
    setup: null,
    active: false,
    questions: [],
    index: 0,
    answers: {},
    timer: null,
    remaining: 0,
    useTimer: false,
    startedAt: 0
  }
};

function lsGet(key, fallback){ try { const raw = localStorage.getItem(key); if (raw === null) return fallback; return JSON.parse(raw); } catch(e){ return fallback; } }
function lsSet(key, value){ try { localStorage.setItem(key, JSON.stringify(value)) } catch(e){} }
function doneSet(){ return new Set(lsGet(STORAGE.done, [])); }
function favSet(){ return new Set(lsGet(STORAGE.fav, [])); }
function saveDone(set){ lsSet(STORAGE.done, [...set]); }
function saveFav(set){ lsSet(STORAGE.fav, [...set]); }
function escapeHtml(s){ return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function formatInline(s){
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/`([^`]+)`/g,'<code>$1</code>');
}
function badgeLevel(level){
  const map = { debutant:'level-debutant', intermediaire:'', avance:'level-avance', exam:'level-exam' };
  const labels = { debutant:'Débutant', intermediaire:'Intermédiaire', avance:'Avancé', exam:'Examen' };
  return `<span class="badge ${map[level]||''}">${labels[level]||level||''}</span>`;
}

/* ---------- theme ---------- */
function applyTheme(){
  const t = localStorage.getItem(STORAGE.theme) || 'dark';
  document.documentElement.classList.toggle('light', t === 'light');
}
function toggleTheme(){
  const cur = localStorage.getItem(STORAGE.theme) || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE.theme, next);
  applyTheme();
  toast(next === 'light' ? 'Thème clair' : 'Thème sombre','ok');
}

/* ---------- toast ---------- */
function toast(msg, type='ok'){
  const stack = document.querySelector('.toast-stack') || (()=>{const d=document.createElement('div');d.className='toast-stack';document.body.appendChild(d);return d;})();
  const t = document.createElement('div');
  t.className = 'toast ' + (type==='warn'?'warn':'ok');
  t.innerHTML = escapeHtml(msg);
  stack.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(20px)'; setTimeout(()=>t.remove(),250)},2600);
}

/* ---------- progress ---------- */
function updBar(){
  const total = G.sections.reduce((a,s)=>a + (s.fiches||[]).length,0);
  const done = doneSet().size;
  const bar = document.querySelector('#progressBar i');
  const txt = document.querySelector('#progressText');
  if (bar) bar.style.width = Math.round(done/total*100) + '%';
  if (txt) txt.textContent = `${done}/${total} lues · ${Math.round(done/total*100)}%`;
  const topPct = document.querySelector('#progressTextTop');
  if (topPct) topPct.textContent = `${done}/${total}`;
}
function markFiche(key, checked){
  const set = doneSet();
  if (checked) set.add(key); else set.delete(key);
  saveDone(set);
  updBar();
  renderProgress();
}
function toggleFav(key){
  const set = favSet();
  if (set.has(key)) set.delete(key); else set.add(key);
  saveFav(set);
  // rerender current fiche card border
  const el = document.querySelector(`[data-key="${CSS.escape(key)}"]`);
  if (el) el.classList.toggle('favorite', set.has(key));
  const btn = el && el.querySelector('.favorite-btn');
  if (btn){ btn.classList.toggle('on', set.has(key)); btn.textContent = set.has(key) ? '★ Favori' : '☆ Favori'; }
  renderProgress();
}

/* ---------- sidebar ---------- */
function buildMenu(){
  const m = document.getElementById('menu');
  m.innerHTML = '';
  const favs = favSet();
  // group sections by .group
  let currentGroup = null;
  G.sections.forEach(sec=>{
    if (sec.group !== currentGroup){
      currentGroup = sec.group;
      const h = document.createElement('div');
      h.className = 'grp';
      h.textContent = currentGroup;
      m.appendChild(h);
    }
    const ficheCount = (sec.fiches||[]).length;
    const a = document.createElement('div');
    a.className = 'navlink' + (sec.id === state.section ? ' on' : '');
    a.dataset.section = sec.id;
    a.innerHTML = `<span>${escapeHtml(sec.icon||'•')} ${escapeHtml(sec.title)}</span><span class="count">${ficheCount}</span>`;
    a.onclick = ()=> selectSection(sec.id);
    m.appendChild(a);
  });
}
function selectSection(id){
  state.section = id;
  document.querySelectorAll('.navlink').forEach(x=>x.classList.remove('on'));
  const a = document.querySelector(`.navlink[data-section="${CSS.escape(id)}"]`);
  if (a) a.classList.add('on');
  renderCours();
  if (window.innerWidth < 980) document.getElementById('sidebar').classList.remove('open');
}
function filterMenu(){
  const m = document.getElementById('menu');
  // rebuild simple by visibility
  const f = state.q.trim().toLowerCase();
  m.querySelectorAll('.navlink').forEach(a=>{
    const id = a.dataset.section;
    const sec = G.sections.find(s=>s.id===id);
    const hay = (sec.title + ' ' + JSON.stringify(sec.fiches||[])).toLowerCase();
    a.style.display = (!f || hay.includes(f)) ? '' : 'none';
  });
}

/* ---------- tabs ---------- */
function switchTab(tab){
  state.tab = tab;
  document.querySelectorAll('.tab').forEach(b=>{ b.classList.toggle('on', b.dataset.tab===tab); b.setAttribute('aria-selected', b.dataset.tab===tab); });
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('on', p.dataset.panel===tab));
  renderActiveTab();
}
function renderActiveTab(){
  if (state.tab === 'cours') renderCours();
  else if (state.tab === 'qcm') renderQCM();
  else if (state.tab === 'labos') renderLabos();
  else if (state.tab === 'glossaire') renderGlossary();
  else if (state.tab === 'cheat') renderCheat();
}

/* ---------- fiche matching ---------- */
function matchesFiche(f, sec){
  const q = state.q.trim().toLowerCase();
  if (state.level && f.level !== state.level) return false;
  if (state.favOnly){ const favs=favSet(); if (!favs.has(sec.id+':'+f.id)) return false; }
  if (!q) return true;
  const hay = [sec.title, f.t, f.r, (f.g||[]).join(' '), f.c, (f.p||[]).join(' '), (f.tags||[]).join(' ')].join(' ').toLowerCase();
  return hay.includes(q);
}
function sectionHasMatch(sec){ return (sec.fiches||[]).some(f=>matchesFiche(f,sec)); }

/* ---------- cours ---------- */
function renderCours(){
  const panel = document.querySelector('[data-panel="cours"]');
  const done = doneSet(); const favs = favSet();
  let html = '';
  if (state.q.trim()){
    html += `<div class="hero"><h1>🔎 Résultats de recherche</h1><p>Terme : <strong>${escapeHtml(state.q)}</strong></p></div>`;
    let found=0;
    G.sections.forEach(sec=>{
      const ms = (sec.fiches||[]).filter(f=>matchesFiche(f,sec));
      if (!ms.length) return;
      found += ms.length;
      html += `<h2 class="grp-title">${escapeHtml(sec.icon||'')} ${escapeHtml(sec.title)}</h2>`;
      html += ms.map((f,i)=> renderFiche(sec,f,sec.fiches.indexOf(f),done,favs)).join('');
    });
    if (!found) html += `<div class="card"><p class="muted">Aucun résultat. Essayez un autre mot-clé.</p></div>`;
  } else {
    const sec = G.sections.find(s=>s.id===state.section) || G.sections[0];
    html += `<div class="hero"><h1>${escapeHtml(sec.icon||'')} ${escapeHtml(sec.title)}</h1><p>${escapeHtml(sec.desc||'')}</p><p class="muted small">${(sec.fiches||[]).length} fiches · ${escapeHtml(sec.group||'')}</p></div>`;
    const ms = (sec.fiches||[]).filter(f=>matchesFiche(f,sec));
    if (!ms.length) html += `<div class="card"><p class="muted">Aucune fiche avec ces filtres.</p></div>`;
    else html += ms.map(f=> renderFiche(sec,f,sec.fiches.indexOf(f),done,favs)).join('');
  }
  panel.innerHTML = html;
  // wire clipboard and tabs via delegation (already)
  updBar();
}

function ficheKey(secId, f, index){
  // stable key using f.id when possible
  return secId + ':' + (f.id || index);
}
function renderFiche(sec, f, index, done, favs){
  const key = ficheKey(sec.id, f, index);
  const isDone = done.has(key);
  const isFav = favs.has(key);
  const tags = (f.tags||[]).map(t=>`<span class="badge">${escapeHtml(t)}</span>`).join('');
  const gui = (f.g||[]).map(s=>`<li>${formatInline(s)}</li>`).join('');
  const pts = (f.p||[]).map(s=>`<li>${formatInline(s)}</li>`).join('');
  const code = escapeHtml(f.c || '—');
  return `
  <article class="card ${isDone?'read':''} ${isFav?'favorite':''}" data-key="${escapeHtml(key)}" data-index="${index}">
    <div class="badges">${badgeLevel(f.level)} ${tags}</div>
    <h3>${escapeHtml(f.t)}</h3>
    <p class="summary">${formatInline(f.r||'')}</p>
    <div class="tabs-mode">
      <button class="on" data-mode="gui">🖱️ GUI</button>
      <button data-mode="cli">⌨️ CLI</button>
    </div>
    <div class="block-gui content-block">
      <ol class="gui">${gui || '<li class="muted">—</li>'}</ol>
    </div>
    <div class="block-cli content-block" style="display:none">
      <div class="CodeBox">
        <button class="copy-btn">Copier</button>
        <pre><code>${code}</code></pre>
      </div>
    </div>
    ${pts ? `<ul class="pts">${pts}</ul>` : ''}
    ${f.w ? `<div class="warn-box">⚠️ ${formatInline(f.w)}</div>` : ''}
    <div class="label-row">
      <label class="check"><input type="checkbox" data-key="${escapeHtml(key)}" ${isDone?'checked':''}> Marquer comme lue</label>
      <button class="favorite-btn ${isFav?'on':''}" data-key="${escapeHtml(key)}">${isFav?'★ Favori':'☆ Favori'}</button>
    </div>
  </article>`;
}

/* delegation for cours */
document.addEventListener('click', e=>{
  // copier une commande en cliquant sur la première cellule d'un tableau cheat
  const cell = e.target.closest('.cheat-table tbody td:first-child');
  if (cell) {
    navigator.clipboard.writeText(cell.innerText).then(()=>{ cell.style.background='rgba(56,189,248,.25)'; setTimeout(()=>cell.style.background='',600); toast('Commande copiée','ok'); }).catch(()=>{});
    return;
  }
  // tab main
  const tab = e.target.closest('.tab');
  if (tab && tab.dataset.tab){ switchTab(tab.dataset.tab); return; }
  // sidebar toggle
  if (e.target.closest('#menuToggle')){ document.getElementById('sidebar').classList.toggle('open'); return; }
  // brand click -> home
  if (e.target.closest('.brand')){ state.section = (G.sections[0]||{}).id; switchTab('cours'); buildMenu(); selectSection(state.section); return; }
  // theme/export
  if (e.target.closest('#themeToggle')){ toggleTheme(); return; }
  // favorite
  const favBtn = e.target.closest('.favorite-btn');
  if (favBtn){ toggleFav(favBtn.dataset.key); return; }
  // doc export
  const docBtn = e.target.closest('.doc-btn');
  if (docBtn){ exportFiche(docBtn.dataset.doc); return; }
  // mode tabs
  const modeBtn = e.target.closest('.tabs-mode button');
  if (modeBtn){
    const card = modeBtn.closest('.card');
    modeBtn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('on'));
    modeBtn.classList.add('on');
    const cli = modeBtn.dataset.mode === 'cli';
    card.querySelector('.block-gui').style.display = cli ? 'none' : '';
    card.querySelector('.block-cli').style.display = cli ? '' : 'none';
    return;
  }
  // copy
  const cp = e.target.closest('.copy-btn');
  if (cp){
    const code = cp.parentElement.querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(()=>{ cp.textContent='Copié !'; setTimeout(()=>cp.textContent='Copier',1200); toast('Code copié','ok');});
    return;
  }
  // sidebar nav already native onclick
});
document.addEventListener('change', e=>{
  if (e.target.matches('input[type=checkbox][data-key]')){
    markFiche(e.target.dataset.key, e.target.checked);
    const card = e.target.closest('.card');
    if (card) card.classList.toggle('read', e.target.checked);
  }
});

/* ---------- search/filter inputs ---------- */
function wireFilters(){
  const q = document.getElementById('q');
  q.addEventListener('input', ()=>{ state.q = q.value; filterMenu(); renderActiveTab(); });
  const lvl = document.getElementById('levelFilter');
  lvl.addEventListener('change', ()=>{ state.level = lvl.value; renderActiveTab(); });
  const favBtn = document.getElementById('favoritesOnly');
  favBtn.addEventListener('click', ()=>{ state.favOnly = !state.favOnly; favBtn.classList.toggle('on', state.favOnly); renderActiveTab(); });
  document.getElementById('markAllRead').addEventListener('click', ()=>{
    const sec = G.sections.find(s=>s.id===state.section);
    if (!sec) return;
    const set = doneSet();
    sec.fiches.forEach((f,i)=> set.add(ficheKey(sec.id,f,i)));
    saveDone(set); updBar(); renderCours(); renderProgress(); toast('Tout marqué comme lu','ok');
  });
  document.getElementById('resetProgress').addEventListener('click', ()=>{
    if (!confirm('Réinitialiser la progression et les favoris ?')) return;
    localStorage.removeItem(STORAGE.done); localStorage.removeItem(STORAGE.fav); localStorage.removeItem(STORAGE.qhistory);
    updBar(); renderActiveTab(); renderProgress(); toast('Progression réinitialisée','warn');
  });
}
function exportProgress(){
  const data = { done:[...doneSet()], fav:[...favSet()], qhistory: lsGet(STORAGE.qhistory,[]), exportedAt:new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='tssr-progress.json'; a.click();
  URL.revokeObjectURL(url);
  toast('Progression exportée','ok');
}
function exportFiche(key){
  // find fiche
  for (const sec of G.sections){
    const idx = (sec.fiches||[]).findIndex((f,i)=> ficheKey(sec.id,f,i)===key);
    if (idx !== -1){
      const f = sec.fiches[idx];
      const md = `# ${f.t}\n\n${f.r}\n\n## GUI\n${(f.g||[]).map(x=>'- '+x).join('\n')}\n\n## CLI\n\`\`\`\n${f.c||''}\n\`\`\`\n\n## Points\n${(f.p||[]).map(x=>'- '+x).join('\n')}\n\n${f.w?'⚠️ '+f.w:''}`;
      const blob = new Blob([md],{type:'text/markdown'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download=`${(f.t||'fiche').replace(/[^a-z0-9]/gi,'_')}.md`; a.click();
      URL.revokeObjectURL(url);
      toast('Fiche exportée en Markdown','ok');
      return;
    }
  }
}

/* ---------- QCM ---------- */
function renderQCM(){
  const panel = document.querySelector('[data-panel="qcm"]');
  if (state.qcm.active) return renderQCMQuestion(panel);
  const sections = G.sections;
  const history = lsGet(STORAGE.qhistory, []);
  const best = history.length ? Math.max(...history.map(h=>h.score)) : 0;
  let html = `<div class="hero"><h1>📝 QCM & entraînement</h1><p>Banque : ${G.quizzes.length} questions · Dernier score max : ${best}%</p></div>`;
  html += `<div class="qcm-setup">
    <h3>Configuration</h3>
    <div class="button-row" style="flex-wrap:wrap">
      <select id="qcmSection" class="select">
        <option value="all">Toutes les sections</option>
        ${sections.map(s=>`<option value="${escapeHtml(s.id)}">${escapeHtml(s.icon||'')} ${escapeHtml(s.title)}</option>`).join('')}
      </select>
      <select id="qcmCount" class="select">
        <option value="10">10 questions</option>
        <option value="20" selected>20 questions</option>
        <option value="40">40 questions</option>
        <option value="999">Toutes</option>
      </select>
      <select id="qcmDiff" class="select">
        <option value="all">Toutes difficultés</option>
        <option value="facile">Facile</option>
        <option value="moyen">Moyen</option>
        <option value="avance">Avancé</option>
        <option value="exam">Examen</option>
      </select>
    </div>
    <label class="check" style="margin-top:10px"><input type="checkbox" id="qcmTimer"> Minuterie (30s par question)</label>
    <div style="margin-top:12px"><button class="icon-btn" id="qcmStart" style="background:var(--acc);color:#020617;font-weight:700;border:0">Lancer le QCM</button></div>
  </div>`;
  if (history.length){
    html += `<div class="card"><h3>📊 Historique</h3><ul class="pts">${history.slice(-8).reverse().map(h=>`<li>${new Date(h.date).toLocaleString('fr-FR')} — ${h.score}% (${h.correct}/${h.total}) · ${escapeHtml(h.section||'global')}</li>`).join('')}</ul></div>`;
  }
  panel.innerHTML = html;
  document.getElementById('qcmStart').onclick = startQCM;
}
function startQCM(){
  const sec = document.getElementById('qcmSection').value;
  const count = parseInt(document.getElementById('qcmCount').value,10);
  const diff = document.getElementById('qcmDiff').value;
  const useTimer = document.getElementById('qcmTimer').checked;
  let pool = G.quizzes.slice();
  if (sec !== 'all') pool = pool.filter(q=>q.section===sec);
  if (diff !== 'all') pool = pool.filter(q=>q.difficulty===diff);
  if (!pool.length){ toast('Aucune question pour ces filtres','warn'); return; }
  // shuffle
  pool = shuffle(pool);
  const n = count >= 999 ? pool.length : Math.min(count, pool.length);
  state.qcm.questions = pool.slice(0,n);
  state.qcm.index = 0;
  state.qcm.answers = {};
  state.qcm.active = true;
  state.qcm.useTimer = useTimer;
  state.qcm.startedAt = Date.now();
  state.qcm.score = 0;
  clearInterval(state.qcm.timer);
  renderQCMQuestion(document.querySelector('[data-panel="qcm"]'));
}
function shuffle(arr){ const a=arr.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function renderQCMQuestion(panel){
  const qs = state.qcm.questions;
  const i = state.qcm.index;
  if (i >= qs.length){ return renderQCMResult(panel); }
  const q = qs[i];
  const progress = Math.round(i/qs.length*100);
  let html = `<div class="hero"><h1>Question ${i+1}/${qs.length}</h1><div class="q-progressbar"><i style="width:${progress}%"></i></div>${state.qcm.useTimer?`<p class="timer" id="qcmTimerVal">⏱️ 30</p>`:''}</div>`;
  html += `<div class="qcm-session">
    <p><strong>${escapeHtml(q.q)}</strong></p>
    ${q.choices.map((c,ci)=>`<button class="q-option" data-ci="${ci}">${escapeHtml(c)}</button>`).join('')}
    <div class="q-explain" id="qcmExplain" style="display:none"></div>
    <div class="button-row" style="margin-top:12px">
      <button class="ghost-btn" id="qcmSkip">Passer</button>
      <button class="icon-btn" id="qcmNext" style="display:none;background:var(--acc);color:#020617;font-weight:700;border:0">Suivant ➜</button>
    </div>
  </div>`;
  panel.innerHTML = html;
  // timer
  if (state.qcm.useTimer){
    state.qcm.remaining = 30;
    clearInterval(state.qcm.timer);
    state.qcm.timer = setInterval(()=>{
      state.qcm.remaining--;
      const el = document.getElementById('qcmTimerVal');
      if (el) el.textContent = '⏱️ ' + state.qcm.remaining;
      if (state.qcm.remaining <= 0){
        clearInterval(state.qcm.timer);
        // auto mark unanswered as wrong? just show answer then next
        markAnswer(-1);
      }
    },1000);
  }
  panel.querySelectorAll('.q-option').forEach(b=>{
    b.onclick = ()=> markAnswer(parseInt(b.dataset.ci,10));
  });
  document.getElementById('qcmNext').onclick = ()=>{ state.qcm.index++; renderQCMQuestion(panel); };
  document.getElementById('qcmSkip').onclick = ()=>{ state.qcm.answers[i] = null; state.qcm.index++; renderQCMQuestion(panel); };
}
function markAnswer(ci){
  clearInterval(state.qcm.timer);
  const i = state.qcm.index;
  const q = state.qcm.questions[i];
  if (state.qcm.answers[i] !== undefined) return;
  state.qcm.answers[i] = ci;
  const opts = document.querySelectorAll('.q-option');
  opts.forEach((b,ci2)=>{
    b.disabled = true;
    if (ci2 === q.answer) b.classList.add('correct');
    if (ci === ci2 && ci !== q.answer) b.classList.add('wrong');
  });
  const expl = document.getElementById('qcmExplain');
  const correctText = q.choices[q.answer];
  const isCorrect = ci === q.answer;
  if (isCorrect) state.qcm.score = (state.qcm.score||0)+1;
  expl.style.display = '';
  expl.innerHTML = `<strong>${isCorrect?'✅ Correct':'❌ Incorrect'}${ci===-1?' (temps écoulé)':''}</strong> — Réponse : ${escapeHtml(correctText)}<br>${escapeHtml(q.explain||'')}`;
  document.getElementById('qcmNext').style.display = '';
}
function renderQCMResult(panel){
  const qs = state.qcm.questions;
  const total = qs.length;
  const correct = Object.values(state.qcm.answers).filter((a,idx)=> a === qs[idx]?.answer).length;
  const score = Math.round(correct/total*100);
  const wrong = qs.map((q,idx)=>({q,idx,ans:state.qcm.answers[idx]})).filter(x=> x.ans !== x.q.answer);
  // save history
  const history = lsGet(STORAGE.qhistory, []);
  history.push({ date: new Date().toISOString(), score, correct, total, section: document.getElementById('qcmSection')?.value || 'global' });
  lsSet(STORAGE.qhistory, history.slice(-50));
  let html = `<div class="hero"><h1>🏆 Résultat</h1><p>Score : <strong>${score}%</strong> (${correct}/${total})</p></div>`;
  html += `<div class="qcm-result">
    <div class="stat-grid">
      <div class="stat"><div class="big">${score}%</div><div>Réussite</div></div>
      <div class="stat"><div class="big">${correct}</div><div>Correctes</div></div>
      <div class="stat"><div class="big">${wrong.length}</div><div>À revoir</div></div>
    </div>
    <div class="button-row"><button class="icon-btn" id="qcmRestart" style="background:var(--acc);color:#020617;font-weight:700;border:0">Rejouer</button>
    <button class="ghost-btn" id="qcmSetupBtn">Nouveau paramétrage</button></div>
    ${wrong.length?`<h3>Questions à revoir</h3>`+wrong.map(w=>`<div class="card" style="border-left-color:var(--danger)"><h3>${escapeHtml(w.q.q)}</h3><p class="muted">Votre réponse : ${escapeHtml(w.q.choices[w.ans] ?? '—')} · Bonne : ${escapeHtml(w.q.choices[w.q.answer])}</p><div class="q-explain">${escapeHtml(w.q.explain||'')}</div></div>`).join(''):''}
  </div>`;
  panel.innerHTML = html;
  document.getElementById('qcmRestart').onclick = ()=>{ state.qcm.index=0; state.qcm.answers={}; state.qcm.active=true; renderQCMQuestion(panel); };
  document.getElementById('qcmSetupBtn').onclick = ()=>{ state.qcm.active=false; state.qcm.questions=[]; renderQCM(); };
  state.qcm.active = false; // reset for setup view next but keep result
  // actually keep active false
}

/* ---------- labos ---------- */
function renderLabos(){
  const panel = document.querySelector('[data-panel="labos"]');
  const q = state.q.trim().toLowerCase();
  let labs = G.labs || [];
  if (q) labs = labs.filter(l=> (l.title+l.objective+(l.steps||[]).join(' ')).toLowerCase().includes(q));
  let html = `<div class="hero"><h1>🧪 Labos pratiques</h1><p>${labs.length} labos · Objectifs, étapes, validation, dépannage.</p></div>`;
  html += labs.map(l=>`
    <div class="lab-card">
      <h3>${escapeHtml(l.title)}</h3>
      <div class="badges">${badgeLevel(l.level)} <span class="badge">${escapeHtml(l.duration||'')}</span> <span class="badge">${escapeHtml(l.section||'')}</span></div>
      <p><strong>Objectif :</strong> ${escapeHtml(l.objective)}</p>
      ${l.prerequisites?`<p class="muted small"><strong>Prérequis :</strong> ${escapeHtml((l.prerequisites||[]).join(', '))}</p>`:''}
      <h4>Étapes</h4>
      <div>${(l.steps||[]).map((s,i)=>`<div class="step"><div class="num">${i+1}</div><div>${formatInline(s)}</div></div>`).join('')}</div>
      ${l.validation?`<h4>Validation</h4><ul class="pts">${(l.validation||[]).map(s=>`<li>${formatInline(s)}</li>`).join('')}</ul>`:''}
      ${l.troubleshooting?`<div class="warn-box">Dépannage : ${(l.troubleshooting||[]).map(escapeHtml).join(' · ')}</div>`:''}
    </div>`).join('');
  if (!labs.length) html += `<div class="card"><p class="muted">Aucun labo pour ce filtre.</p></div>`;
  panel.innerHTML = html;
}

/* ---------- glossaire ---------- */
function renderGlossary(){
  const panel = document.querySelector('[data-panel="glossaire"]');
  const q = (state.glossaryQ || state.q || '').trim().toLowerCase();
  let items = G.glossary || [];
  if (q) items = items.filter(g=> (g.term+g.def+g.cat).toLowerCase().includes(q));
  const wasFocused = document.activeElement && document.activeElement.id === 'glossarySearch';
  const caret = wasFocused ? document.activeElement.selectionStart : null;
  // group by first letter
  const groups = {};
  items.forEach(g=>{ const k = (g.term||'?')[0].toUpperCase(); (groups[k]||(groups[k]=[])).push(g); });
  let html = `<div class="hero"><h1>📖 Glossaire</h1><p>${items.length} termes · recherche par mot-clé dans la barre latérale ou ci-dessous.</p></div>`;
  html += `<div style="margin:10px 0 16px"><input type="search" id="glossarySearch" class="search" placeholder="Rechercher un terme dans le glossaire…" value="${escapeHtml(state.glossaryQ||'')}"></div>`;
  Object.keys(groups).sort().forEach(letter=>{
    html += `<h2>${letter}</h2>`;
    html += groups[letter].map(g=>`
      <div class="glossary-item">
        <h4>${escapeHtml(g.term)} <span class="badge">${escapeHtml(g.cat||'')}</span></h4>
        <p class="muted">${formatInline(g.def)}</p>
      </div>`).join('');
  });
  if (!items.length) html += `<div class="card"><p class="muted">Aucun terme.</p></div>`;
  panel.innerHTML = html;
  const gi = document.getElementById('glossarySearch');
  if (gi) {
    gi.addEventListener('input', e => { state.glossaryQ = e.target.value; renderGlossary(); });
    if (wasFocused && caret !== null) { gi.focus(); try { gi.setSelectionRange(caret, caret); } catch(err){} }
  }
}

/* ---------- cheat categories ---------- */
function cheatCategory(c){
  const t = (c.title || '').toLowerCase();
  if (t.includes('sauvegarde') || t.includes('backup') || t.includes('archive') || t.includes('borg') || t.includes('restic')) return 'Sauvegardes';
  if (t.includes('cisco')) return 'Cisco';
  if (t.includes('linux') || t.includes('bash')) return 'Linux';
  if (t.includes('windows') || t.includes('powershell') || t.includes('cmd')) return 'Windows';
  if (t.includes('web') || t.includes('apache') || t.includes('nginx') || t.includes('sql') || t.includes('base') || t.includes('donnée') || t.includes('database')) return 'Serveur web et base de données';
  return 'Réseau';
  if (t.includes('linux')) return 'Linux';
  if (t.includes('cisco')) return 'Cisco';
  if (t.includes('windows cmd') || t.includes('windows server') || t.includes('windows /')) return 'Windows';
  if (t.includes('subnet') || t.includes('ports') || t.includes('réseau') || t.includes('reseau') || t.includes('diagnostic')) return 'Réseau';
  if (t.includes('docker') || t.includes('kubernetes')) return 'Docker';
  if (t.includes('git')) return 'Git';
  if (t.includes('sql') || t.includes('base de données') || t.includes('postgresql') || t.includes('mysql')) return 'Bases de données';
  if (t.includes('apache') || t.includes('nginx') || t.includes('web')) return 'Web';
  if (t.includes('vmware') || t.includes('hyper-v') || t.includes('virtualisation')) return 'Virtualisation';
  if (t.includes('sécurité') || t.includes('securite') || t.includes('openssl') || t.includes('certificat')) return 'Sécurité';
  if (t.includes('sauvegarde') || t.includes('backup') || t.includes('archive')) return 'Sauvegarde';
  if (t.includes('ansible') || t.includes('terraform') || t.includes('iac')) return 'IaC';
  if (t.includes('supervision') || t.includes('observabilité') || t.includes('grafana') || t.includes('prometheus')) return 'Supervision';
  if (t.includes('pfsense') || t.includes('pare-feu')) return 'Pare-feu';
  if (t.includes('wireshark')) return 'Réseau';
  return 'Autres';
}

/* ---------- cheat ---------- */
function renderCheat(){
  const panel = document.querySelector('[data-panel="cheat"]');
  const q = (state.cheatQ || '').trim().toLowerCase();
  const allCats = new Set((G.cheats||[]).map(cheatCategory));
  const priority = ['Réseau','Cisco','Linux','Windows','Serveur web et base de données','Sauvegardes'];
  const ordered = ['Tous', ...priority.filter(c=>allCats.has(c)), ...[...allCats].filter(c=> c!=='Tous' && !priority.includes(c)).sort((a,b)=>a.localeCompare(b,'fr'))];
  if (!ordered.includes(state.cheatCat)) state.cheatCat = 'Tous';

  let html = `<div class="hero"><h1>🧾 Cheat sheets</h1><p>Aide-mémoire de commande. Recherchez une commande ci-dessous.</p></div>`;
  html += `<div style="margin:10px 0 14px"><input type="search" id="cheatSearch" class="search" placeholder="Rechercher une commande (ex: nmap, systemctl, ipconfig)…" value="${escapeHtml(state.cheatQ||'')}"></div>`;

  if (q) {
    const matches = [];
    (G.cheats||[]).forEach(c=>{
      (c.rows||[]).forEach(r=>{
        const hay = [c.title, c.intro||'', ...r].join(' ').toLowerCase();
        if (hay.includes(q)) matches.push({ sheet: c.title, row: r });
      });
    });
    html += `<div class="card"><h3>🔎 ${matches.length} commande(s) trouvée(s)</h3>
      <table class="cheat-table"><thead><tr><th>Commande</th><th>Usage</th><th>Source</th></tr></thead><tbody>
      ${matches.map(m=>`<tr><td>${formatInline(m.row[0]||'')}</td><td>${formatInline(m.row[1]||'')}</td><td class="muted small">${escapeHtml(m.sheet)}</td></tr>`).join('')}
      </tbody></table></div>`;
    if (!matches.length) html += `<div class="card"><p class="muted">Aucune commande trouvée pour « ${escapeHtml(state.cheatQ)} ».</p></div>`;
  } else {
    if (allCats.size > 1) {
      html += `<div class="tabs-mode" id="cheatCats">` + ordered.map(cat=>`<button data-cat="${escapeHtml(cat)}" class="${cat===state.cheatCat?'on':''}">${escapeHtml(cat)}</button>`).join('') + `</div>`;
    }
    const list = state.cheatCat === 'Tous' ? (G.cheats||[]) : (G.cheats||[]).filter(c=>cheatCategory(c)===state.cheatCat);
    list.forEach(c=>{
      html += `<div class="card"><h3>${escapeHtml(c.title)}</h3><p class="muted small">${escapeHtml(c.intro||'')}</p>
        <table class="cheat-table"><thead><tr>${(c.columns||[]).map(col=>`<th>${escapeHtml(col)}</th>`).join('')}</tr></thead><tbody>
        ${(c.rows||[]).map(r=>`<tr>${r.map(cell=>`<td>${formatInline(cell)}</td>`).join('')}</tr>`).join('')}
        </tbody></table></div>`;
    });
    if (!list.length) html += `<div class="card"><p class="muted">Aucune cheat sheet dans cette catégorie.</p></div>`;
  }

  panel.innerHTML = html;
  const search = document.getElementById('cheatSearch');
  if (search) {
    search.addEventListener('input', e => { state.cheatQ = e.target.value; renderCheat(); });
    if (state.cheatQ) { search.focus(); try { search.setSelectionRange(state.cheatQ.length, state.cheatQ.length); } catch(err){} }
  }
  panel.querySelectorAll('#cheatCats button').forEach(b=>{
    b.onclick = ()=>{ state.cheatCat = b.dataset.cat; renderCheat(); };
  });
}

/* ---------- methods ---------- */
function renderMethods(){
  const panel = document.querySelector('[data-panel="methodes"]');
  let html = `<div class="hero"><h1>🧭 Méthodes & plans</h1><p>Démarches pour l'examen et le travail.</p></div>`;
  (G.methods||[]).forEach(m=>{
    html += `<div class="card"><h3>${escapeHtml(m.title)} <span class="badge">${escapeHtml(m.type||'')}</span></h3><ol class="gui">${(m.steps||[]).map(s=>`<li>${formatInline(s)}</li>`).join('')}</ol></div>`;
  });
  panel.innerHTML = html;
}

/* ---------- resources ---------- */
function renderResources(){
  const panel = document.querySelector('[data-panel="ressources"]');
  let html = `<div class="hero"><h1>🔗 Ressources</h1><p>Liens utiles pour aller plus loin.</p></div>`;
  (G.resources||[]).forEach(r=>{
    html += `<div class="card"><h3>${escapeHtml(r.title)}</h3><p class="muted">${escapeHtml(r.desc||'')}</p><p><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener">Ouvrir ↗</a></p></div>`;
  });
  panel.innerHTML = html;
}

/* ---------- progression ---------- */
function renderProgress(){
  const panel = document.querySelector('[data-panel="progression"]');
  const total = G.sections.reduce((a,s)=>a+(s.fiches||[]).length,0);
  const done = doneSet(); const favs = favSet();
  const read = done.size;
  const pct = Math.round(read/total*100);
  const bySection = G.sections.map(sec=>{
    const n = (sec.fiches||[]).length;
    const r = (sec.fiches||[]).filter((f,i)=> done.has(ficheKey(sec.id,f,i))).length;
    return {sec,r,n,pct: n?Math.round(r/n*100):0};
  });
  const complete = bySection.filter(x=>x.r===x.n && x.n>0).length;
  const history = lsGet(STORAGE.qhistory, []);
  const best = history.length ? Math.max(...history.map(h=>h.score)) : 0;
  let html = `<div class="hero"><h1>📊 Progression & statistiques</h1><p>Suivi local dans le navigateur.</p></div>`;
  html += `<div class="stat-grid">
    <div class="stat"><div class="big">${read}</div><div>Fiches lues</div></div>
    <div class="stat"><div class="big">${pct}%</div><div>Avancement</div></div>
    <div class="stat"><div class="big">${favs.size}</div><div>Favoris</div></div>
    <div class="stat"><div class="big">${complete}</div><div>Sections complètes</div></div>
    <div class="stat"><div class="big">${best}%</div><div>Meilleur QCM</div></div>
    <div class="stat"><div class="big">${history.length}</div><div>QCM joués</div></div>
  </div>`;
  html += `<h2>Par section</h2>`;
  html += bySection.map(x=>`
    <div class="card">
      <div class="badges"><span class="badge">${escapeHtml(x.sec.group||'')}</span></div>
      <h3>${escapeHtml(x.sec.icon||'')} ${escapeHtml(x.sec.title)}</h3>
      <p class="muted small">${x.r}/${x.n} lues</p>
      <div class="q-progressbar"><i style="width:${x.pct}%"></i></div>
    </div>`).join('');
  html += `<div class="button-row" style="margin-top:12px">
    <button class="ghost-btn" id="exportProgress2">Exporter la progression</button>
    <button class="ghost-btn danger" id="resetProgress2">Réinitialiser</button>
  </div>`;
  panel.innerHTML = html;
  document.getElementById('exportProgress2').onclick = exportProgress;
  document.getElementById('resetProgress2').onclick = ()=>{ document.getElementById('resetProgress').click(); };
  updBar();
}

/* ---------- glossary helper already data ---------- */
/* ---------- init ---------- */
function init(){
  applyTheme();
  buildMenu();
  wireFilters();
  // tabs click
  document.querySelectorAll('.tab').forEach(b=> b.onclick = ()=> switchTab(b.dataset.tab));
  updBar();
  switchTab('cours');
  // close sidebar on outside click (mobile)
  document.addEventListener('click', e=>{
    const sb = document.getElementById('sidebar');
    if (window.innerWidth < 980 && sb.classList.contains('open')){
      if (!sb.contains(e.target) && !e.target.closest('#menuToggle')) sb.classList.remove('open');
    }
  });
  // keyboard
  document.addEventListener('keydown', e=>{
    if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); document.getElementById('q').focus(); }
    if (e.key === 'Escape'){ document.getElementById('sidebar').classList.remove('open'); }
  });
}
document.addEventListener('DOMContentLoaded', init);
if (document.readyState !== 'loading') init();