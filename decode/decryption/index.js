const path = require('path');
const crypto = require('crypto');
const protoBuf = require('protobufjs');

const { KEY } = require('../../config');

function md5Str(str) {
    const md5 = crypto.createHash('md5');
    return md5.update(str).digest('hex');
}

function decryptChar(data) {
    if (data == null) {
        return '';
    } else {
        const keyArr = KEY.split('');
        const dataArr = data.split('');
        let dataStr = '';
        for (let i = 0; i < data.length; i++) {
            dataStr += String.fromCharCode(dataArr[i].charCodeAt(0) ^ keyArr[i % keyArr.length].charCodeAt(0));
        }
        return dataStr;
    }
}

function decryptCharByKeyInCollection(arr, keys) {
    arr.forEach(v => {
        for (let i = 0; i < keys.length; i++) {
            v[keys[i]] = decryptChar(v[keys[i]]);
        }
    });
}

function jsonParseByKeyInCollection(arr, keys) {
    arr.forEach(v => {
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];

            if (v[k]) v[k] = JSON.parse(v[k]);
        }
    });
}

function decryptString(data) {
    if (data == null) {
        return '';
    } else {
        const keyArr = KEY.split('');
        const dataByte = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            dataByte[i] = data[i] ^ keyArr[i % keyArr.length].charCodeAt(0);
        }
        return Buffer.from(dataByte).toString('utf8');
    }
}

function decryptProtoBuf(data) {
    if (data == null) {
        return Buffer.from([]);
    } else {
        let keyArr = KEY.split('');
        let dataByte = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            dataByte[i] = data[i] ^ keyArr[i % keyArr.length].charCodeAt(0);
        }
        return Buffer.from(dataByte);
    }
}

const protoBufDecode = protoBuf.loadSync(path.join(__dirname, './RichMsgHandle.proto'));

module.exports = {
    KEY,
    md5Str,
    decryptCharByKeyInCollection,
    jsonParseByKeyInCollection,
    decryptString,
    decryptProtoBuf,
    protoBufDecode,
};
