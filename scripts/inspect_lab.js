const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
const lab=d.fiches.find(x=>x.id==='cp4-lab-vlan');
console.log(JSON.stringify(lab,null,2));