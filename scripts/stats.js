const fs=require("fs"); const path=require("path");
const manifest=JSON.parse(fs.readFileSync("content/manifest.json","utf8"));
let fiches=0, questions=0, vocab=0, supports=0, labs=0, glossary=0, cheats=0, cheatRows=0, resources=0;
const perCp={};
for(const file of manifest.files){
  const sec=JSON.parse(fs.readFileSync(path.join("content",file),"utf8"));
  if(file==="vocab.json"){ vocab=(sec.entries||[]).length; continue; }
  if(file==="supports.json"){ supports=(sec.items||[]).length; continue; }
  if(file==="labs.json"){ labs=(sec.labs||[]).length; continue; }
  if(file==="glossary.json"){ glossary=(sec.glossary||[]).length; continue; }
  if(file==="cheats.json"){ cheats=(sec.cheats||[]).length; cheatRows=(sec.cheats||[]).reduce((a,c)=>a+(c.rows||[]).length,0); continue; }
  if(file==="resources.json"){ resources=(sec.resources||[]).length; continue; }
  if(Array.isArray(sec.fiches)){ fiches+=sec.fiches.length; perCp[sec.id||file]=sec.fiches.length; }
  if(Array.isArray(sec.quiz)){ questions+=sec.quiz.length; }
}
console.log("Fiches:",fiches);
console.log("Questions QCM:",questions);
console.log("Vocabulaire:",vocab);
console.log("Labos:",labs);
console.log("Glossaire:",glossary);
console.log("Cheat sheets:",cheats);
console.log("Lignes cheat:",cheatRows);
console.log("Ressources:",resources);
console.log("Supports:",supports);
console.log("Par section:");
for(const k in perCp) console.log(" -",k,perCp[k]);