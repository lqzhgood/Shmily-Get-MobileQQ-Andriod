require('module-alias/register');

const fs = require('fs-extra');
const path = require('path');
const { getDirMD5 } = require('../utils/file');

const { DIST_DIR, ASSETS_ROOT_DIR } = require('../config');

const { makeAssetsImgDirMd5 } = require('../decode/typeHandle/image/pre.js');

(async () => {
    await makeAssetsImgDirMd5();

    const md5Json = await getDirMD5(ASSETS_ROOT_DIR);
    fs.writeFileSync(path.join(DIST_DIR, 'ASSET_FILE.json'), JSON.stringify(md5Json, null, 4));

    console.log('ok', md5Json.length);
})();
