const path = require('path');
const fs = require('fs-extra');
const { FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config.js');

const ASSET_FILE = require('../../dist/ASSET_FILE.json');
const { ddString } = require('../utils/ddData');

const { TYPE_DICT } = require('../utils/dictMap');

const DIR_TYPE = 'file';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);

const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

// const {getUniqArr} = require('../utils/index.js');
// const s = `${d1}_${d2}_${null}`;
// getUniqArr.uniq(s, m);

function file(m, type, merger) {
    switch (type) {
        case TYPE_DICT('_文件_发送文件'):
            return sendFile(m, merger);
        case TYPE_DICT('_文件_收到文件'):
            return receivedFile(m, merger);
        default:
            throw new Error('未处理的文件类型');
    }
}

function sendFile(m, merger) {
    merger.data = {};
    merger.key = {};

    merger.res.msgData = ddString(m, 'msgData.data');
    const [_p, size, d1, d2, d3] = merger.res.msgData.split('|');
    // "\u0016/data/app/be.mygod.vpnhotspot-qB1WneZ5SuoYZ8pRARYi-g==/base.apk|0|0|1"
    // p|size|d1|d2|d3
    // p 总是 \u0016 开头
    // d1 d2 d3 含义未知

    // eslint-disable-next-line no-control-regex
    const [isChange, p, changeMap] = manualFileMap(_p.replace(/^\u0016/, ''));

    const fileObj = { p, ...path.parse(p), size };

    // 记录手动改变的文件
    if (isChange) {
        merger.key.changeMap = changeMap;
    }

    const o = findFileByName(p, size);

    merger.data = { type: 'send', fileParse: { ...fileObj, ...o } };

    return {
        html: '发送文件 ' + fileObj.p,
    };
}

function receivedFile(m, merger) {
    merger.data = {};

    merger.res.msgData = ddString(m, 'msgData.data');
    const fileBase = merger.res.msgData;

    const fileObj = { p: fileBase, ...path.parse(fileBase) };
    const o = findFileByName(fileBase, 0);

    merger.data = { type: 'receive', fileParse: { ...fileObj, ...o } };

    return {
        html: '对方已成功接收文件 ' + merger.res.msgData,
    };
}

// "fileParse": {
//     "root": "",
//     "dir": "",
//     "base": "ActiveLock_v1.0.S60v3.SymbianOS9.1.Unsign.CHS-OPDA.sis",
//     "ext": ".sis",
//     "name": "ActiveLock_v1.0.S60v3.SymbianOS9.1.Unsign.CHS-OPDA",
//     "url": "./data/qq-s60/file/ActiveLock_v1.0.S60v3.SymbianOS9.1.Unsign.CHS-OPDA.sis"
// },

/**
 * @name:
 * @description:  重名 或者 手动指定文件名的
 * @param undefined
 * @return {*}
 */
function manualFileMap(p) {
    const list = [
        {
            o: '/data/app/be.mygod.vpnhotspot-qB1WneZ5SuoYZ8pRARYi-g==/base.apk',
            t: '/data/app/be.mygod.vpnhotspot-qB1WneZ5SuoYZ8pRARYi-g==/be.mygod.vpnhotspot_base.apk',
        },
        {
            o: '/data/app/com.pavelrekun.rekado-1/base.apk',
            t: '/data/app/com.pavelrekun.rekado-1/com.pavelrekun.rekado-1_base.apk',
        },
    ];

    const f = list.find(v => v.o === p);
    return f ? [true, f.t, f] : [false, p];
}

function findFileByName(p, size) {
    const fileName = path.parse(p).base;
    const find = ASSET_FILE.find(v => v.f === fileName);

    const o = {
        size,
        url: '',
    };

    if (find) {
        const { f, f_p, md5 } = find;
        const _size = fs.statSync(f_p).size;

        // 如果数据库的 size = 0 也认为是这个文件吧，虽然仅依靠文件名指定有点不准确
        if (size == 0 || size == _size) {
            const targetFile = path.join(FILE_DIR, f);
            fs.copyFileSync(f_p, targetFile);

            o.size = _size;
            o.url = `${WEB_DIR}/${f}`;
        }
    }
    return o;
}

module.exports = file;
