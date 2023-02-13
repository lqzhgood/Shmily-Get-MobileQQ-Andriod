const fs = require('fs-extra');
const path = require('path');

const config = {
    QQ_COOKIE: ``, // 从QQ服务器获取资源的凭证 暂不启用

    rightNum: '110', //  我自己的QQ 展示在右边
    rightName: '', // 留空将从数据库中获取
    leftNum: '119', // 对方的QQ 展示在左边
    leftName: '', // 留空将从数据库中获取

    DEVICE: 'OnePlus 3T',

    // 非必要 不要改
    DB_DIR: path.join(__dirname, './input/data/databases/'),
    KEY: fs.readFileSync(path.join(__dirname, './input/data/files/kc'), 'utf-8'),
    ASSETS_ROOT_DIR: path.join(__dirname, './input/assets/'),

    DIST_DIR: path.join(__dirname, './dist/'),

    rootPath: 'qq-android',
    isFromOtherAccount: false, // 是否由对方账号导出的数据
};

config.FILE_WEB_PUBLIC_DIR = `./data/${config.rootPath}`;
config.FILE_DIR_OUT_DIR = path.join(__dirname, './dist/', config.FILE_WEB_PUBLIC_DIR);

fs.mkdirpSync(config.DIST_DIR);

module.exports = config;
