function hexArrRead(a) {
    const pear = a;
    const fullLen = pear.length;
    let isEnd = false;

    const arr = [];

    const s = pear.shift(1);
    if (s !== 0) {
        console.log('s', s);
        throw new Error('s!==0');
    }
    while (!isEnd && pear.length > 0) {
        const len = pear.splice(0, 1)[0];
        const content = pear.splice(0, len);
        arr.push(hexArrToStr(Buffer.from(content), 0, len));

        isEnd = pear.slice(0, 0x16).every(e => e === 0);
    }

    return { data: arr, cutLen: fullLen - pear.length };
}

export default {
    hexArrRead,
};
