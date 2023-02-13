const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { Log } = require('@/utils/index');
const { decryptProtoBuf } = require('../../decryption/index.js');
const { imageCloudUrl } = require('../image/extend.js');
const { decode, DICT_NO_F1_VALUE_ITEM } = require('./decode.js');
const { matchFile } = require('../../utils/matchFile.js');

const { FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config.js');

const DIR_TYPE = 'share';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);

const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

async function share(m) {
    const buff = decryptProtoBuf(m.msgData.data);
    _.unset(m, 'msgData.data');

    const decodeStr = Buffer.from(buff).toString('utf-8');
    if (decodeStr.includes('viewMultiMsg')) {
        // TODO
        // 没有样本

        // const find = frm.find(f => f.uniseq === m.uniseq);
        // if (find) console.log('find', find);
        // Person sender = multiMsgFriendMap.getOrDefault(this.msgseq, friendMap).getOrDefault(senderuin, new Person(senderuin, senderuin));

        m.$data.msgData = decodeStr;
        Log.unknownType(m);

        return {
            html: '[转发消息]' + decodeStr,
            merger: {},
        };
    } else {
        // 分享消息 debug
        // fs.writeFileSync(`./t/${m.uniseq}.txt`, buff);
        const res = decode(buff, m.uniseq);
        m.$data.msgData = res;

        if (res.fileType === 'local') {
            const { md5, uuid } = res;
            const match = await matchFile(WEB_DIR, FILE_DIR, [md5, imageCloudUrl(uuid)], m);
            if (match) {
                const { webUrl: coverLocalUrl } = match;
                res.$coverLocalUrl = coverLocalUrl;
            }
        } else {
            const match = await matchFile(WEB_DIR, FILE_DIR, [res.cover], m);
            if (match) {
                const { webUrl: coverLocalUrl } = match;
                res.$coverLocalUrl = coverLocalUrl;
            }
        }

        // app icon
        {
            const match = await matchFile(`${WEB_DIR}/icon`, `${FILE_DIR}/icon`, [res.appIcon], m);
            if (match) {
                const { webUrl: appIconLocalUrl } = match;
                res.$appIconLocalUrl = appIconLocalUrl;
            }
        }

        let { titleValue = '', des = '', appName = '', contentType } = res;

        if (contentType == DICT_NO_F1_VALUE_ITEM) {
            des += res.author;
        }
        return {
            html: `${titleValue || appName}<br/>${des}`,
            merger: {},
        };
    }
}

module.exports = share;
