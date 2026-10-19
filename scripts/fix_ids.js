const fs=require('fs');
const m=JSON.parse(fs.readFileSync('content/manifest.json','utf8'));
for(const f of m.files){
  if(!/^cp\d\.json$/.test(f)) continue;
  const cp=f.replace('.json','');
  const d=JSON.parse(fs.readFileSync('content/'+f,'utf8'));
  for(const x of (d.fiches||[])){
    if(typeof x.id==='string' && x.id.startsWith('[object Object]')){
      x.id = x.id.replace('[object Object]', cp);
    }
  }
  // fix couvre entries too
  const ess=(d.fiches||[]).find(x=>x.id===cp+'-essentiel');
  if(ess && Array.isArray(ess.couvre)){
    ess.couvre = ess.couvre.map(id=> typeof id==='string' && id.startsWith('[object Object]') ? id.replace('[object Object]',cp) : id);
  }
  fs.writeFileSync('content/'+f, JSON.stringify(d,null,2)+'\n','utf8');
  console.log(f, 'fixed');
}