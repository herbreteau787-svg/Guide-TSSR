const fs=require('fs');
const s=fs.readFileSync('validate-content.js','utf8');
console.log(s.includes('fiche contient un QCM'));