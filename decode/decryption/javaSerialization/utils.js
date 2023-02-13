function getData(b) {
    const len_h = b.shift();
    const len_l = b.shift();
    const len = len_h * 0x100 + len_l;
    const content = b.splice(0, len);
    return Buffer.from(content).toString('utf-8');
}

function isZeroStr(s) {
    return Buffer.from(s, 'utf-8').toString('hex').replace(/0/g, '').length === 0;
}

function l(v) {
    return !isNaN(v) ? String(v).length : v.length;
}
function zero(len) {
    return new Array(len).fill(0).length;
}

function hexArrToStr(hexArr, s, e) {
    return hexArr.slice(s, s + e).toString('utf-8');
}

function Cut(id) {
    this.id = id;
    this.arr = [];
    this.len = 0; // 删除的长度 偏移量还要叠加 getData 的数量
    this.cut = function (a, ...args) {
        const len = args.reduce((pre, cV) => pre + (!isNaN(cV) ? cV : cV.length), 0);
        const cArr = a.splice(0, len);
        this.arr = this.arr.concat(cArr);
        this.len += len;
    };
    this.log = function () {
        console.group(this.id);
        console.log('len', '0x' + this.len.toString(16));
        console.log(
            'arr',
            this.arr.map(v => v.toString(16).padStart(2, 0)),
        );
        console.groupEnd(this.id);
    };
}

function nextNoZeroLength(a) {
    let i = 0;
    while (a[i] === 0 && i < a.length) {
        i++;
    }
    return i;
}

function nextZeroLength(a) {
    let i = 0;
    while (a[i] !== 0 && i < a.length) {
        i++;
    }
    return i;
}

module.exports = {
    getData,
    isZeroStr,
    l,
    zero,
    hexArrToStr,
    Cut,
    nextNoZeroLength,
    nextZeroLength,
};
