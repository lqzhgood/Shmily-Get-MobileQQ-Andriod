const fs = require('fs-extra');
const path = require('path');
const { DIST_DIR } = require('@/config.js');
const { getDirMD5 } = require('@/utils/file');

const { IMG_DIR, INPUT_DIR_IMAGE } = require('./const');

// 计算图片资源文件夹的MD5
async function makeAssetsImgDirMd5() {
    const imgObj = {};
    for (let i = 0; i < IMG_DIR.length; i++) {
        const d = IMG_DIR[i];
        imgObj[d] = await getDirMD5(path.join(INPUT_DIR_IMAGE, d));
    }
    fs.writeFileSync(path.join(DIST_DIR, 'IMG_FILE_DETAIL.json'), JSON.stringify(imgObj, null, 4));
}

module.exports = {
    makeAssetsImgDirMd5,
};
