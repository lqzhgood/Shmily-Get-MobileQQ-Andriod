const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { ddProtoBuf } = require('../utils/ddData');
const { Log } = require('@/utils/index');
const { EXT_VIDEO, EXT_IMAGE, copyFile } = require('@/utils/file');

const { ASSETS_ROOT_DIR, FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR, DIST_DIR_TEMP } = require('@/config.js');

const ASSET_FILE = require(path.join(DIST_DIR_TEMP, 'ASSET_FILE.json'));

const { matchFile } = require('../utils/matchFile');

const DIR_TYPE = 'video';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);
const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

const INPUT_DIR = path.join(ASSETS_ROOT_DIR, 'video');

if (!fs.existsSync(INPUT_DIR)) fs.mkdirpSync(INPUT_DIR);

const VIDEO_DIR_MD5 = fs.readdirSync(INPUT_DIR);

async function video(m, merger) {
    merger.data = {};

    const o = {
        videoLocalUrl: '',
        videoCoverUrl: '', // 前端有使用作为找不到的视频封面的图片 但是QQ本身没有这张图
    };

    merger.res.msgData = ddProtoBuf(m, 'msgData.data', 'ShortVideo');
    const { fileSize, localPath } = merger.res.msgData;

    // /storage/emulated/0/Tencent/MobileQQ/shortvideo/B45296345682EE81D65AC3C47A4C5EEB/${fileName}
    // /storage/emulated/0/Tencent/MobileQQ/shortvideo/655DA27155B64C359F7C036A064565D6.mp4
    // fileName = ${m.selfuin or m.senderuin}${m.uniseq}.mp4
    // 不知道为啥 fileName 不能对应  估计是聊天记录迁移时造成的 bug, 所以还是用 md5 匹配比较靠谱
    let md5s = localPath.match(/([a-f\d]{32}|[A-F\d]{32})/);
    if (md5s) {
        md5s = Array.from(_.uniq(md5s));
    }

    // 还有这样文件名的
    // ${md5}${m.selfuin or m.senderuin}${m.uniseq}${很多数字}.mp4
    if (!md5s) {
        const reg = new RegExp(`(?<=\\/)([a-f\\d]{32}|[A-F\\d]{32})(${m.selfuin}|${m.senderuin})(\\d{1,})\\.mp4$`);
        const res = localPath.match(reg);
        if (res) {
            md5s = res[1];
        }
    }
    if (md5s) {
        // 先直接从文件夹找,这样文件夹里面的图片多半是封面
        // !!! 我没在视频文件夹中看到封面 但是微信是这样的机制 会有 video 的 poster 这样视频丢失也至少能显示一张图
        // 所以这里找封面的动作其实是多余的

        if (md5s.length !== 1) Log.warn(`video md5s.length!==1: ${md5s}`);

        const md5Dir = VIDEO_DIR_MD5.find(d => md5s.map(md5 => md5.toLowerCase()).includes(d.toLowerCase()));

        if (md5Dir) {
            const currDir = path.join(INPUT_DIR, md5Dir);
            const files = fs.readdirSync(currDir).filter(v => v !== '.nomedia');

            // 视频文件 默认只有一个视频
            const videoF = files.find(f => EXT_VIDEO.includes(path.extname(f).toLowerCase()));
            if (videoF) {
                const fileBase = await copyFile(path.join(currDir, videoF), FILE_DIR, md5Dir);
                o.videoLocalUrl = `${WEB_DIR}/${fileBase}`;
            }
            // 不存在,瞎折腾的视频封面 默认只有一张图片
            const imgF = files.find(f => EXT_IMAGE.includes(path.extname(f).toLowerCase()));
            if (imgF) {
                const fileBase = await copyFile(path.join(currDir, imgF), FILE_DIR, md5Dir);
                o.videoCoverUrl = `${WEB_DIR}/${fileBase}`;
            }
        }

        // 如果上面在文件夹中没找到, 那么就用 md5 暴力匹配了
        if (!o.videoLocalUrl) {
            // 找到再直接用 md5 匹配,但这样就只能匹配到视频 不能匹配到封面了
            const match = await matchFile(WEB_DIR, FILE_DIR, md5s, m);

            if (match) {
                const { webUrl } = match;
                o.videoLocalUrl = webUrl;
            }
        }
    }

    // md5 匹配不上就用文件名匹配
    if (!o.videoLocalUrl) {
        const fileName = path.parse(localPath).base;
        const find = ASSET_FILE.find(v => v.f === fileName);

        if (find) {
            const { f, f_p } = find;
            const _size = fs.statSync(f_p).size;

            // 如果数据库的 size = 0 也认为是这个文件吧，虽然仅依靠文件名指定有点不准确
            if (fileSize == 0 || fileSize == _size) {
                const fileBase = await copyFile(f_p, FILE_DIR);
                o.videoLocalUrl = `${WEB_DIR}/${fileBase}`;
            }
        }
    }

    // 再匹配不上就用 uniseq 匹配, 文件名有 QQ号${uniseq}.mp4 的格式
    if (!o.videoLocalUrl && m.uniseq) {
        const fileName = `${m.uniseq}.mp4`;
        const find = ASSET_FILE.find(v => v.f.includes(fileName));

        if (find) {
            const { f, f_p } = find;
            const _size = fs.statSync(f_p).size;

            // 如果数据库的 size = 0 也认为是这个文件吧，虽然仅依靠文件名指定有点不准确
            if (fileSize == 0 || fileSize == _size) {
                const fileBase = await copyFile(f_p, FILE_DIR);
                o.videoLocalUrl = `${WEB_DIR}/${fileBase}`;
            }
        }
    }

    merger.data = o;

    return {
        html: `[视频] ${localPath}`,
    };
}

module.exports = video;
