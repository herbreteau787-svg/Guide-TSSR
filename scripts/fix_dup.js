const fs=require('fs');
const m=JSON.parse(fs.readFileSync('content/manifest.json','utf8'));
for(const f of m.files){
  if(!/^cp\d\.json$/.test(f)) continue;
  const d=JSON.parse(fs.readFileSync('content/'+f,'utf8'));
  const seen=new Set();
  for(const x of (d.fiches||[])){
    if(seen.has(x.id)){ let i=2; while(seen.has(x.id+'-'+i)) i++; x.id=x.id+'-'+i; }
    seen.add(x.id);
    if(x.doublon_de && !seen.has(x.doublon_de)) delete x.doublon_de;
  }
  // fix couvre references to new ids? already done; remove invalid
  const ess=(d.fiches||[]).find(x=>x.id.endsWith('-essentiel'));
  if(ess && Array.isArray(ess.couvre)){
    const valid=new Set((d.fiches||[]).map(x=>x.id));
    ess.couvre = ess.couvre.filter(id=>valid.has(id));
  }
  fs.writeFileSync('content/'+f, JSON.stringify(d,null,2)+'\n','utf8');
}
console.log('done');