const _ = require('lodash');
const { decryptString, decryptProtoBuf, protoBufDecode } = require('../decryption/index.js');

function test(m) {
    const data = {};

    data.decryptString = decryptString(m.msgData.data);

    const buff = decryptProtoBuf(m.msgData.data);
    data.decryptProtoBuf = buff.toString();

    const methods = Object.keys(protoBufDecode).filter(v => /^[A-Z]/.test(v));

    for (let k = 0; k < methods.length; k++) {
        const method = methods[k];
        let res;
        try {
            res = protoBufDecode[method].decode(buff);
        } catch (error) {
            res = error.message;
        }
        _.set(data, `${method}.decode`, res);
    }

    return data;
}

module.exports = test;
