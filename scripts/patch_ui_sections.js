const fs=require('fs');
const p='app.js';
let s=fs.readFileSync(p,'utf8');

// add formatBlock after formatInline function
const anchor='function badgeLevel(level){';
const helper='function formatBlock(s){\n  return String(s||"").split(/\\n\\s*\\n/).map(part=>part.trim()).filter(Boolean).map(part=>"<p>"+part.split(/\\n/).map(line=>formatInline(line)).join("<br>")+"</p>").join("");\n}\n';
if(!s.includes('function formatBlock(')){ s=s.replace(anchor, helper+anchor); }

// insert sectionsHtml in renderFiche: after isEssentiel expanded calc? We'll add variable after isRenvoi? Add after imgTag? Instead insert before imgTag in template.
const oldImg='${imgTag}\n    ${hasCli ?';
const newImg='${(f.sections&&f.sections.length)?f.sections.map(sec=>`<div class="fiche-section"><h4>${escapeHtml(sec.title||"")}</h4>${formatBlock(sec.body||"")}</div>`).join(""):""}\n    ${imgTag}\n    ${hasCli ?';
if(s.includes(oldImg)) s=s.replace(oldImg,newImg);

fs.writeFileSync(p,s,'utf8');
console.log('patched');