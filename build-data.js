const fs = require('fs');
const dir = '.';
const chunks = [
  'chunks/01-sections-tssr-core.js',
  'chunks/03-labs.js',
  'chunks/04-quiz.js',
  'chunks/05-glossary.js',
  'chunks/06-cheats.js',
  'chunks/07-methods.js',
  'chunks/08-resources.js',
  'chunks/09-ccp12.js',
  'chunks/10-exam-mep.js',
  'chunks/11-quiz-cyber.js',
  'chunks/13-integrate-lessons.js',
  'chunks/14-simulations.js',
  'chunks/16-pedagogical-structure.js',
  'chunks/17-ccna-itnv7.js',
  'chunks/18-toip.js',
 'chunks/20-cp1.js',
 'chunks/21-cp2.js',
 'chunks/22-cp3.js',
 'chunks/23-cp4.js',
 'chunks/24-cp5.js',
 'chunks/25-cp6.js',
 'chunks/26-cp7.js',
 'chunks/27-cp8.js',
 'chunks/28-cp9.js',
 'chunks/29-cp10.js',
];
let out = 'window.GUIDE = window.GUIDE || { sections:[], quizzes:[], labs:[], glossary:[], cheats:[], methods:[], resources:[], meta:{} };\n';
for (const c of chunks) {
  let content = fs.readFileSync(dir + '\\' + c,'utf8');
  content = content.replace(/^\s*const\s+G\s*=\s*window\.GUIDE;\s*\n?/m,'');
  out += '\n/* ' + c + ' */\n(function(G){\n' + content + '\n})(window.GUIDE);\n';
}
fs.writeFileSync(dir + '\\data.js', out, 'utf8');
console.log('written', out.length);