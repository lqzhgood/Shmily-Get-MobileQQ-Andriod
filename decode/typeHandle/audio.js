const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { ddProtoBuf } = require('../utils/ddData');
const slkToMp3 = require('slk-to-mp3');

const ASSET_FILE = require('../../dist/ASSET_FILE.json');
const { ASSETS_ROOT_DIR, FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config.js');
const { matchFile } = require('../utils/matchFile');

const DIR_TYPE = 'audio';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);
const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

const INPUT_DIR = path.join(ASSETS_ROOT_DIR, 'ptt');

async function audio(m, merger) {
    merger.data = {};
    merger.key = {
        files: [], //可能有多个文件 加密与未加密
    };

    merger.res.msgData = ddProtoBuf(m, 'msgData.data', 'PttRec');
    const { directUrl, sttText, voiceLength = -1, localPath, fullLocalPath } = merger.res.msgData;

    const o = {
        sttText,
        mp3Url: null,
        time: voiceLength,
    };

    const match = await matchFile(WEB_DIR, FILE_DIR, [directUrl], m);

    if (match) {
        o.mp3Url = match.webUrl;
    } else {
        const relative = localPath.split('/ptt/')[1];
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
    }

    merger.data = o;

    return {
        html: `${o.sttText} ${o.time}s ${o.mp3Url || ''}`,
    };
}

module.exports = audio;
