const fs=require('fs');
const m=JSON.parse(fs.readFileSync('content/manifest.json','utf8'));
for(const f of m.files){
  if(!/^cp\d\.json$/.test(f)) continue;
  const d=JSON.parse(fs.readFileSync('content/'+f,'utf8'));
  const ess=(d.fiches||[]).find(x=>x.id.endsWith('-essentiel'));
  if(ess) ess.couvre=(d.fiches||[]).filter(x=>x.id!==ess.id).map(x=>x.id);
  fs.writeFileSync('content/'+f, JSON.stringify(d,null,2)+'\n','utf8');
}
console.log('done');