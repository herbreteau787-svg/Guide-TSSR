const fs=require('fs');
for(const cp of ['cp1','cp2']){
  const file='content/'+cp+'.json';
  const d=JSON.parse(fs.readFileSync(file,'utf8'));
  for(const f of d.fiches){
    if(f.sections) continue;
    const steps=(f.g||[]).join('\n');
    const cmds=String(f.c||'').trim();
    const pitfalls=(f.p||[]).join('\n');
    f.sections=[
      {title:'Introduction', body: String(f.r||'').slice(0,400)},
      {title:'Définitions essentielles', body: String(f.r||'')},
      {title:'Procédure pas à pas', body: steps || 'Aucune procédure détaillée.'},
      {title:'Commandes utiles', body: cmds || 'Aucune commande nécessaire.'},
      {title:'Points de vigilance', body: pitfalls || 'Aucun piège listé.'},
      {title:'Ce que le test ne prouve pas', body: String(f.w||'')},
      {title:'Mémo révision', body: String(f.r||'').slice(0,200)}
    ];
    if(!f.resume) f.resume = String(f.r||'').split('.')[0]+'.';
  }
  fs.writeFileSync(file, JSON.stringify(d,null,2)+'\n','utf8');
  console.log(cp, 'enriched', d.fiches.length);
}