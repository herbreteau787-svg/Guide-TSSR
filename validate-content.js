const fs=require("fs"); const path=require("path");
const manifest=JSON.parse(fs.readFileSync("content/manifest.json","utf8"));
const ignoredPrefixFiles=new Set(["transverse","ccna","ccna-itn","exemples","exam","labs","ccp12"]);
const allowedSections=new Set(["cp1","cp2","cp3","cp4","cp5","cp6","cp7","cp8","cp9","transverse","ccna","ccna-itn","ccp12","exemples","exam","labs"]);
const globalIds=new Set(); const quizIds=new Set();
let total=0, issues=[]; const sections=[];
for(const file of manifest.files){
 const p=path.join("content",file);
 if(!fs.existsSync(p)){ issues.push("fichier manquant: "+p); continue; }
 let sec;
 try { sec=JSON.parse(fs.readFileSync(p,"utf8")); } catch(e){ issues.push("JSON invalide: "+p); continue; }
 const base=file.replace(".json","");
 if(!sec||typeof sec.id!=="string") issues.push(p+": id invalide");
 if(!sec||typeof sec.title!=="string") issues.push(p+": title invalide");
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
     if(!f||typeof f.id!=="string"||!f.id){issues.push(p+": fiche sans id"); continue;
  // sections push moved
}
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
      const ficheText=JSON.stringify(f||{}).toLowerCase(); if(ficheText.includes("qcm")) issues.push(p+": fiche contient un QCM : "+f.id);
     }
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
for(const id of quizIds){ if(globalIds.has(id)) issues.push("id question deja utilise comme fiche: "+id); }
console.log("MANIFEST", manifest.files.length, "fichiers");
console.log("FICHES", total);
console.log("ISSUES", issues.length);
for(const i of issues.slice(0,40)) console.log("- "+i);
process.exitCode = issues.length ? 1 : 0;
