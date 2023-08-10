const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').execSync;

const _ = require('lodash');

const { DIST_DIR_TEMP_IMG_DECODE } = require('@/config.js');
const { decryptProtoBuf } = require('../../decryption/index.js');

function imgDecodeByJava(m) {
    const buff = decryptProtoBuf(_.get(m, 'msgData.data'));

    const _tmpFile = path.join(DIST_DIR_TEMP_IMG_DECODE, m.uniseq);
    fs.writeFileSync(_tmpFile, buff);

    exec(`RichMsgDecode.exe ${m.uniseq}`.trim(), {
        cwd: DIST_DIR_TEMP_IMG_DECODE,
        encoding: 'utf8',
    });

    const o = fs.readJSONSync(_tmpFile + '.json');
    return o;
}

module.exports = {
    imgDecodeByJava,
};
