const fs=require('fs');
const p='scripts/audit_mapping.js';
let s=fs.readFileSync(p,'utf8');
s=s.replace("/\\bia\\b|intelligence artificielle|prompt|copilot|chatgpt|claude|rgpd|intelligence artificielle/",
            "/(?:^|[\\s'’-])ia(?:$|[\\s'’-])|intelligence artificielle|prompt|copilot|chatgpt|claude|rgpd/");
fs.writeFileSync(p,s,'utf8');
console.log('done');