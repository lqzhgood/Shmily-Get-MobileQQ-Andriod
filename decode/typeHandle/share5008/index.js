const { Log } = require('@/utils/index');
const { ddString } = require('../../utils/ddData');
const { TYPE_DICT } = require('../../utils/dictMap.js');

const Card_map = require('./app/map/index.js');
const Card_multimsg = require('./app/multimsg/index.js');
const Card_structmsg = require('./app/structmsg/index.js');

// 分享的 卡片消息
async function shareCard(m, merger) {
    merger.data = {};

    const str = ddString(m, 'msgData.data');

    // 含义未知 有以下几种情况
    // 0: "��\u0000\u0005t\u0001�"
    // 1: "��\u0000\u0005t\u0002�"
    // 2: "��\u0000\u0005t\u0002w"
    const pre = str.substring(0, 7);

    merger.res.msgData = JSON.parse(str.substring(7));
    const res = await shareCardType(m, merger);
    return res;
}

async function shareCardType(m, merger) {
    const json = merger.res.msgData;
    const { app, view, meta } = json;

    switch (app) {
        case 'com.tencent.map': {
            return Card_map(m, merger);
        }
        case 'com.tencent.structmsg': {
            const o = await Card_structmsg(m, merger);
            return o;
        }
        case 'com.tencent.multimsg': {
            const o = await Card_multimsg(m, merger);
            return o;
        }
    }

    // 未匹配到的会到这，全部打上未知的标记
    Log.unknownType(m, merger);
    return {
        type: TYPE_DICT('分享'),
        html: JSON.stringify(json, null, 4),
    };
}

module.exports = shareCard;
