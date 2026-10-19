const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
for(const f of d.fiches){
  if(f.id.startsWith('cp4-quiz-')){
    f.w='Quiz.';
    f.p=['Erreur','Vérification'];
    f.c='Aucune.';
  }
}
fs.writeFileSync('content/cp4.json', JSON.stringify(d,null,2)+'\n','utf8');
console.log('done');