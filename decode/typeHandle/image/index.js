const { ddProtoBuf } = require('../../utils/ddData');
const { imgDataHandle, calcImgCrcDirArr } = require('./decode');
const { imgDecodeByJava } = require('./decode-java');

/**
 * @name:
 * @description: 不是 100% 准确
 * @param undefined
 * @return {*}
 */
async function image(m, merger) {
    merger.key = {};
    merger.data = {};

    // java 相同语言解码出来出错概率更少
    let decode = {};

    decode = imgDecodeByJava(m);

    try {
        // js 解码出来字段更多，以js解码的数据为准
        // 但 js 解码的 .proto 可能不完整 导致报错
        const decode_js = ddProtoBuf(m, 'msgData.data', 'PicRec');
        decode = Object.assign(decode, decode_js);
    } catch (error) {
        // js decode error
        // console.log('img js decode error', m.time, error.message);
    }

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
