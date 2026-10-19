const fs=require('fs');
const m=JSON.parse(fs.readFileSync('content/manifest.json','utf8'));
for(const f of m.files){
  if(!/^cp\d\.json$/.test(f)) continue;
  const d=JSON.parse(fs.readFileSync('content/'+f,'utf8'));
  console.log('###', f, '|', d.id, '|', d.title, '| fiches:', d.fiches.length);
  for(const x of d.fiches) console.log('  -', x.id, '|', x.t);
}