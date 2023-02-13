const { ddProtoBuf } = require('../../utils/ddData');
const { imgDataHandle, calcImgCrcDirArr } = require('./decode');

/**
 * @name:
 * @description: 不是 100% 准确
 * @param undefined
 * @return {*}
 */
async function image(m) {
    m.$data.msgData = ddProtoBuf(m, 'msgData.data', 'PicRec');

    const imgCrcFiles = calcImgCrcDirArr(m.$data.msgData.md5);
    m.$data.imgCrcFiles = imgCrcFiles;

    const imgUrl = await imgDataHandle(m.$data.msgData, imgCrcFiles, m);

    return {
        html: '[图]',
        merger: {
            imgUrl,
        },
    };
}

module.exports = image;
