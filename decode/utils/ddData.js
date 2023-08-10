const _ = require('lodash');

const { decryptString, decryptProtoBuf, protoBufDecode } = require('../decryption/index.js');

/**
 * @name:
 * @description: decode and delete the data of the message
 * @param undefined
 * @param undefined
 * @return {*}
 */
function ddString(m, p = 'msgData.data') {
    const v = decryptString(_.get(m, p));
    return v;
}

function ddProtoBuf(m, p = 'msgData.data', protoDecoder) {
    const buff = decryptProtoBuf(_.get(m, p));
    const obj = protoBufDecode[protoDecoder].decode(buff);

    // proto 对象  类 Object
    // 例如 Object.assign 会导致 proto对象 toJSON 丢失  导致 JSON.stringify 输出值不一样
    return obj.toJSON();
}

module.exports = {
    ddString,
    ddProtoBuf,
};
