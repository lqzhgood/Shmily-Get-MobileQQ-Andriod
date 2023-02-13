// eslint-disable-next-line no-extend-native
require('module-alias/register');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const { fillQQName } = require('./utils/msg');
const { clearTmp } = require('./utils/file');
const { DIST_DIR } = require('./config');

if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
}

(async () => {
    // 生成基础表情
    if (!fs.existsSync(path.join(DIST_DIR, '/ASSET_FILE.json'))) {
        const res = execSync('npm run md5assets');
        console.log('npm run emojiByBase', res.toString());
    }

    // 生成自定义表情
    if (!fs.existsSync(path.join(DIST_DIR, 'table'))) {
        const res = execSync('npm run exportTable');
    }

    fillQQName();

    const ToMsg = require('./decode/index');
    const msgArr = await ToMsg();

    fs.writeFileSync(path.join(DIST_DIR, `msg-qq_android.json`), JSON.stringify(msgArr, null, 4));

    console.log('Delete tmp...');
    // clearTmp();
    console.log('ok');
})();
