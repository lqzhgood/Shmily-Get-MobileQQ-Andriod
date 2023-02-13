const { mainDB } = require('../utils/db');
const { decryptCharByKeyInCollection } = require('../utils/crypto');
const { group } = require('../lib/utils');

async function multiMessage() {
    const json = await mainDB.jsonPromise('mr_multimessage');

    decryptCharByKeyInCollection(json, ['frienduin', 'selfuin', 'senderuin']);
    const q = group(json, 'msgseq');

    return q;
}

module.exports = multiMessage;
