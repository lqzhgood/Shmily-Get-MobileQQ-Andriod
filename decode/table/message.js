const _ = require('lodash');

const { leftNum } = require('../../config');
const { md5Str, decryptCharByKeyInCollection } = require('../decryption');

const { mainDB, slowDB } = require('../utils/db');

const msgTable = `mr_friend_${md5Str(leftNum).toUpperCase()}_New`;

async function message() {
    const mainJSON = await mainDB.jsonPromise(msgTable);
    let slowJSON = [];
    try {
        slowJSON = await slowDB.jsonPromise(msgTable);
    } catch (error) {
        //slowtable.db might not have that table since the regular database is enough to store messages
    }
    const arr = _.sortBy([].concat(slowJSON, mainJSON), ['time', '_id']);

    decryptCharByKeyInCollection(arr, ['extStr', 'frienduin', 'selfuin', 'senderuin']);
    return arr;
}

module.exports = message;
