const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');
const { FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config.js');

const { TYPE_DICT } = require('../../../../utils/dictMap.js');

const { shareCommon } = require('../utils.js');

const { matchFile, getHasProtocolUrlArr } = require('../../../../utils/matchFile.js');

const DIR_TYPE = 'share';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);

const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

async function handler(m, merger) {
    const json = merger.res.msgData;
    const { meta } = json;

    const metaData = meta.albumData;

    merger.data = metaData;
    shareCommon(m, merger);

    const { host_nick, title, desc, iconUrl, pics } = metaData;

    if (iconUrl) {
        const iconLinkArr = getHasProtocolUrlArr(iconUrl);

        const match = await matchFile(`${WEB_DIR}/icon`, `${FILE_DIR}/icon`, iconLinkArr, m);
        if (match) {
            const { webUrl: iconLocalUrl } = match;
            merger.data.$iconLocalUrl = iconLocalUrl;
        }
    }

    if (Array.isArray(pics)) {
        for (let i = 0; i < pics.length; i++) {
            const p = pics[i];

            const match = await matchFile(`${WEB_DIR}/icon`, `${FILE_DIR}/icon`, getHasProtocolUrlArr(p.url), m);
            if (match) {
                const { webUrl } = match;
                p.$url = webUrl;
            }
        }
    }
    return {
        type: TYPE_DICT('分享'),
        html: `QQ空间<br/>${host_nick}<br/>${title}<br/>${desc}`,
    };
}

module.exports = handler;
