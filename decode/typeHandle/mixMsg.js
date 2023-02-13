const { Log } = require('@/utils/index');
const { ddProtoBuf } = require('../utils/ddData');
const { replaceQQEmoji } = require('./text/decode');

const { TYPE_DICT } = require('../utils/dictMap');

const { imgDataHandle, calcImgCrcDirArr } = require('./image/decode.js');

async function mixMsg(m) {
    m.$data.msgData = ddProtoBuf(m, 'msgData.data', 'Msg');

    m.$data.elemList = []; // 包含解密过程中间数据

    const elemList = m.$data.msgData.elems;

    const mixArr = [];

    let hasPic = true;

    for (let i = 0; i < elemList.length; i++) {
        const eObj = elemList[i];
        const types = Object.keys(eObj);
        if (types.length !== 1) Log.errAndThrow('mixMsg has multi type', m);

        const t = types[0];
        const v = eObj[t];

        switch (t) {
            case 'textMsg':
                m.$data.elemList[i] = v;
                mixArr.push({
                    type: TYPE_DICT('_文本'),
                    html: replaceQQEmoji(v),
                });
                break;
            case 'picMsg': {
                const imgCrcFiles = calcImgCrcDirArr(m.$data.msgData.md5);
                const imgUrl = await imgDataHandle(v, imgCrcFiles, m);
                m.$data.elemList[i] = { imgCrcFiles };

                mixArr.push({
                    type: TYPE_DICT('图片'),
                    html: '[图]',
                    data: {
                        imgUrl,
                    },
                });
                hasPic = true;
                break;
            }
            default:
                Log.errAndThrow('mixMsg unknown type', m);
                break;
        }
    }

    return {
        type: hasPic ? TYPE_DICT('图片') : TYPE_DICT('消息'),
        html: mixArr.map(v => v.html).join('<br/>'),
        merger: {
            hasPic,
            mixArr,
        },
    };
}

module.exports = mixMsg;
