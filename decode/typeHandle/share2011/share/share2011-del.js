const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const DICT_NO_F1_VALUE_ITEM = 'NO_F1_VALUE_ITEM';

const files = fs.readdirSync('./t/');

const buffArr = files.map(v => fs.readFileSync(`./t/${v}`));

const POSITION_CONTENT_TYPE = 0xc;

const POSITION_FILE_TYPE_LENGTH = 0x16;
const LENGTH_FILE_TYPE = b => (b[POSITION_FILE_TYPE_LENGTH] === 0 ? 2 : b[POSITION_FILE_TYPE_LENGTH]);
const POSITION_FILE_TYPE = POSITION_FILE_TYPE_LENGTH + 1;

const POSITION_URL_LENGTH = b => POSITION_FILE_TYPE + LENGTH_FILE_TYPE(b) + zero(6); // url 长度位置
const LENGTH_URL = b => calcLen(b, POSITION_URL_LENGTH(b)); // url 字符串长度
const POSITION_URL = b => POSITION_URL_LENGTH(b) + 2; // url 字符起始位置

const POSITION_DES_LENGTH = b =>
    getFileType(b) === 'local' ? POSITION_URL_LENGTH(b) : POSITION_URL(b) + LENGTH_URL(b); // 高位位置 这里是两个字节
const LENGTH_DES = b => (getFileType(b) === 'local' ? LENGTH_URL(b) : calcLen(b, POSITION_DES_LENGTH(b)));
const POSITION_DES = b => (getFileType(b) === 'local' ? POSITION_URL(b) : POSITION_DES_LENGTH(b) + 2);

const POSITION_F1_LENGTH = b => POSITION_DES(b) + LENGTH_DES(b) + l([0, 0, 0, '?']);
const LENGTH_F1 = b => calcLen(b, POSITION_F1_LENGTH(b));
const POSITION_F1 = b => POSITION_F1_LENGTH(b) + 2;

const POSITION_TYPE_LENGTH = b => POSITION_F1(b) + LENGTH_F1(b) + zero(0x24);
const LENGTH_TYPE = b => calcLen(b, POSITION_TYPE_LENGTH(b));
const POSITION_TYPE = b => POSITION_TYPE_LENGTH(b) + 2;

const POSITION_TYPE_URL_LENGTH = b => POSITION_TYPE(b) + LENGTH_TYPE(b) + zero(3) + l('8');
const LENGTH_TYPE_URL = b => calcLen(b, POSITION_TYPE_URL_LENGTH(b));
const POSITION_TYPE_URL = b => POSITION_TYPE_URL_LENGTH(b) + 2;

const POSITION_TITLE_KEY_LENGTH = b => nextNoZeroLength(b, POSITION_TYPE_URL(b) + LENGTH_TYPE_URL(b)); // 低位
const LENGTH_TITLE_KEY = b => calcLen(b, POSITION_TITLE_KEY_LENGTH(b) - 1);
const POSITION_TITLE_KEY = b => POSITION_TITLE_KEY_LENGTH(b) + 1;

const POSITION_TITLE_VALUE_LENGTH = b => POSITION_TITLE_KEY(b) + LENGTH_TITLE_KEY(b) + zero(0x3) + l('?') + zero(0x6);
const LENGTH_TITLE_VALUE = b => calcLen(b, POSITION_TITLE_VALUE_LENGTH(b));
const POSITION_TITLE_VALUE = b => POSITION_TITLE_VALUE_LENGTH(b) + 2;

const POSITION_SUMMARY_KEY_LENGTH = b => POSITION_TITLE_VALUE(b) + LENGTH_TITLE_VALUE(b) + zero(0x4);
const LENGTH_SUMMARY_KEY = b => calcLen(b, POSITION_SUMMARY_KEY_LENGTH(b));
const POSITION_SUMMARY_KEY = b => POSITION_SUMMARY_KEY_LENGTH(b) + 2;

const POSITION_SUMMARY_VALUE_LENGTH = b =>
    POSITION_SUMMARY_KEY(b) + LENGTH_SUMMARY_KEY(b) + zero(0x3) + l('?') + zero(0x6);
const LENGTH_SUMMARY_VALUE = b => calcLen(b, POSITION_SUMMARY_VALUE_LENGTH(b));
const POSITION_SUMMARY_VALUE = b => POSITION_SUMMARY_VALUE_LENGTH(b) + 2;

const POSITION_LINK_LENGTH = b =>
    nextNoZeroLength(b, POSITION_SUMMARY_VALUE(b) + LENGTH_SUMMARY_VALUE(b)) + l([0x06, 0x01, 0x1f, 0x87]);
const LENGTH_LINK = b => calcLen(b, POSITION_LINK_LENGTH(b));
const POSITION_LINK = b => POSITION_LINK_LENGTH(b) + 2;

const POSITION_SOURCE_LENGTH = b => POSITION_LINK(b) + LENGTH_LINK(b);
const LENGTH_SOURCE = b => calcLen(b, POSITION_SOURCE_LENGTH(b));
const POSITION_SOURCE = b => POSITION_SOURCE_LENGTH(b) + 2;

const POSITION_APP_LINK_LENGTH = b => POSITION_SOURCE(b) + LENGTH_SOURCE(b);
const LENGTH_APP_LINK = b => calcLen(b, POSITION_APP_LINK_LENGTH(b));
const POSITION_APP_LINK = b => POSITION_APP_LINK_LENGTH(b) + 2;

const POSITION_APP_KEY_LENGTH = b => POSITION_APP_LINK(b) + LENGTH_APP_LINK(b);
const LENGTH_APP_KEY = b => calcLen(b, POSITION_APP_KEY_LENGTH(b));
const POSITION_APP_KEY = b => POSITION_APP_KEY_LENGTH(b) + 2;

const POSITION_APP_INDEX_LENGTH = b => POSITION_APP_KEY(b) + LENGTH_APP_KEY(b);
const LENGTH_APP_INDEX = b => calcLen(b, POSITION_APP_INDEX_LENGTH(b));
const POSITION_APP_INDEX = b => POSITION_APP_INDEX_LENGTH(b) + 2;

const POSITION_APP_ID_LENGTH = b => POSITION_APP_INDEX(b) + LENGTH_APP_INDEX(b);
const LENGTH_APP_ID = b => calcLen(b, POSITION_APP_ID_LENGTH(b));
const POSITION_APP_ID = b => POSITION_APP_ID_LENGTH(b) + 2;

const POSITION_APP_INDEX2_LENGTH = b => POSITION_APP_ID(b) + LENGTH_APP_ID(b);
const LENGTH_APP_INDEX2 = b => calcLen(b, POSITION_APP_INDEX2_LENGTH(b));
const POSITION_APP_INDEX2 = b => POSITION_APP_INDEX2_LENGTH(b) + 2;

const POSITION_LINK2_LENGTH = b => nextNoZeroLength(b, POSITION_APP_INDEX2(b) + LENGTH_APP_INDEX2(b)); // 低位
const LENGTH_LINK2 = b => calcLen(b, POSITION_LINK2_LENGTH(b) - 1);
const POSITION_LINK2 = b => POSITION_LINK2_LENGTH(b) + 1;

// const list = ['6614236974988606068', '6500328718134052119'];
// const list = ['6500328718134052119', '6540969595394411944', '6573652596998050162'];
// '6622505277572313466', // 地图
const list = ['6532651004050921099', '6614236974988606068']; //local
// '6607061682217319006'

for (let i = 0; i < buffArr.length; i++) {
    const b = buffArr[i];
    const f = path.parse(files[i]).name;
    // if (!list.includes(f)) continue;
    // if (b[0xc] !== 2) continue;
    console.log('f', f);
    if (getFileType(b) != 'local') continue;

    console.log('POSITION_URL_LENGTH', POSITION_URL_LENGTH(b).toString(16));
    console.log('POSITION_DES_LENGTH', POSITION_DES_LENGTH(b).toString(16), LENGTH_DES(b).toString(16));
    console.log('', POSITION_F1_LENGTH(b).toString(16), LENGTH_F1(b).toString(16));
    console.log(JSON.stringify(all(b), null, 4));
    // console.log(hexArrRead(b, 0x1f1));
}

function all(b) {
    return [
        { getLink2: getLink2(b) },
        { getAppIndex2: getAppIndex2(b) },
        { getAppID: getAppID(b) },
        { getAppIndex: getAppIndex(b) },
        { getAppKey: getAppKey(b) },
        { getAppLink: getAppLink(b) },
        { getSource: getSource(b) },
        { getLink: getLink(b) },
        { getSummaryValue: getSummaryValue(b) },
        { getSummaryKey: getSummaryKey(b) },
        { getTitleValue: getTitleValue(b) },
        { getTitleKey: getTitleKey(b) },
        { getTypeUrl: getTypeUrl(b) },
        { getType: getType(b) },
        { getF1: getF1(b) },
        { getDes: getDes(b) },
        { getUrl: getUrl(b) },
        { getFileType: getFileType(b) },
        { getContentType: getContentType(b) },
    ];
}

function getLink2(b) {
    return hexArrToStr(b, POSITION_LINK2(b), LENGTH_LINK2(b));
}

function getAppIndex2(b) {
    return hexArrToStr(b, POSITION_APP_INDEX2(b), LENGTH_APP_INDEX2(b));
}

function getAppID(b) {
    return hexArrToStr(b, POSITION_APP_ID(b), LENGTH_APP_ID(b));
}

function getAppIndex(b) {
    return hexArrToStr(b, POSITION_APP_INDEX(b), LENGTH_APP_INDEX(b));
}
function getAppKey(b) {
    return hexArrToStr(b, POSITION_APP_KEY(b), LENGTH_APP_KEY(b));
}
function getAppLink(b) {
    return hexArrToStr(b, POSITION_APP_LINK(b), LENGTH_APP_LINK(b));
}

function getSource(b) {
    return hexArrToStr(b, POSITION_SOURCE(b), LENGTH_SOURCE(b));
}

function getLink(b) {
    return hexArrToStr(b, POSITION_LINK(b), LENGTH_LINK(b));
}

function getSummaryValue(b) {
    return hexArrToStr(b, POSITION_SUMMARY_VALUE(b), LENGTH_SUMMARY_VALUE(b));
}
function getSummaryKey(b) {
    return hexArrToStr(b, POSITION_SUMMARY_KEY(b), LENGTH_SUMMARY_KEY(b));
}

function getTitleValue(b) {
    return hexArrToStr(b, POSITION_TITLE_VALUE(b), LENGTH_TITLE_VALUE(b));
}

function getTitleKey(b) {
    return hexArrToStr(b, POSITION_TITLE_KEY(b), LENGTH_TITLE_KEY(b));
}

function getTypeUrl(b) {
    return hexArrToStr(b, POSITION_TYPE_URL(b), LENGTH_TYPE_URL(b));
}

function getType(b) {
    return hexArrToStr(b, POSITION_TYPE(b), LENGTH_TYPE(b));
}

function getF1(b) {
    return hexArrToStr(b, POSITION_F1(b), LENGTH_F1(b));
}

function getDes(b) {
    return hexArrToStr(b, POSITION_DES(b), LENGTH_DES(b));
}

function getUrl(b) {
    return getFileType(b) === 'local' ? '' : hexArrToStr(b, POSITION_URL(b), LENGTH_URL(b));
}

function getFileType(b) {
    // web or local
    const s = hexArrToStr(b, POSITION_FILE_TYPE, LENGTH_FILE_TYPE(b));
    return !isZeroStr(s) ? s : 'local';
}

function getContentType(b) {
    const t = b[POSITION_CONTENT_TYPE];
    switch (t) {
        case 0x2:
            return DICT_NO_F1_VALUE_ITEM;
        default:
            return 'DEFAULT';
    }
}

function readLenStr(pear) {
    const len = pear.splice(0, 1)[0];
    // const content
}

function hexArrRead(b, start) {
    const pear = Array.from(b.slice(start));
    const fullLen = pear.length;
    let isEnd = false;

    const arr = [];

    const s = pear.splice(0, 1)[0];
    if (s !== 0) {
        console.log('s', s);
        throw new Error('s!==0');
    }
    // !isEnd
    while (pear.length > 0) {
        const len = pear.splice(0, 1)[0];
        const content = pear.splice(0, len);
        arr.push(hexArrToStr(Buffer.from(content), 0, len));

        // isEnd = pear.slice(0, 17).every(e => e === 0);
        console.log('pear', pear.length);
    }

    return { arr, cut: fullLen - pear.length };
}

function hexArrToStr(hexArr, s, e) {
    return hexArr.slice(s, s + e).toString('utf-8');
}

function zero(len) {
    return new Array(len).fill(0).length;
}
function l(v) {
    return !isNaN(v) ? String(v).length : v.length;
}

function calcLen(arr, s) {
    const hp = arr[s];
    const lp = arr[s + 1];
    return hp * 0x100 + lp;
}

function isZeroStr(s) {
    return Buffer.from(s, 'utf-8').toString('hex').replace(/0/g, '').length === 0;
}

function nextNoZeroLength(b, s, add = true) {
    let i = 0;

    while (b[s + i] === 0) {
        i++;
    }
    return add ? s + i : i;
}

setTimeout(() => {}, 1000000);
