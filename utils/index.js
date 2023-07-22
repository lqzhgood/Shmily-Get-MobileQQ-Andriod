const path = require('path');
const fs = require('fs-extra');
const dayjs = require('dayjs');
const { KEY } = require('../config.js');

function group(arr, key) {
    return arr.reduce((pre, cV) => {
        let f = pre.find(p => p[key] === cV[key]);
        if (!f) {
            f = {
                [key]: cV[key],
                group: [],
            };
        }
        f.group.push(cV);
        pre.push(f);

        return pre;
    }, []);
}

function sleep(t = 100) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, t);
    });
}

function Log() {
    this.toStr = function (args) {
        if (!Array.isArray(args)) args = [args];
        // typeof null === 'object' 也没关系
        return args.map(o => (typeof o === 'object' ? JSON.stringify(o, null, 4) : o));
    };

    this.warn = function (...v) {
        console.log('\n');
        console.log('⚠️', ...v);
    };
    this.err = function (...v) {
        console.log('\n');
        console.log('❌', ...v);
    };
    this.errAndThrow = function (...v) {
        console.log('\n');
        console.log('❌', ...this.toStr(v));
        throw new Error(...v);
    };
    this.unknownType = function (m, ...o) {
        const UNKNOWN_TYPE_DIR = path.join(__dirname, '../dist/UNKNOWN_TYPE_PLEASE_ISSUES/');
        fs.mkdirpSync(UNKNOWN_TYPE_DIR);
        const file = path.join(
            UNKNOWN_TYPE_DIR,
            `${m.msgtype}-${m.time}-${m._id}.json`,
            // `${m.msgtype}-${Date.now()}-${Math.random().toString(36).substring(2)}.json`,
        );
        fs.writeFileSync(file, JSON.stringify({ KEY, m, o }, null, 4));
        console.log('\n');
        console.log(
            '❓',
            `未知的类型, 消息时间：${dayjs(m.time * 1000).format(
                'YYYY-MM-DD HH:mm:ss',
            )} 已写入 ${file} ，请附图提交 issues`,
        );
    };
}

module.exports = {
    group,
    sleep,
    Log: new Log(),
};
