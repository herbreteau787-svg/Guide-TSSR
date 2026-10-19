const fs=require('fs');
const s=fs.readFileSync('validate-content.js','utf8');
const idx=s.indexOf('fiche contient un QCM');
console.log(JSON.stringify(s.slice(idx-5,idx+60)));