const fs=require('fs');
const p='validate-content.js';
let s=fs.readFileSync(p,'utf8');
const marker='issues.push(p+": fiche contient un QCM : "+f.id);';
const idx=s.indexOf(marker);
if(idx===-1){ console.error('not found'); process.exit(1); }
const insertion=marker+'\n      if(f&&f.sections!==undefined){ if(!Array.isArray(f.sections)) issues.push(p+": sections non array "+f.id); else for(const sec of f.sections){ if(!sec||typeof sec.title!=="string"||!sec.title) issues.push(p+": section sans titre "+f.id); if(!sec||typeof sec.body!=="string"||!sec.body) issues.push(p+": section sans body "+f.id); } }';
s=s.replace(marker,insertion);
fs.writeFileSync(p,s,'utf8');
console.log('patched');