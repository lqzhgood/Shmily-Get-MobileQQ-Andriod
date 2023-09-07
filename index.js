// eslint-disable-next-line no-extend-native
require('module-alias/register');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');

const { fillQQName } = require('./utils/msg');
const { clearTmp, un7z } = require('./utils/file');
const { DIST_DIR, DIST_DIR_TEMP, DIST_DIR_TEMP_IMG_DECODE, rootPath } = require('./config');

(async () => {
    // 生成基础表情
    if (!fs.existsSync(path.join(DIST_DIR_TEMP, './ASSET_FILE.json'))) {
        const res = execSync('npm run md5assets');
        console.log('npm run emojiByBase', res.toString());
    }

    // 生成自定义表情
    if (!fs.existsSync(path.join(DIST_DIR, 'table'))) {
        const res = execSync('npm run exportTable');
    }

    fillQQName();

    if (!fs.existsSync(path.join(DIST_DIR_TEMP_IMG_DECODE, 'RichMsgDecode.exe'))) {
        // IMG DECODE PRE HANDLER
        fs.mkdirpSync(DIST_DIR_TEMP_IMG_DECODE);
        await un7z(
            './decode/decryption/RichMsgDecode/out/artifacts/RichMsgDecode_jar/jre-1.8.7z',
            path.join(DIST_DIR_TEMP_IMG_DECODE, 'jre-1.8'),
        );
        fs.copyFileSync(
            './decode/decryption/RichMsgDecode/out/artifacts/RichMsgDecode_jar/RichMsgDecode.exe',
            path.join(DIST_DIR_TEMP_IMG_DECODE, 'RichMsgDecode.exe'),
        );
    }

    if (
        !fs.existsSync(
            path.join(__dirname, './decode/decryption/javaSerialization/emoticon2007/jdk-18.0.2.1/bin/java.exe'),
        )
    ) {
        await un7z(
            './decode/decryption/javaSerialization/emoticon2007/jdk-18.0.2.1.7z.001',
            './decode/decryption/javaSerialization/emoticon2007/',
        );
    }

    const ToMsg = require('./decode/index');
    const msgArr = await ToMsg();

    fs.writeFileSync(path.join(DIST_DIR, `${rootPath}.json`), JSON.stringify(msgArr, null, 4));

    console.log('Delete tmp...');
    // clearTmp();
    console.log('ok');
})();
