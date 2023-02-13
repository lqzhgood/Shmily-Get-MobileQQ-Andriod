const path = require('path');
const fs = require('fs-extra');

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
    this.unknownType = function (m) {
        const UNKNOWN_TYPE_DIR = path.join(__dirname, '../dist/UNKNOWN_TYPE_PLEASE_ISSUES/');
        fs.mkdirpSync(UNKNOWN_TYPE_DIR);
        const file = path.join(
            UNKNOWN_TYPE_DIR,
            `${m.msgtype}-${Date.now()}-${Math.random().toString(36).substring(2)}.json`,
        );
        fs.writeFileSync(file, JSON.stringify(m, null, 4));
        console.log('\n');
        console.log('❓', '未知的类型,请附图提交 issues', m);
    };
}

module.exports = {
    group,
    sleep,
    Log: new Log(),
};
