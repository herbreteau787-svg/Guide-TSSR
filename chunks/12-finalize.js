const G = window.GUIDE;

// Mettre Examens blancs en dernier dans la table des matières
const examIdx = (G.sections || []).findIndex(s => s.id === 'exam');
if (examIdx !== -1) {
  const examSec = G.sections.splice(examIdx, 1)[0];
  G.sections.push(examSec);
}

// Regrouper les sections par groupe (TSSR, puis CCNA, puis Examens) pour une sidebar lisible
const groupRank = { 'TSSR': 0, 'CCNA': 1, 'Examens': 2 };
G.sections.sort((a, b) => (groupRank[a.group] ?? 9) - (groupRank[b.group] ?? 9));