const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { spawnSync } = require('child_process');

const { decryptProtoBuf } = require('../../decryption/index.js');

const { DIST_DIR } = require('@/config.js');

const tmpDir = path.join(DIST_DIR, '/tmp/emoticonDecode/');
const javaDecodePath = path.join(__dirname, '../../decryption/javaSerialization/emoticon2007/emoticon2007.exe');
if (!fs.existsSync(javaDecodePath)) throw new Error('javaDecodePath not exist');

const EmoticonPackageFile = path.join(DIST_DIR, '/table/EmoticonPackage.json');
const EmoticonPackageJSON = fs.readJsonSync(EmoticonPackageFile);

const { getPkgInfoByExtend } = require('./extend');

async function emoticon(m) {
    const o = { webUrl: '', packName: '其他', desc: '未知', mark: '' };

    // 导出 m.msgData.data 用以外部 Java 解码
    fs.mkdirpSync(tmpDir);
    const buff = decryptProtoBuf(m.msgData.data);
    _.unset(m, 'msgData.data');
    const tmpFile = path.join(tmpDir, m._id + '');
    fs.writeFileSync(tmpFile, buff);

    // 外部 Java 解码后回填 m.$data.msgData
    spawnSync(javaDecodePath, [tmpFile]);
    const eInfo = fs.readJsonSync(tmpFile + '.json');

    eInfo.dwTabID = eInfo.dwTabID.toString();
    eInfo.eId = Buffer.from(eInfo.sbufID).toString('hex');
    // delete eInfo.sbufID; // 解码后删不删呢？
    const { dwTabID, sbufID, faceName, eId } = eInfo;

    m.$data.msgData = eInfo;

    // 补全 Package 信息
    let pkgInfo;

    // extend
    pkgInfo = await getPkgInfoByExtend(m, o, eInfo);

    // local
    if (!pkgInfo) {
        // console.log('local emoticon info', pkgInfo);
        pkgInfo = EmoticonPackageJSON.find(v => v.epId === dwTabID);

        if (pkgInfo) {
            o.packName = pkgInfo.name;
            o.desc = faceName;
            o.mark = pkgInfo.mark;
        }
    }

    m.$data.msgData = eInfo;
    m.$data.packageInfo = pkgInfo;
    return {
        html: `[${o.packName}-${o.desc}]`,
        merger: o,
    };
}

module.exports = emoticon;
