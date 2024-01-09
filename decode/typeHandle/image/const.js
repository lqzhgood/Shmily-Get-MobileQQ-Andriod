const fs = require('fs-extra');
const path = require('path');

const {
    ASSETS_ROOT_DIR,
    FILE_WEB_PUBLIC_DIR,
    FILE_DIR_OUT_DIR,
    leftNum,
    rightNum,
    DIST_DIR,
} = require('@/config.js');

const INPUT_DIR_IMAGE = path.join(ASSETS_ROOT_DIR, './chatpic/');
const IMG_DIR = ['chatraw', 'chatimg', 'chatthumb'];

for (let i = 0; i < IMG_DIR.length; i++) {
    const p = path.join(INPUT_DIR_IMAGE, IMG_DIR[i]);
    if (!fs.existsSync(p)) {
        fs.mkdirpSync(p);
    }
}

const DIR_TYPE = 'image';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);

const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

module.exports = {
    IMG_DIR,
    INPUT_DIR_IMAGE,
    WEB_DIR,
    FILE_DIR,
};
