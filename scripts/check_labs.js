const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/labs.json','utf8'));
console.log('total labs:', d.labs.length);
for(const l of d.labs) if(l.id.includes('cp4-lab')) console.log(l.id);