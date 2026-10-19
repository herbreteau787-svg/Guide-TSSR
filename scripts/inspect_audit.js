const fs=require('fs');
const s=fs.readFileSync('scripts/audit_mapping.js','utf8');
const idx=s.indexOf('function newCp');
console.log(s.slice(idx, idx+700));