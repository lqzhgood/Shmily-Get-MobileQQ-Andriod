const path = require('path');
const fs = require('fs-extra');
const { Log } = require('@/utils/index');
const { ddString } = require('../utils/ddData');
const { TYPE_DICT } = require('../utils/dictMap.js');
const { matchFile } = require('../utils/matchFile.js');

const { FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config.js');

const DIR_TYPE = 'share';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);

const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

// 分享的 卡片消息
async function shareCard(m, type) {
    const str = ddString(m, 'msgData.data');

    // 含义未知 有以下几种情况
    // 0: "��\u0000\u0005t\u0001�"
    // 1: "��\u0000\u0005t\u0002�"
    // 2: "��\u0000\u0005t\u0002w"
    const pre = str.substring(0, 7);

    m.$data.msgData = JSON.parse(str.substring(7));
    const res = await shareCardType(m);
    return res;
}

async function shareCardType(m) {
    const json = m.$data.msgData;
    const { app, meta } = json;
    switch (app) {
        case 'com.tencent.map': {
            // "Location.Search": {
            //     "id": "",
            //     "name": "位置分享",
            //     "address": "湖南省长沙市浏阳国际家具城西50米(开元大道北)",
            //     "lat": 28.273582,
            //     "lng": 113.365936,
            //     "from": "plusPanel"
            // }
            const { address, lat, lng, name } = meta['Location.Search'];
            return {
                type: TYPE_DICT('位置'),
                html: `${address}<br/>${lat},${lng}<br/>${name}`,
                merger: {
                    location: meta['Location.Search'],
                },
            };
        }
        case 'com.tencent.structmsg': {
            // news: {
            //     title: '【杭州#失联女童和父亲最后通话#：爸爸 我回不来了】#失联...',
            //     desc: '来自 新浪新闻客户端 的微博',
            //     preview: 'url.cn/54iqpY2', // 过期
            //     tag: '新浪微博',
            //     jumpUrl: 'url.cn/5DteCnh', // 真实 url https://m.weibo.cn/status/4393686140019894?sourceType=qq&from=1097195010&wm=20005_0002&featurecode=newtitle
            //     appid: 100736903,
            //     app_type: 1,
            //     action: '',
            //     source_url: 'url.cn/51Spvti',  // https://web.p.qq.com/qqmpmobile/aio/app.html?id=100736903
            //     source_icon: 'url.cn/5sVXO4i', // icon png
            //     android_pkg_name: 'com.sina.weibo'
            //   }
            const { tag, title, desc, source_icon } = meta.news;

            const iconLinkArr = source_icon.startsWith('http')
                ? [source_icon]
                : [`https://${source_icon}`, `http://${source_icon}`];

            const match = await matchFile(`${WEB_DIR}/icon`, `${FILE_DIR}/icon`, iconLinkArr, m);
            if (match) {
                const { webUrl: iconLocalUrl } = match;
                meta.news.$iconLocalUrl = iconLocalUrl;
            }

            return {
                type: TYPE_DICT('分享'),
                html: `${tag}<br/>${title}<br/>${desc}`,
            };
        }
        default:
            Log.unknownType(m);
            return {
                type: TYPE_DICT('分享'),
                html: JSON.stringify(json, null, 4),
            };
    }
}

module.exports = shareCard;
