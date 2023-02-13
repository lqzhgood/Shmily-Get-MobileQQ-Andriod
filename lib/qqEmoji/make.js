// 105 右太极  网上gif都只有循环一次
const fs = require('fs');

const eTxt = fs.readFileSync('./show/emoji.js', 'utf-8').replace(/^const list \=/g, '');
const eArr = eval(eTxt);
console.log('eArr', eArr);

for (let i = 0; i < eArr.length; i++) {
    const e = eArr[i];
    e.packName = 'QQ经典';

    e.magicStr = Buffer.from(
        [e.flag, e.group === 'none' ? '' : e.group, e.index].filter(v => v).map(v => parseInt(v, 16)),
    ).toString('utf-8');
}

fs.writeFileSync('./emoji/qqEmoji.json', JSON.stringify(eArr, null, 4));
