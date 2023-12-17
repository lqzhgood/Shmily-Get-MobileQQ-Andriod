const j = require('../dist/_temp/table/message.json');

const args = process.argv.slice(2);

const n = parseInt(args[0].trim(), 10);

console.log(JSON.stringify(j[n], null, 4));
