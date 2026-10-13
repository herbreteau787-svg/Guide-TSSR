const fs = require('fs');
const dir = 'C:\\Users\\Léo\\Documents\\Projet par défaut\\Guide-TSSR-Max';
const chunks = [
 'chunks/01-sections-tssr-core.js',
 'chunks/02-sections-extras.js',
 'chunks/03-labs.js',
 'chunks/04-quiz.js',
 'chunks/05-glossary.js',
 'chunks/06-cheats.js',
 'chunks/07-methods.js',
 'chunks/08-resources.js',
 'chunks/09-ccp12.js',
 'chunks/10-exam-mep.js',
 'chunks/11-quiz-cyber.js',
 'chunks/12-finalize.js'
];
let out = 'window.GUIDE = window.GUIDE || { sections:[], quizzes:[], labs:[], glossary:[], cheats:[], methods:[], resources:[], meta:{} };\n';
for (const c of chunks) {
  let content = fs.readFileSync(dir + '\\' + c,'utf8');
  content = content.replace(/^\s*const\s+G\s*=\s*window\.GUIDE;\s*\n?/m,'');
  out += '\n/* ' + c + ' */\n(function(G){\n' + content + '\n})(window.GUIDE);\n';
}
fs.writeFileSync(dir + '\\data.js', out, 'utf8');
console.log('written', out.length);
