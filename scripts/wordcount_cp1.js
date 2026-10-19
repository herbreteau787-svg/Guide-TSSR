const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp1.json','utf8'));
for(const f of d.fiches){
  const text=[f.t,f.r,(f.g||[]).join(' '),(f.c||''),(f.p||[]).join(' '),f.w,(f.sections||[]).map(s=>s.title+' '+s.body).join(' ')].join(' ');
  const words=text.split(/\s+/).filter(Boolean).length;
  console.log(words.toString().padStart(5), f.id, '|', f.t);
}
console.log('TOTAL fiches:', d.fiches.length);