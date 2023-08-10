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

    return obj;
}

module.exports = {
    ddString,
    ddProtoBuf,
};
