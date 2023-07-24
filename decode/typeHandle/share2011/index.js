const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { TYPE_DICT } = require('../../utils/dictMap.js');
const { Log } = require('@/utils/index');
const { decryptProtoBuf } = require('../../decryption/index.js');
const { imageCloudUrl } = require('../image/extend.js');
const { decode: shareDecode, DICT_NO_F1_VALUE_ITEM } = require('./share/index.js');
const { decode: viewMultiMsgDecode } = require('./viewMultiMsg/index.js');
const { matchFile } = require('../../utils/matchFile.js');

const { FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config.js');
const { replaceQQEmoji } = require('../text/decode.js');

const DIR_TYPE = 'share';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);

const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

async function share(m, merger) {
    merger.key = {};
    merger.data = {};

    merger.type = TYPE_DICT('_分享_2011');

    const buff = decryptProtoBuf(m.msgData.data);

    // debug
    // fs.writeFileSync(`./${m.time}-${m._id}.txt`, buff);

    const decodeStr = Buffer.from(buff).toString('utf-8');
    if (decodeStr.includes('viewMultiMsg')) {
        const res = viewMultiMsgDecode(buff, m.uniseq);
        merger.res.msgData = res;
        merger.data = res;

        const body = res.list
            .map(v => {
                v.$html = replaceQQEmoji(v.text);
                return v.$html;
            })
            .join('<br/>');

        if (res.list.length > 1 && res.list[0].size == 34) {
            res.$titleObject = res.list.shift();
        }

        return {
            type: TYPE_DICT('聊天记录'),
            html: `${res.source}<br/>${res.des}<br/>${body}<br/>${res.summaryValue}><br/>`,
        };
    } else {
        // 分享消息 debug
        // fs.writeFileSync(`./t/${m.uniseq}.txt`, buff);
        const res = shareDecode(buff, m.uniseq);
        merger.res.msgData = res;
        merger.data = res;

        if (res.fileType === 'local') {
            const { md5, uuid } = res;

            const urls = imageCloudUrl(uuid);
            merger.key.imageCloudUrl = urls;

            const match = await matchFile(WEB_DIR, FILE_DIR, [md5, urls], m);
            if (match) {
                const { webUrl: coverLocalUrl } = match;
                merger.data.$coverLocalUrl = coverLocalUrl;
            }
        } else {
            const match = await matchFile(WEB_DIR, FILE_DIR, [res.cover], m);
            if (match) {
                const { webUrl: coverLocalUrl } = match;
                merger.data.$coverLocalUrl = coverLocalUrl;
            }
        }

        // app icon
        {
            const match = await matchFile(`${WEB_DIR}/icon`, `${FILE_DIR}/icon`, [res.appIcon], m);
            if (match) {
                const { webUrl: appIconLocalUrl } = match;
                merger.data.$appIconLocalUrl = appIconLocalUrl;
            }
        }

        let { titleValue = '', des = '', appName = '', contentType } = res;

        if (contentType == DICT_NO_F1_VALUE_ITEM) {
            des += res.author;
        }

        return {
            type: TYPE_DICT('分享'),
            html: `${titleValue || appName}<br/>${des}`,
        };
    }
}

module.exports = share;
