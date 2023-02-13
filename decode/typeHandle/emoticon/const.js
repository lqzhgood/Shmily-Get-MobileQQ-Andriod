const fs = require('fs-extra');
const path = require('path');
const { ASSETS_ROOT_DIR, FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config.js');

const INPUT_DIR_EMOTICON = path.join(ASSETS_ROOT_DIR, './.emotionsm/');
const DIR_TYPE = 'emoticon';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);
const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

module.exports = {
    INPUT_DIR_EMOTICON,
    FILE_DIR,
    WEB_DIR,
};
