const { mainDB } = require('../utils/db');
const { decryptCharByKeyInCollection, jsonParseByKeyInCollection } = require('../decryption');

async function Emoticon() {
    const json = await mainDB.jsonPromise('Emoticon');

    decryptCharByKeyInCollection(json, ['eId', 'epId', 'name', 'encryptKey', 'keyword', 'keywords', 'businessExtra']);
    return json;
}
async function EmoticonKeyword() {
    const json = await mainDB.jsonPromise('EmoticonKeyword');

    decryptCharByKeyInCollection(json, ['eId', 'encryptKey', 'epId', 'keyword', 'keywords', 'name', 'businessExtra']);

    return json;
}
async function EmoticonPackage() {
    const json = await mainDB.jsonPromise('EmoticonPackage');

    decryptCharByKeyInCollection(json, [
        'epId',
        'minQQVersion',
        'name',
        'mark',
        'supportSize',
        'businessExtra',
        'buttonWording',
        'comeFom',
        'copywritingContent',
        'diversionName',
        'imageUrl',
        'jumpUrl',
    ]);

    jsonParseByKeyInCollection(json, ['supportSize']);

    return json;
}
async function EmoticonTab() {
    const json = await mainDB.jsonPromise('EmoticonTab');

    decryptCharByKeyInCollection(json, ['epId']);

    return json;
}

module.exports = { Emoticon, EmoticonKeyword, EmoticonPackage, EmoticonTab };
