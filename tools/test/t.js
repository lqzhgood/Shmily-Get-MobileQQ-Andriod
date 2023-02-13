const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const { decode } = require('./decode/typeHandle/share2011/decode.js');

const files = fs.readdirSync('./t/');

const buffArr = files.map(v => fs.readFileSync(`./t/${v}`));

const list = ['6500328718134052119'];
// 6607061682217319006

const bArr = buffArr.filter((v, i) => {
    const f = path.parse(files[i]).name;
    return !list.includes(f);
});

for (let i = 0; i < bArr.length; i++) {
    const f = path.parse(files[i]).name;

    const res = decode(bArr[i], f);
    fs.writeFileSync(`./t2/${f}`, JSON.stringify(res, null, 4));
}

console.log('ok', bArr.length);
setTimeout(() => {}, 1000000);
