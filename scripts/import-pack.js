const fs=require('fs'); const path=require('path');
const packArg=process.argv[2];
if(!packArg){ console.error('Usage: node scripts/import-pack.js <sources/packs/nom.json>'); process.exit(1); }
const packPath=path.resolve(packArg);
if(!fs.existsSync(packPath)){ console.error('Fichier introuvable: '+packPath); process.exit(1); }
let pack;
try { pack=JSON.parse(fs.readFileSync(packPath,'utf8')); } catch(e){ console.error('JSON invalide: '+e.message); process.exit(1); }

const contentDir=path.join(process.cwd(),'content');
const manifestPath=path.join(contentDir,'manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

// global ids
const globalIds=new Set();
for(const f of manifest.files){
  const p=path.join(contentDir,f);
  if(!fs.existsSync(p)) continue;
  const sec=JSON.parse(fs.readFileSync(p,'utf8'));
  if(Array.isArray(sec.fiches)) sec.fiches.forEach(x=>x&&x.id&&globalIds.add(x.id));
  if(Array.isArray(sec.quiz)) sec.quiz.forEach(x=>x&&x.id&&globalIds.add(x.id));
  if(Array.isArray(sec.entries)) sec.entries.forEach(x=>x&&x.id&&globalIds.add(x.id));
  if(Array.isArray(sec.items)) sec.items.forEach(x=>x&&x.id&&globalIds.add(x.id));
  if(Array.isArray(sec.labs)) sec.labs.forEach(x=>x&&x.id&&globalIds.add(x.id));
  if(Array.isArray(sec.glossary)) sec.glossary.forEach(x=>x&&x.term&&globalIds.add(x.term));
}

const targetFile=pack.file || (pack.id ? pack.id+'.json' : null);
if(!targetFile){ console.error('Pack sans champ "id" ou "file".'); process.exit(1); }
const targetPath=path.join(contentDir,targetFile);

// collect new ids
const newFicheIds=[]; const newQuizIds=[]; const newEntryIds=[]; const newItemIds=[]; const newLabIds=[];
if(Array.isArray(pack.fiches)) pack.fiches.forEach(f=>{ if(!f||typeof f.id!=='string'||!f.id){ console.error('Fiche sans id valide'); process.exit(1);} if(globalIds.has(f.id)){ console.error('Collision d\'ID fiche: '+f.id); process.exit(1);} newFicheIds.push(f.id); });
if(Array.isArray(pack.quiz)) pack.quiz.forEach(q=>{ if(!q||typeof q.id!=='string'||!q.id){ console.error('Question sans id valide'); process.exit(1);} if(globalIds.has(q.id)){ console.error('Collision d\'ID question: '+q.id); process.exit(1);} newQuizIds.push(q.id); });
if(Array.isArray(pack.entries)) pack.entries.forEach(e=>{ if(!e||typeof e.id!=='string'||!e.id||typeof e.en!=='string'||typeof e.fr!=='string'||typeof e.section!=='string'){ console.error('Entrée vocabulaire invalide'); process.exit(1);} if(globalIds.has(e.id)){ console.error('Collision d\'ID vocab: '+e.id); process.exit(1);} newEntryIds.push(e.id); });
if(Array.isArray(pack.items)) pack.items.forEach(it=>{ if(!it||typeof it.id!=='string'||!it.id){ console.error('Support sans id valide'); process.exit(1);} if(globalIds.has(it.id)){ console.error('Collision d\'ID support: '+it.id); process.exit(1);} newItemIds.push(it.id); });
if(Array.isArray(pack.labs)) pack.labs.forEach(l=>{ if(!l||typeof l.id!=='string'||!l.id){ console.error('Lab sans id valide'); process.exit(1);} if(globalIds.has(l.id)){ console.error('Collision d\'ID lab: '+l.id); process.exit(1);} newLabIds.push(l.id); });

// merge
let target={};
if(fs.existsSync(targetPath)){ target=JSON.parse(fs.readFileSync(targetPath,'utf8')); }
if(!target.id) target.id=pack.id||targetFile.replace('.json','');
if(!target.title) target.title=pack.title||target.id;
if(Array.isArray(pack.fiches)){ target.fiches=target.fiches||[]; target.fiches.push(...pack.fiches); }
if(Array.isArray(pack.quiz)){ target.quiz=target.quiz||[]; target.quiz.push(...pack.quiz); }
if(Array.isArray(pack.entries)){ target.entries=target.entries||[]; target.entries.push(...pack.entries); }
if(Array.isArray(pack.items)){ target.items=target.items||[]; target.items.push(...pack.items); }
if(Array.isArray(pack.labs)){ target.labs=target.labs||[]; target.labs.push(...pack.labs); }
if(Array.isArray(pack.glossary)){ target.glossary=target.glossary||[]; target.glossary.push(...pack.glossary); }
if(Array.isArray(pack.cheats)){ target.cheats=target.cheats||[]; target.cheats.push(...pack.cheats); }

fs.writeFileSync(targetPath, JSON.stringify(target,null,2)+'\n','utf8');

// update manifest if new file
if(!manifest.files.includes(targetFile)){ manifest.files.push(targetFile); fs.writeFileSync(manifestPath, JSON.stringify(manifest,null,2)+'\n','utf8'); }

console.log('Import terminé:', targetFile);
console.log('Fiches ajoutées:', newFicheIds.length, newFicheIds.join(', '));
console.log('Questions ajoutées:', newQuizIds.length, newQuizIds.join(', '));
console.log('Entrées vocab ajoutées:', newEntryIds.length, newEntryIds.join(', '));
console.log('Supports ajoutés:', newItemIds.length, newItemIds.join(', '));
console.log('Labs ajoutés:', newLabIds.length, newLabIds.join(', '));