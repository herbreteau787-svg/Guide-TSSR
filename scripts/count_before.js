const fs=require('fs');
const window={GUIDE:{}};
const G=window.GUIDE;
// eval chunks
const files=['chunks/03-labs.js','chunks/05-glossary.js','chunks/06-cheats.js','chunks/08-resources.js'];
for(const f of files){
  const code=fs.readFileSync(f,'utf8');
  eval(code);
}
const labs=G.labs||[];
const gloss=G.glossary||[];
const cheats=G.cheats||[];
const resources=G.resources||[];
let cheatRows=0;
for(const c of cheats) cheatRows += (c.rows||[]).length;
console.log('LABS', labs.length);
console.log('GLOSSARY', gloss.length);
console.log('CHEATS_SHEETS', cheats.length);
console.log('CHEAT_ROWS', cheatRows);
console.log('RESOURCES', resources.length);