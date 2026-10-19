const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
const f=d.fiches.find(x=>x.id==='cp4-quiz-debutant');
const s=JSON.stringify(f).toLowerCase();
const idx=s.indexOf('qcm');
console.log('index', idx);
console.log(s.slice(Math.max(0,idx-40), idx+40));