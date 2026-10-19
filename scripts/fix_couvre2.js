const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
const ess=d.fiches.find(f=>f.id==='cp4-essentiel');
if(ess && Array.isArray(ess.couvre)){
  ess.couvre=ess.couvre.filter(id=>!id.startsWith('cp4-lab-'));
}
fs.writeFileSync('content/cp4.json', JSON.stringify(d,null,2)+'\n','utf8');
console.log('done');