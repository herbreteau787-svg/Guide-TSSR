const fs=require('fs');
const s=fs.readFileSync('scripts/audit_mapping.js','utf8');
console.log(s.includes('for(const f of buckets[cp])'));