const fs = require('fs-extra');
const path = require('path');
const { spawnSync } = require('child_process');
const { DIST_DIR } = require('@/config.js');
const { IMG_DIR, INPUT_DIR_IMAGE, WEB_DIR, FILE_DIR } = require('./const.js');
const { getByExtend } = require('./extend');

const { giveExt } = require('@/utils/file');

// F_MD5 代表文件本身的 MD5
// FN_CRC 代表文件名中的 CRC
// MSG_MD5 代表数据库中的 MD5

// chatraw 原图  R_F_MD5 R_FN_CRC
// chatimg 发送图 I_F_MD5 I_FN_CRC
// chatthumb 缩略图 T_F_MD5 T_FN_CRC

// 如果勾选原图
// chatraw MSG_MD5 == R_F_MD5  CRC(raw:MSG_MD5) == R_FN_CRC  <--原图
// chatimg MSG_MD5 != I_F_MD5  CRC(img:MSG_MD5) == I_FN_CRC  <--原图压缩图
// chatthumb  MSG_MD5 != T_F_MD5 CRC(thu:MSG_MD5) == T_FN_CRC

// 如果不勾选原图
// chatraw -无文件
// chatimg MSG_MD5 == I_F_MD5  CRC(img:MSG_MD5) == I_FN_CRC  <--原图
// chatthumb  MSG_MD5 != T_F_MD5 CRC(thu:MSG_MD5) == T_FN_CRC

// 基于以上情况, 那么去计算文件位置反而没有意义了, 直接 MD5 匹配就能拿到原图了
// 如果 MD5 匹配不到原图, 那么再使用计算值匹配
// 这样就能 MD5匹配到原图 -> 计算获取缩略图

const LOST_IMAGE = [];
const IMG_FILE_DETAIL = fs.readJsonSync(path.join(DIST_DIR, 'IMG_FILE_DETAIL.json'));

async function imgDataHandle(data, imgCrcFiles, m) {
    let { md5, rawMsgUrl, uuid, localPath } = data;
    let imgUrl = null;

    imgUrl = await getByExtend(m, data);

    // 通过 md5 计算 CRC64 获取文件位置
    if (!imgUrl) {
        const calc = imgCrcFiles || calcImgCrcDirArr(md5);

        for (let i = 0; i < calc.length; i++) {
            const { crc, d } = calc[i];
            // 相应目录的文件中查找【文件名】包含 ${crc} 的文件
            const find = IMG_FILE_DETAIL[d].find(({ f }) => f.includes(crc));
            if (find) {
                const { f, md5: f_md5 } = find;

                const sourceFile = path.join(INPUT_DIR_IMAGE, d, crc.substr(-3, 3), f);
                if (fs.statSync(sourceFile).size !== 0) {
                    const targetExt = await giveExt(sourceFile);
                    const targetName = `${f_md5}${targetExt}`;
                    const targetFile = path.join(FILE_DIR, targetName);
                    fs.copyFileSync(sourceFile, targetFile);
                    imgUrl = `${WEB_DIR}/${targetName}`;
                    // console.log(sourceFile, targetFile);
                    // console.count('match local');
                }
            }
        }
    }

    if (!imgUrl) {
        // Log.err('LOST IMAGE', md5, m);
        LOST_IMAGE.push(m);
        fs.writeFileSync(path.join(DIST_DIR, 'LOST_IMAGE.json'), JSON.stringify(LOST_IMAGE, null, 4));
    }
    return imgUrl;
}

/**
 * @name:
 * @description: I don't know how to crc64 in nodejs
 *              https://github.com/magiclen/node-crc/issues/11
 * @param string
 * @return {*} string
 */
function imageCrc64(str) {
    const pyPath = path.join(__dirname, './crc64.py');
    if (!fs.existsSync(pyPath)) throw new Error('crc64.py not found');
    let CRC64Value = spawnSync('python', [pyPath, str]).stdout.toString('utf-8').trim();

    const hasHyphen = CRC64Value.startsWith('-');

    // 删除 0x 标记
    CRC64Value = hasHyphen ? CRC64Value.replace(/^-0x/, '') : CRC64Value.replace(/^0x/, '');

    if (CRC64Value.length % 2 !== 0) CRC64Value = '0' + CRC64Value;
    CRC64Value = Buffer.from(CRC64Value, 'hex').toString('hex');
    CRC64Value = CRC64Value.replace(/^0/, '');
    if (hasHyphen) {
        CRC64Value = '-' + CRC64Value;
    }
    return CRC64Value;
}

function calcImgCrcDirArr(md5) {
    return IMG_DIR.map(d => ({ crc: imageCrc64(`${d}:${md5}`), d }));
}

module.exports = {
    imgDataHandle,
    calcImgCrcDirArr,
};
