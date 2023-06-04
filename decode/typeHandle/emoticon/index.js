const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
const { spawnSync } = require("child_process");

const { decryptProtoBuf } = require("../../decryption/index.js");

const { DIST_DIR, DIST_DIR_TEMP } = require("@/config.js");

const tmpDir = path.join(DIST_DIR, "/tmp/emoticonDecode/");
const javaDecodePath = path.join(
    __dirname,
    "../../decryption/javaSerialization/emoticon2007/emoticon2007.exe"
);
if (!fs.existsSync(javaDecodePath)) throw new Error("javaDecodePath not exist");

const EmoticonPackageFile = path.join(
    DIST_DIR_TEMP,
    "/table/EmoticonPackage.json"
);
const EmoticonPackageJSON = fs.readJsonSync(EmoticonPackageFile);

const { getPkgInfoByExtend } = require("./extend");

async function emoticon(m, merger) {
    merger.data = {};
    merger.key = {};

    const o = { webUrl: "", packName: "其他", desc: "未知", mark: "" };

    // m.msgData.data 写入文件用外部 Java 解码
    fs.mkdirpSync(tmpDir);
    const buff = decryptProtoBuf(m.msgData.data);
    const tmpFile = path.join(tmpDir, m._id + "");
    fs.writeFileSync(tmpFile, buff);

    // 外部 Java 解码后回填 m.$data.msgData
    spawnSync(javaDecodePath, [tmpFile]);
    const eInfo = fs.readJsonSync(tmpFile + ".json");

    eInfo.dwTabID = eInfo.dwTabID.toString();
    eInfo.sbufID = Buffer.from(eInfo.sbufID).toString("hex");

    const { dwTabID, sbufID, faceName } = eInfo;

    merger.res.msgData = eInfo;

    // 补全 Package 信息
    let pkgInfo = null;

    // extend
    pkgInfo = await getPkgInfoByExtend(m, o, eInfo, merger);

    // local
    if (!pkgInfo) {
        // console.log('local emoticon info', pkgInfo);
        pkgInfo = EmoticonPackageJSON.find((v) => v.epId === dwTabID);

        if (pkgInfo) {
            o.packName = pkgInfo.name;
            o.desc = faceName;
            o.mark = pkgInfo.mark;
        }
    }

    merger.key.packageInfo = pkgInfo;

    merger.data = o;

    return {
        html: `[${o.packName}-${o.desc}]`,
    };
}

module.exports = emoticon;
