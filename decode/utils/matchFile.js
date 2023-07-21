const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const cheerio = require('cheerio');

const { sleep, Log } = require('../../utils/index');
const { down, isUrl } = require('../../utils/net');
const { getMD5, giveExt, getJSON, strToUtf8, WriteStack } = require('../../utils/file');

const { DIST_DIR_TEMP } = require('@/config.js');

const MATCH_FILE = path.join(DIST_DIR_TEMP, './MATCH_FILE.json');
const MATCH_FILE_JSON = getJSON(MATCH_FILE, []);

// {
//     "f": "123.docx",
//     "f_p": "E:\\123.docx",
//     "md5": "67111508c35fb21188696a410f42beed"
// }
const ASSET_FILE_JSON = getJSON(path.join(DIST_DIR_TEMP, './ASSET_FILE.json'), []);

async function matchFile(webDir, fileDir, list, logM = {}, type) {
    list = list.filter(v => v);
    let res = null;
    for (let i = 0; i < list.length; i++) {
        const l = list[i];

        // 查找匹配列表 如果有就拿走
        const matchRes = MATCH_FILE_JSON.find(
            v => _.intersectionBy(list, v.aliasList, s => s.toLowerCase()).length !== 0,
        );
        if (matchRes) {
            const { webUrl, filePath, fileName, md5, ext, url } = matchRes;
            // console.count('match json');

            const targetFile = path.join(fileDir, fileName);
            if (!fs.existsSync(filePath)) Log.errAndThrow('matchFile not exists', filePath, matchRes);

            if (filePath !== targetFile) {
                fs.copyFileSync(filePath, targetFile);
            }
            return matchRes;
        }

        let mType;
        if (/^([a-f\d]{32}|[A-F\d]{32})$/.test(l)) {
            mType = 'md5';
        } else if (isUrl(l)) {
            mType = 'url';
        } else {
            Log.errAndThrow('无法识别的 match 类型', l, logM._id);
        }

        // 到这的都已经滤过了 MATCH_FILE 不再额外判断了
        switch (mType) {
            case 'md5': {
                // 匹配资源列表
                // type 没用到, 仅预留
                const md5Res = await matchMd5(l, fileDir, ['文件'].includes(type));
                if (md5Res) {
                    const { f, md5, ext } = md5Res;
                    res = await addMatchJson(f, webDir, list, { md5, ext });
                    // console.count('match md5');
                }
                break;
            }
            case 'url': {
                const downRes = await downFile(l, fileDir);
                if (downRes) {
                    const { f, md5, ext, url } = downRes;
                    res = await addMatchJson(f, webDir, list, {
                        md5,
                        ext,
                        url,
                    });
                    await sleep();
                    // console.count('match down');
                } else {
                    // console.count('match down error');
                }
                break;
            }
            default:
                Log.errAndThrow('未知的 match 类型', list, l, logM);
        }

        if (res) break;
    }

    //
    //     {
    //         "fileName": 'md5.png',
    //         "webUrl": "/data/qq-android/image/md5.png",
    //         "md5": "md5",
    //         "ext": ".png",
    //         "url": "",
    //         "aliasList": []
    //     },
    //
    return res;
}

async function matchMd5(md5, fileDir, useOriginalName = false) {
    const find = ASSET_FILE_JSON.find(v => v.md5.toLowerCase() === md5.toLowerCase());
    if (!find) return null;
    const { f, f_p, md5: _md5 } = find;

    const ext = await giveExt(f_p);

    const targetFile = path.join(fileDir, useOriginalName ? f : `${_md5}${ext}`);
    fs.copyFileSync(f_p, targetFile);

    return { f: targetFile, md5, ext };
}

const SPECIAL_FILES = {
    404: [
        'fb9ac55708370a43f658730f8715dcb1', //404.html
    ],
};

async function downFile(url, fileDir) {
    const [err, tmpFile] = await down(url);

    if (err) {
        // 404 很正常
        if (err?.response?.status !== 404) {
            Log.err('Down File Error', err.message, url);
        }
        return null;
    }

    const md5 = await getMD5(tmpFile);

    if (SPECIAL_FILES[404].includes(md5)) {
        return null;
    }

    const buff = fs.readFileSync(tmpFile);
    const tmpExt = path.parse(tmpFile).ext;

    // 有些链接下载后会有不符合 httpCode 规范的 200 HTML 文件,
    if (tmpExt === '.html') {
        const html = strToUtf8(buff);
        const $ = cheerio.load(html, { decodeEntities: false }, false);
        if (html.includes('长按网址复制')) {
            // <div class="wrap"><p class="desc">如需浏览，请长按网址复制后使用浏览器访问</p><p class="link">https://tva1.sinaimg.cn/crop.0.0.750.750.50/005MGa9Ljw8f8cqhjcvn7j30ku0ku3z5.jpg</p></div>
            const realUrl = $('p.link').text();
            if (!realUrl) {
                Log.err('Down File Error', 'realUrl is empty , maybe html template change', url);
                throw new Error('');
            }
            const realRes = await downFile(realUrl, fileDir);
            return realRes;
        } else if (html.includes('您访问的网页不存在')) {
            return null;
        }
    }

    const ext = await giveExt(tmpFile);

    const fileName = `${md5}${ext}`;
    const targetFile = path.join(fileDir, fileName);
    fs.moveSync(tmpFile, targetFile, { overwrite: true });

    return { f: targetFile, md5, ext, url };
}

async function addMatchJson(f, webDir, list, { md5, ext, url = '' }) {
    md5 = md5 || (await getMD5(f));
    ext = ext || (await giveExt(f));

    const { base: fileName } = path.parse(f);

    const res = {
        webUrl: `${webDir}/${fileName}`,
        filePath: f,
        fileName,
        md5,
        ext,
        url,
        aliasList: list,
    };
    MATCH_FILE_JSON.push(res);
    // !!! 不知道为什么有时候写入会有 unknown error， 同步应该是线程安全的啊
    // fs.writeFileSync(MATCH_FILE_JSON, JSON.stringify(MATCH_FILE_JSON, null, 4));

    WriteStack.w(MATCH_FILE, MATCH_FILE_JSON);

    return res;
}

module.exports = {
    matchFile,
};
