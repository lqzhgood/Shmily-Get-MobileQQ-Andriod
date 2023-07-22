const path = require('path');
const fs = require('fs-extra');
const { FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config.js');

const { Log } = require('@/utils/index');
const { TYPE_DICT } = require('../../../../utils/dictMap.js');

const { matchFile } = require('../../../../utils/matchFile.js');

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
    const { tag, title, desc, source_icon } = metaData;

    merger.type = TYPE_DICT('_分享_5008');
    merger.data = metaData;
    merger.data.$view = view;

    if (source_icon) {
        const iconLinkArr = source_icon.startsWith('http')
            ? [source_icon]
            : [`https://${source_icon}`, `http://${source_icon}`];

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
