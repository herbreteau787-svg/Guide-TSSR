const G = window.GUIDE;

// Fusion des CCP11 en une seule section (comme les autres chapitres)
const ccp11Ids = ['supervision','identite','containers','iac'];
const toMerge = ccp11Ids.map(id => G.sections.find(s => s.id === id)).filter(Boolean);
if (toMerge.length) {
  const mergedFiches = toMerge.flatMap(s => (s.fiches || []).map(f => f));
  const merged = {
    id: 'ccp11',
    group: 'CCP11',
    icon: '🧩',
    title: 'CCP11 · Supervision, identité, conteneurs et IaC',
    desc: 'Supervision, identité/SSO, conteneurs et infrastructure as code.',
    fiches: mergedFiches
  };
  G.sections = (G.sections || []).filter(s => !ccp11Ids.includes(s.id));
  const insertAt = G.sections.findIndex(s => s.id === 'ccp12');
  if (insertAt !== -1) G.sections.splice(insertAt, 0, merged);
  else G.sections.push(merged);
}

// Mettre Examens blancs en dernier dans la table des matières
const examIdx = (G.sections || []).findIndex(s => s.id === 'exam');
if (examIdx !== -1) {
  const examSec = G.sections.splice(examIdx, 1)[0];
  G.sections.push(examSec);
}

// Réaligner les QCM sur le nouveau CCP11
if (Array.isArray(G.quizzes)) {
  const map = { supervision:'ccp11', identite:'ccp11', containers:'ccp11', iac:'ccp11' };
  G.quizzes.forEach(q => { if (map[q.section]) q.section = 'ccp11'; });
}