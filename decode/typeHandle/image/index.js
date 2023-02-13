const { ddProtoBuf } = require('../../utils/ddData');
const { imgDataHandle, calcImgCrcDirArr } = require('./decode');

/**
 * @name:
 * @description: 不是 100% 准确
 * @param undefined
 * @return {*}
 */
async function image(m, merger) {
    merger.key = {};
    merger.data = {};

    const decode = ddProtoBuf(m, 'msgData.data', 'PicRec');
    merger.res.msgData = decode;

    const imgCrcFiles = calcImgCrcDirArr(decode.md5);
    merger.key.imgCrcFiles = imgCrcFiles;

    const imgUrl = await imgDataHandle(decode, imgCrcFiles, m, merger);
    merger.data.imgUrl = imgUrl;

    return {
        html: '[图]',
    };
}

module.exports = image;
