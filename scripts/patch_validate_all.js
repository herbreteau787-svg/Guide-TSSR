const fs=require('fs');
const p='validate-content.js';
let s=fs.readFileSync(p,'utf8');
s=s.replace('    if(base==="cp1"||base==="cp2"){','    if(/^cp\\d$/.test(base)){');
fs.writeFileSync(p,s,'utf8');
console.log('done');