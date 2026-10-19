const fs=require("fs"); const path=require("path");
const manifest=JSON.parse(fs.readFileSync("content/manifest.json","utf8"));
const ignoredPrefixFiles=new Set(["transverse","ccna","ccna-itn","exemples","exam","labs","ccp12"]);
const allowedSections=new Set(["cp1","cp2","cp3","cp4","cp5","cp6","cp7","cp8","cp9","transverse","ccna","ccna-itn","ccp12","exemples","exam","labs"]);
const globalIds=new Set(); const quizIds=new Set(); const vocabEn=new Set();
let total=0, issues=[]; const sections=[];
for(const file of manifest.files){
 const p=path.join("content",file);
 if(!fs.existsSync(p)){ issues.push("fichier manquant: "+p); continue; }
 let sec;
 try { sec=JSON.parse(fs.readFileSync(p,"utf8")); } catch(e){ issues.push("JSON invalide: "+p); continue; }
 const base=file.replace(".json","");
 if(!sec||typeof sec.id!=="string") issues.push(p+": id invalide");
 if(!sec||typeof sec.title!=="string") issues.push(p+": title invalide");
 if(base==="vocab"){
   if(!sec||!Array.isArray(sec.entries)) { issues.push(p+": entries non array"); continue; }
   const sectionEn=new Set();
   for(const e of sec.entries){
     if(!e||typeof e.id!=="string"||!e.id) issues.push(p+": entry sans id");
     if(!e||typeof e.en!=="string"||!e.en) issues.push(p+": entree sans en "+(e.id||"?"));
     if(!e||typeof e.fr!=="string"||!e.fr) issues.push(p+": entree sans fr "+(e.id||"?"));
     if(!e||typeof e.section!=="string"||e.section.trim().length<3) issues.push(p+": section invalide "+(e.section||"?"));
     if(e&&e.id){ if(globalIds.has(e.id)) issues.push(p+": id duplique "+e.id); globalIds.add(e.id); }
     const key=String(e&&e.en||"").toLowerCase().trim(); if(key){ if(sectionEn.has(key)) issues.push(p+": terme EN doublon dans la section "+e.section+" : "+e.en); sectionEn.add(key); }
   }
   continue;
 }
 if(base==="labs"){
   if(!sec||!Array.isArray(sec.labs)) { issues.push(p+": labs non array"); continue; }
   for(const l of sec.labs){ if(!l||typeof l.id!=="string"||!l.id) issues.push(p+": lab sans id"); if(l&&l.id){ if(globalIds.has(l.id)) issues.push(p+": id duplique "+l.id); globalIds.add(l.id);} }
   continue;
 }
 if(base==="glossary"){
   if(!sec||!Array.isArray(sec.glossary)) { issues.push(p+": glossary non array"); continue; }
   for(const g of sec.glossary){ if(!g||typeof g.term!=="string"||!g.term) issues.push(p+": terme sans nom"); if(!g||typeof g.def!=="string"||!g.def) issues.push(p+": definition manquante "+(g.term||"?")); }
   continue;
 }
 if(base==="cheats"){
   if(!sec||!Array.isArray(sec.cheats)) { issues.push(p+": cheats non array"); continue; }
   for(const c of sec.cheats){ if(!c||typeof c.title!=="string"||!c.title) issues.push(p+": cheat sans titre"); }
   continue;
 }
 if(base==="resources"){
   if(!sec||!Array.isArray(sec.resources)) { issues.push(p+": resources non array"); continue; }
   for(const r of sec.resources){ if(!r||typeof r.title!=="string"||!r.title) issues.push(p+": ressource sans titre"); }
   continue;
 }
 if(base==="supports"){
   if(!sec||!Array.isArray(sec.items)) { issues.push(p+": items non array"); continue; }
   for(const it of sec.items){
     if(!it||typeof it.id!=="string"||!it.id) issues.push(p+": support sans id");
     if(!it||typeof it.titre!=="string"||!it.titre) issues.push(p+": support sans titre");
     if(!it||typeof it.fichier!=="string"||!it.fichier) issues.push(p+": support sans fichier");
     else { const resolved=path.join(".",it.fichier); if(!fs.existsSync(resolved)) issues.push(p+": support manquant "+it.fichier); }
     if(it&&it.id){ if(globalIds.has(it.id)) issues.push(p+": id duplique "+it.id); globalIds.add(it.id); }
   }
   continue;
 }
 if(!Array.isArray(sec.fiches)) { issues.push(p+": fiches non array"); continue; }
 if(sec && Array.isArray(sec.fiches)){
   for(const f of sec.fiches){
     total++;
     if(!f||typeof f.id!=="string"||!f.id){issues.push(p+": fiche sans id"); continue; }
     if(!f||typeof f.t!=="string"||!f.t) issues.push(p+": fiche sans titre");
     if(globalIds.has(f.id)) issues.push(p+": id duplique "+f.id);
     globalIds.add(f.id);
     if(f&&f.img){const ip=path.join(".",f.img); if(!fs.existsSync(ip)) issues.push(p+": image manquante "+f.img);}
     if(!ignoredPrefixFiles.has(base)){
       const id=f.id; let ok=true;
       if(!(id.startsWith("pedagogie-")||/^toip-fiche-\d+$/.test(id)||id.endsWith("-synthese")||id.startsWith("mig-legacy-")||id.startsWith("cyber-")||id.startsWith("transverse-"))){
         ok=id.startsWith(base+"-");
       }
       if(!ok) issues.push(p+": prefixe ID non conforme "+f.id);
     }
     const ficheText=JSON.stringify(f||{}).toLowerCase(); if(ficheText.includes("qcm")) issues.push(p+": fiche contient un QCM : "+f.id);
      if(f&&f.sections!==undefined){ if(!Array.isArray(f.sections)) issues.push(p+": sections non array "+f.id); else for(const sec of f.sections){ if(!sec||typeof sec.title!=="string"||!sec.title) issues.push(p+": section sans titre "+f.id); if(!sec||typeof sec.body!=="string"||!sec.body) issues.push(p+": section sans body "+f.id); } }
   }
 }
    if(/^cp\d$/.test(base)){
      const ess=(sec.fiches||[]).find(f=>f&&f.id===base+"-essentiel");
      if(ess){
        if(!Array.isArray(ess.couvre)) issues.push(p+": essentiel sans couvre");
        else {
          const others=(sec.fiches||[]).filter(f=>f&&f.id!==ess.id).map(f=>f.id);
          for(const id of others){ if(!ess.couvre.includes(id)) issues.push(p+": couvre manquant "+id); }
          for(const id of ess.couvre){ if(!globalIds.has(id)) issues.push(p+": couvre inexistante "+id); }
        }
      }
      for(const f of (sec.fiches||[])){
        if(!f||typeof f.id!=="string"||f.id.endsWith("-essentiel")) continue;
        if(typeof f.resume!=="string"||!f.resume.trim()) issues.push(p+": resume manquant "+f.id);
      }
    }
 sections.push({file,sec});
 if(sec && Array.isArray(sec.quiz)){
   for(const q of sec.quiz){
     if(!q||typeof q!=="object") {issues.push(p+": question invalide"); continue;}
     if(typeof q.id!=="string"||!q.id) issues.push(p+": question sans id");
     else if(quizIds.has(q.id)) issues.push(p+": id question duplique "+q.id); else quizIds.add(q.id);
     if(typeof q.q!=="string"||!q.q) issues.push(p+": question sans texte");
     if(!Array.isArray(q.choices)||q.choices.length<2) issues.push(p+": options insuffisantes "+(q.id||"?"));
     if(typeof q.answer!=="number"||!Number.isInteger(q.answer)|| !Array.isArray(q.choices)||q.answer<0||q.answer>=q.choices.length) issues.push(p+": reponse invalide "+(q.id||"?"));
     if(typeof q.explain!=="string"||!q.explain) issues.push(p+": explication manquante "+(q.id||"?"));
     if(typeof q.fiche!=="string"||!q.fiche) issues.push(p+": question sans fiche "+(q.id||"?"));
     else if(!globalIds.has(q.fiche)) issues.push(p+": fiche reperee introuvable "+q.fiche+" dans "+(q.id||"?"));
   }
 }
 if(sec && /^cp\d$/.test(sec.id) && !allowedSections.has(sec.id)) issues.push(p+": cp inconnu "+sec.id);
}
for(const entry of sections){
 const p=path.join("content",entry.file); const sec=entry.sec;
 if(!sec||!Array.isArray(sec.fiches)) continue;
 for(const f of sec.fiches){
   if(f.doublon_de){
     if(typeof f.doublon_de!=="string"||!globalIds.has(f.doublon_de)) issues.push(p+": doublon_de inexistante "+f.doublon_de+" dans "+f.id);
   }
   if(/-renvoi-/.test(f.id)){
     if(!Array.isArray(f.renvoi_vers)||f.renvoi_vers.length===0) issues.push(p+": renvoi sans cible "+f.id);
     else for(const target of f.renvoi_vers){ if(!target||typeof target!=="string"||!globalIds.has(target)) issues.push(p+": cible renvoi inexistante "+target+" dans "+f.id); }
   }
 }
}
const encodingPaths = ["app.js","index.html","styles.css","sw.js"].concat((manifest.files||[]).map(f=>path.join("content",f).replace(/\\\\/g,"/")));
const encodingChecks = [
 { name:"U+FFFD", regex:/\uFFFD/ },
 { name:"mojibake latine (Ã)", regex:/\u00C3[\u0080-\u00BF]/ },
 { name:"mojibake tiret/cote (â)", regex:/\u00E2[\u20AC\u2013\u2014\u2019\u00A0]/ },
 { name:"mojibake emoji (ð)", regex:/\u00F0\u009F[\u0080-\u00BF][\u0080-\u00BF]/ },
 { name:"point d'interrogation entre deux lettres", regex:/(?<=\p{L})\?(?=\p{L})/u },
 { name:"é isolé entre espaces", regex:/ \u00E9 / },
 { name:"Français", regex:/Français/i },
 { name:"mettre à jour", regex:/mettre \u00E9 jour/i },
 { name:"à partir de", regex:/\u00E9 partir de/i },
 { name:"à distance", regex:/\u00E9 distance/i },
 { name:"titre commencant par é", regex:/^\u00E9\b/ }
];
for(const fp of encodingPaths){
 const full=path.join(".", fp);
 if (!fs.existsSync(full)) continue;
 const txt=fs.readFileSync(full, "utf8");
 if (txt.charCodeAt(0)===0xFEFF) issues.push(fp+": BOM UTF-8 en tete");
 const ls=txt.split(/\r?\n/);
 ls.forEach((line, idx)=>{
   for(const c of encodingChecks){
     if (c.regex.test(line)){
       issues.push(fp+": Ligne "+(idx+1)+" - "+c.name+" : "+line.trim().slice(0,140));
       break;
     }
   }
 });
}
for(const id of quizIds){ if(globalIds.has(id)) issues.push("id question deja utilise comme fiche: "+id); }
console.log("MANIFEST", manifest.files.length, "fichiers");
console.log("FICHES", total);
console.log("ISSUES", issues.length);
for(const i of issues.slice(0,40)) console.log("- "+i);
process.exitCode = issues.length ? 1 : 0;
