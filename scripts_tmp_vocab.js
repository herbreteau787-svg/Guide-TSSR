const fs=require('fs');
const d=JSON.parse(fs.readFileSync('content/vocab.json','utf8'));
console.log('id', d.id, 'title', d.title);
console.log('entries', d.entries.length);
console.log(JSON.stringify(d.entries[0],null,2));
console.log(JSON.stringify(d.entries[5],null,2));
console.log(JSON.stringify(d.entries[d.entries.length-1],null,2));