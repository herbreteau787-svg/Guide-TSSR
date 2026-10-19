const fs=require('fs');
const m=JSON.parse(fs.readFileSync('content/manifest.json','utf8'));
for(const f of m.files){
  if(!/^cp\d\.json$/.test(f)) continue;
  const cp=f.replace('.json','');
  const d=JSON.parse(fs.readFileSync('content/'+f,'utf8'));
  const idMap={};
  for(const x of (d.fiches||[])){
    const old=x.id;
    let nid=old;
    if(!old.startsWith(cp+'-') && !old.startsWith('mig-legacy-') && !old.startsWith('cyber-') && !old.startsWith('transverse-') && !old.startsWith('pedagogie-') && !old.startsWith('toip-')){
      nid='mig-legacy-'+old;
    }
    if(nid!==old){ idMap[old]=nid; x.id=nid; }
  }
  // update couvre
  const ess=(d.fiches||[]).find(x=>x.id===cp+'-essentiel');
  if(ess && Array.isArray(ess.couvre)){
    ess.couvre = ess.couvre.map(id=> idMap[id]||id);
  }
  // update quiz
  if(Array.isArray(d.quiz)){
    for(const q of d.quiz){
      if(q.fiche && idMap[q.fiche]) q.fiche=idMap[q.fiche];
    }
  }
  fs.writeFileSync('content/'+f, JSON.stringify(d,null,2)+'\n','utf8');
  console.log(f, 'renamed', Object.keys(idMap).length);
}