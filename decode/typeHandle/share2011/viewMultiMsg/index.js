const {
    getData,
    isZeroStr,
    l,
    zero,
    hexArrToStr,
    Cut,
    nextNoZeroLength,
    nextZeroLength,
} = require('../../../decryption/javaSerialization/utils.js');

function decode(b, id) {
    const a = Array.from(b);

    const r = {};
    const c = new Cut(id);
    c.cut(a, 0x15);

    r.fileType = getData(a);

    c.cut(a, nextNoZeroLength(a) - 1);
    r.des = getData(a);
    c.cut(a, [0, 0, 0, '?']);

    contentType_DEFAULT(a, r, c);

    // console.log('The cursor', (b.length - a.length).toString(16), a[0].toString(16));
    // console.log('r', r.source);
    return r;
}

function contentType_DEFAULT(a, r, c) {
    r.itemKey = getData(a);
    c.cut(a, zero(0x3) + l(0x1));
    c.cut(a, zero(0x3) + l(0x12));
    c.cut(a, zero(0x1a));
    c.cut(a, l('?'));

    r.list = [];
    while (1) {
        const MAGIC_KEY_TITLE = [0x00, 0x05, 0x74, 0x69, 0x74, 0x6c, 0x65]; // 0, 5 TITLE
        const next = a.slice(0, 7);
        if (MAGIC_KEY_TITLE.join('&') === next.join('&')) {
            const o = {};

            o.titleKey = getData(a);
            c.cut(a, zero(0x3) + l('c'));
            o.color = getData(a);
            c.cut(a, zero(2));
            o.size = getData(a);

            o.text = getData(a);
            c.cut(a, zero(4));
            o.v1 = getData(a);
            o.v2 = getData(a);
            c.cut(a, zero(2));

            r.list.push(o);
        } else {
            break;
        }
    }

    r.hrValue = getData(a);
    c.cut(a, zero(0x3));
    c.cut(a, l('9'));

    r.falseValue = getData(a);
    c.cut(a, zero(0x4));

    r.summaryKey = getData(a);
    c.cut(a, zero(0x3) + l('c'));
    r.summaryColor = getData(a);
    c.cut(a, zero(2));
    r.summarySize = getData(a);
    r.summaryValue = getData(a);

    c.cut(a, zero(0x8c));
    c.cut(a, new Array(8).fill(l('f').length));
    c.cut(a, zero(0x2));

    r.source = getData(a);
    c.cut(a, zero(0x11) + l('3'));

    r.resid = getData(a);
    r.uuid = getData(a);

    c.cut(a, zero(5));
    r.v1 = getData(a);
    c.cut(a, zero(3));

    r.tip = getData(a);

    // 后面应该没有有意义的东西了
    r.other = Buffer.from(a).toString('utf-8');
}

module.exports = {
    decode,
};
