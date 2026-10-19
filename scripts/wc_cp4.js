const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
let total=0;
for(const f of d.fiches){
  const text=[f.t,f.r,(f.g||[]).join(' '),(f.c||''),(f.p||[]).join(' '),f.w,(f.sections||[]).map(s=>s.title+' '+s.body).join(' ')].join(' ');
  const w=text.split(/\s+/).filter(Boolean).length;
  total+=w;
  console.log(w.toString().padStart(5), f.id);
}
console.log('TOTAL mots CP4:', total, 'fiches:', d.fiches.length);