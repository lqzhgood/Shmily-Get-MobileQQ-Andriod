const { Log } = require("@/utils/index");
const { ddProtoBuf } = require("../utils/ddData");
const { replaceQQEmoji } = require("./text/decode");

const { TYPE_DICT } = require("../utils/dictMap");

const { imgDataHandle, calcImgCrcDirArr } = require("./image/decode.js");

async function mixMsg(m, merger) {
    merger.data = {};

    merger.res.msgData = ddProtoBuf(m, "msgData.data", "Msg");

    merger.key = {};
    merger.key.elemList = []; // 包含解密过程中间数据

    const elemList = merger.res.msgData.elems;

    const mixArr = [];

    let hasPic = true;

    for (let i = 0; i < elemList.length; i++) {
        const eObj = elemList[i];
        const types = Object.keys(eObj);
        if (types.length !== 1) Log.errAndThrow("mixMsg has multi type", m);

        const t = types[0];
        const v = eObj[t];

        switch (t) {
            case "textMsg":
                merger.key.elemList[i] = v;
                mixArr.push({
                    type: TYPE_DICT("_文本"),
                    html: replaceQQEmoji(v),
                });
                break;
            case "picMsg": {
                const thisMerger = { key: {} };

                const imgCrcFiles = calcImgCrcDirArr(merger.res.msgData.md5);
                thisMerger.key.imgCrcFiles = imgCrcFiles;

                const imgUrl = await imgDataHandle(
                    v,
                    imgCrcFiles,
                    m,
                    thisMerger
                );

                merger.key.elemList[i] = thisMerger.key;

                mixArr.push({
                    type: TYPE_DICT("图片"),
                    html: "[图]",
                    data: {
                        imgUrl,
                    },
                });
                hasPic = true;
                break;
            }
            default:
                Log.errAndThrow("mixMsg unknown type", m);
                break;
        }
    }

    merger.data = {
        type: "_混合消息", // 此标识符会标记此条消息特殊处理
        hasPic,
        mixArr,
    };

    return {
        type: hasPic ? TYPE_DICT("图片") : TYPE_DICT("消息"),
        html: mixArr.map((v) => v.html).join("<br/>"),
    };
}

module.exports = mixMsg;
