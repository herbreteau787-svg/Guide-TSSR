const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
const before=d.fiches.length;
d.fiches=d.fiches.filter(f=>!f.id.startsWith('cp4-lab-'));
fs.writeFileSync('content/cp4.json', JSON.stringify(d,null,2)+'\n','utf8');
console.log('removed', before-d.fiches.length, 'remaining', d.fiches.length);