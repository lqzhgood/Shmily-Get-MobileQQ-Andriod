const path = require('path');
const fs = require('fs-extra');
const { FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config.js');

const { Log } = require('@/utils/index');
const { TYPE_DICT } = require('../../../../utils/dictMap.js');
const { shareCommon } = require('../utils.js');
const { matchFile, getHasProtocolUrlArr } = require('../../../../utils/matchFile.js');

const DIR_TYPE = 'share';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);

const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

const news = require('./news.js');
const music = require('./music.js');

async function handler(m, merger) {
    const json = merger.res.msgData;
    const { app, view, meta } = json;

    const metaData = meta[view];

    merger.data = metaData;
    shareCommon(m, merger);

    const { tag, title, desc, source_icon } = metaData;

    if (source_icon) {
        const iconLinkArr = getHasProtocolUrlArr(source_icon);

        const match = await matchFile(`${WEB_DIR}/icon`, `${FILE_DIR}/icon`, iconLinkArr, m);
        if (match) {
            const { webUrl: iconLocalUrl } = match;
            merger.data.$iconLocalUrl = iconLocalUrl;
        }
    }

    switch (view) {
        case 'news': {
            await news(m, merger, metaData);
            break;
        }
        case 'music': {
            await music(m, merger, metaData);
            break;
        }

        default:
            Log.unknownType(m, merger);
    }

    return {
        type: TYPE_DICT('分享'),
        html: `${tag}<br/>${title}<br/>${desc}`,
    };
}

module.exports = handler;
