const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const FileType = require('file-type');
const chardet = require('chardet');
const iconv = require('iconv-lite');
const _ = require('lodash');

const { DIST_DIR } = require('../config.js');

const EXT_VIDEO = ['.m4a', '.mp4'];
const EXT_IMAGE = ['.jpeg', '.jpg', '.png', '.gif', '.webp'];

function getMD5(filePath) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        const fsHash = crypto.createHash('md5');

        stream.on('data', d => {
            fsHash.update(d);
        });
        stream.on('error', err => {
            reject(err);
        });
        stream.on('end', () => {
            const md5 = fsHash.digest('hex').toLowerCase();
            resolve(md5);
        });
    });
}

function getFileMD5(filePath) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        const fsHash = crypto.createHash('md5');

        stream.on('data', d => {
            fsHash.update(d);
        });
        stream.on('error', err => {
            reject(err);
        });
        stream.on('end', () => {
            const md5 = fsHash.digest('hex');
            resolve(md5);
        });
    });
}

async function getDirMD5(p) {
    let arr = [];
    const files = fs.readdirSync(p);
    for (let i = 0; i < files.length; i++) {
        const f = files[i];

        if (f === '.nomedia') continue;
        const f_p = path.join(p, f);
        if (fs.statSync(f_p).isDirectory()) {
            const arr_c = await getDirMD5(f_p);
            arr = arr.concat(arr_c);
        } else {
            const md5 = await getFileMD5(f_p);
            const obj = {
                f,
                f_p,
                md5,
            };
            arr.push(obj);
        }
    }
    return arr;
}
function getJSON(p, defaultValue = []) {
    if (fs.existsSync(p)) {
        const t = fs.readJsonSync(p);
        return t;
    } else {
        return defaultValue;
    }
}
async function giveExt(f) {
    const { ext } = path.parse(f);

    // 部分后缀不处理
    if (['.doc'].includes(ext.toLowerCase())) return ext;

    // eslint-disable-next-line
    let { ext: _ext_l } = (await FileType.fromFile(f)) || {};

    if (_ext_l) {
        let ext_l = '.' + _ext_l.toLowerCase();

        if (ext.toLowerCase() !== ext_l) {
            // if (ext) console.warn('⚠️', `后缀和源文件不同 已修改 ${ext} => ${ext_l}`, fullDir);
        }
        return ext_l;
    } else {
        if (!ext) console.warn('⚠️', '文件无法识别', f);
        return ext;
    }
}

async function copyFile(f, outDir, fileName) {
    const ext = await giveExt(f);
    let fileBase;
    if (fileName) {
        fileBase = fileName + ext;
    } else {
        const md5 = await getFileMD5(f);
        fileBase = md5 + ext;
    }
    fs.copyFileSync(f, path.join(outDir, fileBase));
    return fileBase;
}

function strToUtf8(buff) {
    const charset = chardet.detect(buff);
    if (charset === 'UTF-8') {
        return Buffer.from(buff).toString('utf-8');
    } else {
        const str = iconv.decode(buff, charset);
        return str;
    }
}

function clearTmp() {
    fs.removeSync(path.join(DIST_DIR, 'tmp'));
}

class WriteStack {
    constructor() {
        this.stack = new Map();
    }

    w(p, json) {
        if (!this.stack.get(p)) {
            this.stack.set(
                p,
                _.debounce(() => {
                    fs.writeFileSync(p, JSON.stringify(json, null, 4));
                }, 1000),
            );
        }
        this.stack.get(p)();
    }
}

module.exports = {
    EXT_VIDEO,
    EXT_IMAGE,
    getMD5,
    getDirMD5,
    getJSON,
    giveExt,
    copyFile,
    strToUtf8,
    clearTmp,
    WriteStack: new WriteStack(),
};
