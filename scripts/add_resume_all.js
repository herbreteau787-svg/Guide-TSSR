const fs=require('fs');
const m=JSON.parse(fs.readFileSync('content/manifest.json','utf8'));
for(const f of m.files){
  if(!/^cp\d\.json$/.test(f)) continue;
  const d=JSON.parse(fs.readFileSync('content/'+f,'utf8'));
  for(const x of (d.fiches||[])){
    if(x.id && String(x.id).endsWith('-essentiel')) continue;
    if(!x.resume) x.resume = String(x.r||'').split('.')[0].slice(0,160)+'.';
  }
  fs.writeFileSync('content/'+f, JSON.stringify(d,null,2)+'\n','utf8');
}
console.log('done');