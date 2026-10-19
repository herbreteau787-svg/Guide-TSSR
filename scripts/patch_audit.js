const fs=require('fs');
const p='scripts/audit_mapping.js';
let s=fs.readFileSync(p,'utf8');
s=s.replace("  if(/ia|copilot|prompt|chatgpt|claude|rgpd/.test(txt)) return 'cp1';",
            "  if(/\\bia\\b|copilot|prompt|chatgpt|claude|rgpd|intelligence artificielle/.test(txt)) return 'cp1';");
// fix old cp6 mapping to cp5
s=s.replace("6:'cp1',","6:'cp5',");
fs.writeFileSync(p,s,'utf8');
console.log('done');