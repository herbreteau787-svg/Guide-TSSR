const fs=require('fs');
const f=process.argv[2];
const n=parseInt(process.argv[3]||'200',10);
const lines=fs.readFileSync(f,'utf8').split(/\n/);
console.log(lines.slice(0,n).join('\n'));