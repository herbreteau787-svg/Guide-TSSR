const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
const rename={'cp4-qcm-debutant':'cp4-quiz-debutant','cp4-qcm-intermediaire':'cp4-quiz-intermediaire','cp4-qcm-avance':'cp4-quiz-avance','cp4-examen-blanc':'cp4-quiz-examen-blanc'};
for(const f of d.fiches){
  if(rename[f.id]){ f.id=rename[f.id]; f.t=f.id.replace('cp4-','').replace(/-/g,' '); f.tags=['cp4','quiz']; }
}
const ess=d.fiches.find(f=>f.id==='cp4-essentiel');
if(ess) ess.couvre=d.fiches.filter(f=>f.id!==ess.id).map(f=>f.id);
fs.writeFileSync('content/cp4.json', JSON.stringify(d,null,2)+'\n','utf8');
console.log('done');