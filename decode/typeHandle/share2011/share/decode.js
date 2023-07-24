const {
    getData,
    isZeroStr,
    l,
    zero,
    hexArrToStr,
    Cut,
    nextNoZeroLength,
    nextZeroLength,
} = require('../../../decryption/javaSerialization/utils.js');

const DICT_NO_F1_VALUE_ITEM = 'NO_F1_VALUE_ITEM';
const DICT_NO_APP_INFO = 'NO_APP_INFO';

// const list = ['6622505277572313466', '6500328718134052119', '6532651004050921099', '6563446044258493747'];

function decode(b, id) {
    const a = Array.from(b);

    const r = {};
    const c = new Cut(id);

    r.contentType = getContentType(a);
    c.cut(a, 0x15); // delete header

    r.fileType = getData(a);
    if (isZeroStr(r.fileType)) {
        r.fileType = 'local';
    }
    c.cut(a, nextNoZeroLength(a) - 1);

    r.url = r.fileType === 'local' ? '' : getData(a);
    r.des = getData(a);
    c.cut(a, [0, 0, 0, '?']);

    if (r.contentType === DICT_NO_F1_VALUE_ITEM) {
        contentType_DICT_NO_F1_VALUE_ITEM(a, r, c);
    } else if (r.contentType === DICT_NO_APP_INFO) {
        contentType_DICT_DICT_NO_APP_INFO(a, r, c);
    } else {
        contentType_DEFAULT(a, r, c);
    }

    // 剩下的暴力解吧 因为也没多少重要信息了 只是为了记录
    // 大部分 same as url
    r.otherArr = [];
    r.otherHex = a.map(v => v.toString(16).padStart(2, 0)).join(',');
    while (a.length > 0) {
        r.otherArr.push(getData(a));
    }
    r.otherArr = r.otherArr.filter(v => v);

    // c.log();
    // console.log(
    //     'a',
    //     a.map(v => v.toString(16).padStart(2, 0)),
    // );
    // console.log(id, JSON.stringify(r, null, 4));
    return r;
}

function contentType_DICT_NO_F1_VALUE_ITEM(a, r, c) {
    r.cover = getData(a);
    r.link1 = getData(a);
    r.titleValue = getData(a);
    r.author = getData(a);

    c.cut(a, nextNoZeroLength(a));
    c.cut(a, nextZeroLength(a));

    r.appIcon = getData(a);
    r.appName = getData(a);
    r.appLink = getData(a);

    r.appKey = getData(a);
    r.appInfo = [];
    while (a.slice(0, 15).filter(v => v == 0).length < 11 && a.length > 0) {
        r.appInfo.push(getData(a));
    }
    r.appInfo = r.appInfo.filter(v => v);
}

function contentType_DICT_DICT_NO_APP_INFO(a, r, c) {
    r.itemKey = getData(a);
    c.cut(a, zero(0x24));

    r.type = getData(a);
    c.cut(a, zero(3) + l('8'));

    if (r.fileType === 'local') {
        r.localFile = getData(a);
        r.uuid = getData(a);
        r.md5 = getData(a);
    } else {
        r.cover = getData(a);
        c.cut(a, nextNoZeroLength(a) - 1);
        r.titleKey = getData(a);
        c.cut(a, zero(0x3) + l('?') + zero(0x6));
        r.titleValue = getData(a);
        c.cut(a, zero(0x4));
        r.summaryKey = getData(a);
        c.cut(a, zero(0x3) + l('?') + zero(0x6));
        r.summaryValue = getData(a);
    }

    c.cut(a, zero(0x3a));
}
function contentType_DEFAULT(a, r, c) {
    r.itemKey = getData(a);
    c.cut(a, zero(0x24));

    r.type = getData(a);
    c.cut(a, zero(3) + l('8'));

    if (r.fileType === 'local') {
        r.localFile = getData(a);
        r.uuid = getData(a);
        r.md5 = getData(a);
    } else {
        r.cover = getData(a);
        c.cut(a, nextNoZeroLength(a) - 1);
        r.titleKey = getData(a);
        c.cut(a, zero(0x3) + l('?') + zero(0x6));
        r.titleValue = getData(a);
        c.cut(a, zero(0x4));
        r.summaryKey = getData(a);
        c.cut(a, zero(0x3) + l('?') + zero(0x6));
        r.summaryValue = getData(a);
    }

    if (r.fileType === 'local') {
        c.cut(a, zero(0xe), ['?', '?'], zero(0x17), [3, '?', '?']);
    } else {
        c.cut(a, nextNoZeroLength(a));
        c.cut(a, nextZeroLength(a)); //[0x06, 0x01, 0x1f, 0x87]  [0x03,0x45,0xEA]
    }
    r.appIcon = getData(a);
    r.appName = getData(a);
    r.appLink = getData(a);

    r.appKey = getData(a);

    r.appInfo = [];
    while (a.slice(0, 16).filter(v => v == 0).length < 14 && a.length > 0) {
        r.appInfo.push(getData(a));
    }
    r.appInfo = r.appInfo.filter(v => v);
    c.cut(a, zero(0x16));
}

function getContentType(b) {
    const POSITION_CONTENT_TYPE = 0xc;

    const t = b[POSITION_CONTENT_TYPE];
    switch (t) {
        case 0x2:
            // QQ音乐  6500328718134052119
            return DICT_NO_F1_VALUE_ITEM;
        case 0x21:
            return DICT_NO_APP_INFO;
        default:
            return 'DEFAULT';
    }
}

function hexArrRead(a) {
    const pear = a;
    const fullLen = pear.length;
    let isEnd = false;

    const arr = [];

    const s = pear.shift(1);
    if (s !== 0) {
        console.log('s', s);
        throw new Error('s!==0');
    }
    while (!isEnd && pear.length > 0) {
        const len = pear.splice(0, 1)[0];
        const content = pear.splice(0, len);
        arr.push(hexArrToStr(Buffer.from(content), 0, len));

        isEnd = pear.slice(0, 0x16).every(e => e === 0);
    }

    return { data: arr, cutLen: fullLen - pear.length };
}

module.exports = {
    decode,
    DICT_NO_F1_VALUE_ITEM,
    DICT_NO_APP_INFO,
};
