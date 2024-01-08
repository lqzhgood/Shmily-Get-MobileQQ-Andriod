const { mainDB, getTableName } = require('../utils/db');
const { decryptCharByKeyInCollection } = require('../decryption');
const { group } = require('../../utils/index');

/**
 * @name:
 * @description:  好友列表
 * @return {*}
 */
async function friends() {
    const json = await mainDB.jsonPromise('Friends');

    decryptCharByKeyInCollection(json, [
        'uin',
        'name',
        'remark',
        'mCompareSpell',
    ]);

    json.forEach(p => {
        if (!p.remark) p.remark = p.name;
    });

    return json;
}

/**
 * @name:
 * @description: 看名字像群昵称
 * @return {*}
 */
async function friendMulti() {
    const tables = getTableName(mainDB);
    const table = 'MultiMsgNick';

    // 有案例不存在
    if (tables.includes(table)) {
        const json = await mainDB.jsonPromise('MultiMsgNick');
        decryptCharByKeyInCollection(json, ['uin', 'nick']);
        const q = group(json, 'uniseq');
        return q;
    } else {
        return [];
    }
}

module.exports = { friends, friendMulti };
