const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const files = process.argv.slice(2);
async function main(){
 for (const f of files) {
   const parser = new PDFParse({ data: fs.readFileSync(f) });
   const result = await parser.getText();
   console.log('\n===== FILE: ' + f + ' (pages=' + result.total + ') =====\n');
   console.log(result.text);
   await parser.destroy();
 }
}
main().catch(e=>{console.error(e);process.exit(1);});
