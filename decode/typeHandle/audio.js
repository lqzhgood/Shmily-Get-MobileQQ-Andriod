const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { ddProtoBuf } = require('../utils/ddData');
const slkToMp3 = require('slk-to-mp3');

const { ASSETS_ROOT_DIR, FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR, DIST_DIR_TEMP } = require('@/config.js');

const ASSET_FILE = require(path.join(DIST_DIR_TEMP, 'ASSET_FILE.json'));
const { matchFile } = require('../utils/matchFile');

const DIR_TYPE = 'audio';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);
const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

const INPUT_DIR = path.join(ASSETS_ROOT_DIR, 'ptt');

async function audio(m, merger) {
    merger.data = {};
    merger.key = {
        match: null, // 通过 match 函数匹配到的本地文件或者远程文件的信息
        files: [], //可能有多个文件 加密与未加密
    };

    merger.res.msgData = ddProtoBuf(m, 'msgData.data', 'PttRec');
    const { md5, directUrl, sttText, voiceLength = -1, localPath, fullLocalPath } = merger.res.msgData;

    const o = {
        sttText,
        mp3Url: null,
        time: voiceLength,
    };

    // 匹配方式及优先级
    // 1. 匹配目录中的文件 -> 原始带日期的文件名  c2c_20220812112
    // 2.1 匹配 MD5 -> MD5文件名
    // 2.2 远程漫游的语音文件

    // 没有匹配到 md5 就直接看看文件在不在
    let relative;
    // /storage/emulated/0/Android/data/com.tencent.mobileqq/Tencent/MobileQQ/*******/ptt/c2c_20220812112

    if (localPath.split('/ptt/')[1]) {
        relative = localPath.split('/ptt/')[1];
    } else if (fullLocalPath.split('/ptt/')[1]) {
        relative = fullLocalPath.split('/ptt/')[1];
    }

    if (relative) {
        const { dir, name } = path.parse(relative);
        const sourceDir = path.join(INPUT_DIR, dir);

        let sFiles = [];

        if (fs.existsSync(sourceDir)) {
            sFiles = fs
                .readdirSync(sourceDir)
                .filter(v => v.startsWith(name))
                .map(f => ({
                    f,
                    f_p: path.join(sourceDir, f),
                }));
        }

        if (sFiles.length === 0) {
            // 如果相应目录没有,则从资源文件夹找
            sFiles = ASSET_FILE.filter(v => v.f.startsWith(name));
        }

        // 如果上面能找到匹配 则处理
        if (sFiles.length > 0) {
            // arm 优先
            sFiles.sort((a, b) => {
                return path.parse(a.f).ext.toLowerCase() === '.arm' ? -1 : 1;
            });

            const sourceFile = sFiles[0].f_p;
            const targetDir = path.join(FILE_DIR, dir);
            fs.mkdirpSync(targetDir);
            const targetFile = path.join(targetDir, path.parse(sourceFile).base);
            fs.copyFileSync(sourceFile, targetFile);
            await slkToMp3(targetFile, targetDir, name);
            o.mp3Url = `${WEB_DIR}/${dir}/${name}.mp3`;
        }
        merger.key.files = sFiles;
    } else {
        const match = await matchFile(WEB_DIR, FILE_DIR, [md5, directUrl], m);

        if (match) {
            merger.key.match = match;
            const { webUrl } = match;

            // 这里可能是 md5 匹配到的 slk 文件 和 服务器上的 arm / mp3 文件
            // mp3 直接赋值，其他格式需要转码，统统丢给 slkToMp3 处理。
            const { base, ext, name } = path.parse(webUrl);
            if (ext.toLowerCase() === '.mp3') {
                o.mp3Url = webUrl;
            } else {
                const targetFile = path.join(FILE_DIR, base);
                await slkToMp3(targetFile, FILE_DIR, name);
                o.mp3Url = `${WEB_DIR}/${name}.mp3`;
            }
        }
    }

    merger.data = o;

    return {
        html: `${o.sttText} ${o.time}s ${o.mp3Url || ''}`,
    };
}

module.exports = audio;
