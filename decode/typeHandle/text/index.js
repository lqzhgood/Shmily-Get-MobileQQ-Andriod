const fs = require('fs-extra');
const path = require('path');
const { ddString, ddProtoBuf } = require('../../utils/ddData');
const { TYPE_DICT } = require('../../utils/dictMap.js');
const { FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config');
const { Log } = require('../../../utils/index.js');

const { replaceQQEmoji } = require('./decode');

const DIR_TYPE = 'emoji';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);
const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

fs.copySync(path.join(__dirname, '../../../lib/qqEmoji/emoji/'), FILE_DIR);

function text(m, type) {
    let txt = '';
    switch (type) {
        case TYPE_DICT('_文本'):
        case TYPE_DICT('_文本_长文本'):
            txt = plain(m);
            break;
        case TYPE_DICT('_文本_回复的消息'):
            txt = '[回复的消息]<br/>' + plain(m);
            break;
        case TYPE_DICT('_文本_戳一戳'):
        case TYPE_DICT('_文本_未知动作'):
            txt = actionPoke(m);
            break;
        case TYPE_DICT('_文本_撤回'):
            txt = withdraw(m);
            break;
        default:
            throw new Error('未知的系统类型 不该出现');
    }

    if (txt.includes('\u0014')) {
        Log.warn('有新的QQ表情未处理', txt);
    }

    return txt;
}

function plain(m) {
    m.$data.msgData = ddString(m, 'msgData.data');
    const str = replaceQQEmoji(m.$data.msgData, WEB_DIR);
    return str;
}

// 戳一戳
function actionPoke(m) {
    m.$data.msgData = JSON.parse(ddString(m, 'msgData.data'));
    return m.$data.msgData.msg;
}

function withdraw(m) {
    m.$data.msgData = ddProtoBuf(m, 'msgData.data', 'Tip');
    return m.$data.msgData.tip;
}

// debug use
function getEmojiMagicArr(m) {
    const arr = Array.from(Buffer.from(m.$data.msgData)).map(v => v.toString(16));

    console.log('', Buffer.from(m.$data.msgData).toString('hex'));

    const group = [];
    while (arr.length > 0) {
        let n = arr.slice(1).findIndex(v => v === '14');
        if (n === 0) n = 1; // 表情有 1414 的情况
        let p;
        if (n !== -1) {
            p = arr.splice(0, n + 1);
        } else {
            p = arr.splice(0, arr.length);
        }
        group.push(p);
    }
    console.log('group', arr, group);
    return group;
}

module.exports = text;
