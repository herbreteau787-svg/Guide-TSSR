const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
for(const f of d.fiches){
  if(f.id.startsWith('cp4-quiz-')){
    f.r='Quiz par compétence.';
    f.resume='Quiz par niveau.';
    if(Array.isArray(f.sections)) for(const s of f.sections) s.body=s.body.replace(/QCM/g,'Quiz');
  }
}
fs.writeFileSync('content/cp4.json', JSON.stringify(d,null,2)+'\n','utf8');
console.log('done');