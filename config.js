const fs = require('fs-extra');
const path = require('path');

const config = {
    QQ_COOKIE: ``, // 从QQ服务器获取资源的凭证 暂不启用

    rightNum: '110', //  我自己的QQ 展示在右边
    rightName: '', // 留空将从数据库中获取
    leftNum: '119', // 对方的QQ 展示在左边
    leftName: '', // 留空将从数据库中获取

    // 此次资源的标识符 会作为以下用途
    // [数据文件].json
    // [资源文件] 夹名称   /data/${rootPath}/**.*
    // 建议按以下规则修改
    rootPath: 'MobileQQ-Android-123456-20230101',

    DEVICE: 'OnePlus 3T',

    // 是否由对方数据库导出
    // 设为 false，则是由自己数据库导出的数据
    // 如果设为 true，则由对方数据库导出的数据， 并将反转消息发送的方向
    isFromOtherAccount: false, // 是否由对方账号导出的数据

    // 以下非必要 不要改
    DB_DIR: path.join(__dirname, './input/data/databases/'),
    KEY: fs.readFileSync(
        path.join(__dirname, './input/data/files/kc'),
        'utf-8'
    ),
    ASSETS_ROOT_DIR: path.join(__dirname, './input/assets/'),
    DIST_DIR: path.join(__dirname, './dist/'),
};

config.DIST_DIR_TEMP = path.join(config.DIST_DIR, '_temp');

config.DIST_DIR_TEMP_IMG_DECODE = path.join(config.DIST_DIR_TEMP, 'imgDecode');

config.FILE_WEB_PUBLIC_DIR = `./data/${config.rootPath}`;
config.FILE_DIR_OUT_DIR = path.join(
    __dirname,
    './dist/',
    config.FILE_WEB_PUBLIC_DIR
);

fs.mkdirpSync(config.DIST_DIR);
fs.mkdirpSync(config.DIST_DIR_TEMP);

module.exports = config;
