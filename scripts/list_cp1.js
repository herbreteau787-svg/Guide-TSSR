const fs=require('fs');const d=JSON.parse(fs.readFileSync('content/cp1.json','utf8'));
for(const f of d.fiches) console.log(f.id,'|',f.t);