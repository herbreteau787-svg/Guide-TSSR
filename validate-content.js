const fs=require("fs");
const path=require("path");
const manifest=JSON.parse(fs.readFileSync("content/manifest.json","utf8"));
const ignoredPrefixFiles=new Set(["transverse","ccna","ccna-itn","exemples","exam","labs","ccp12"]);
const allowedSections=new Set(["cp1","cp2","cp3","cp4","cp5","cp6","cp7","cp8","cp9","transverse","ccna","ccna-itn","ccp12","exemples","exam","labs"]);
const fichesSeen=new Set();
let total=0, issues=[];
for(const file of manifest.files){
 const p=path.join("content",file);
 if(!fs.existsSync(p)){ issues.push("fichier manquant: "+p); continue; }
 let sec;
 try { sec=JSON.parse(fs.readFileSync(p,"utf8")); } catch(e){ issues.push("JSON invalide: "+p); continue; }
 if(!sec||typeof sec.id!=="string") issues.push(p+": id invalide");
 if(!sec||typeof sec.title!=="string") issues.push(p+": title invalide");
 if(!Array.isArray(sec.fiches)) { issues.push(p+": fiches non array"); continue; }
 if(sec && Array.isArray(sec.fiches)){
   for(const f of sec.fiches){
     total++;
     if(!f||typeof f.id!=="string"||!f.id) { issues.push(p+": fiche sans id"); continue; }
     if(!f||typeof f.t!=="string"||!f.t) issues.push(p+": fiche sans titre");
     if(fichesSeen.has(f.id)) issues.push(p+": id duplique "+f.id);
     fichesSeen.add(f.id);
     if(f&&f.img){const ip=path.join(".",f.img); if(!fs.existsSync(ip)) issues.push(p+": image manquante "+f.img);}
     const base=file.replace(".json","");
     if(!ignoredPrefixFiles.has(base)){
       const id=f.id;
       let ok=true;
       if(!(id.startsWith("pedagogie-") || /^toip-fiche-\d+$/.test(id) || id.endsWith("-synthese") || id.startsWith("mig-legacy-"))) {
         const n=base.match(/^cp(\d+)$/)?.[1];
         if(n){
           ok = id.startsWith(base+"-") || id.startsWith("ccp"+n+"-") || id.startsWith("cp"+n+"-") ||
             id.startsWith("cyber-") || id.startsWith("toip-") || id.startsWith("arch-linux-") ||
             id.startsWith("cp1-") || id.startsWith("cp2-") || id.startsWith("cp3-") || id.startsWith("cp5-") ||
             id.startsWith("transverse-") || id.startsWith("ccp") || id.startsWith("cp10-") || id.startsWith("ccp12-") ||
             id.startsWith("cp12-");
         } else {
           ok = id.startsWith(base+"-");
         }
       }
       if(!ok) issues.push(p+": prefixe ID non conforme "+f.id);
     }
   }
 }
 if(sec && /^cp\d$/.test(sec.id) && !allowedSections.has(sec.id)) issues.push(p+": cp inconnu "+sec.id);
}
console.log("MANIFEST", manifest.files.length, "fichiers");
console.log("FICHES", total);
console.log("ISSUES", issues.length);
for(const i of issues.slice(0,30)) console.log("- "+i);
process.exitCode = issues.length ? 1 : 0;
