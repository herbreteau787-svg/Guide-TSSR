const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/cp4.json','utf8'));
const qs=d.quiz||[];
console.log('TOTAL', qs.length);
const byCat={};
const byDiff={};
for(const q of qs){
  byCat[q.category]=(byCat[q.category]||0)+1;
  byDiff[q.difficulty]=(byDiff[q.difficulty]||0)+1;
}
console.log('Par catégorie:');
for(const k in byCat) console.log(' ', k, byCat[k]);
console.log('Par difficulté:');
for(const k in byDiff) console.log(' ', k, byDiff[k]);