const fs = require('fs-extra');
const path = require('path');
const dayjs = require('dayjs');
const exec = require('child_process').execSync;

const { DIST_DIR_TEMP } = require('../config.js');

const FRIEND_LIST = fs.readJsonSync(path.join(DIST_DIR_TEMP, './table/friends.json'));

const txt = fs.readFileSync(path.join(__dirname, '../config.js'), 'utf-8');
fs.copyFileSync(path.join(__dirname, '../config.js'), path.join(__dirname, `../config_tmp.js`));

const EXCLUDE_LIST = ['10000', '系统消息'];

for (let i = 0; i < FRIEND_LIST.length; i++) {
    const { uin, remark } = FRIEND_LIST[i];

    if (EXCLUDE_LIST.includes(uin) || EXCLUDE_LIST.includes(remark)) continue;

    console.log('导出中……', uin, remark);
    // 修改 config

    const rootPath = `MobileQQ-Android-${uin}-${dayjs().format('YYYYMMDD')}`;

    const uinConfig = txt
        .replace(`MAKE_ALL_REPLACE_TEMPLATE_LEFT_NUM`, uin)
        .replace(`MAKE_ALL_REPLACE_TEMPLATE_ROOT_PATH`, rootPath);

    fs.writeFileSync(path.join(__dirname, '../config.js'), uinConfig);

    exec(`npm run build`.trim(), {
        cwd: process.cwd(),
        encoding: 'utf8',
    });
}
