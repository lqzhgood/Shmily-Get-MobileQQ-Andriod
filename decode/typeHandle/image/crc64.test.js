const { decodeByJs } = require('./crc64');
const { decodeByPython } = require('./crc64.python');
const testArr = require('./crc64.test.data.json');

describe('decode by js', () => {
    for (let i = 0; i < testArr.length; i++) {
        const o = testArr[i];
        const { encryption, decryption } = o;

        test(`decode: ${encryption}`, () => {
            expect(decodeByJs(encryption)).toBe(decryption);
        });
    }
});

// describe('decode by python', () => {
//     for (let i = 0; i < testArr.length; i++) {
//         const o = testArr[i];
//         const { encryption, decryption } = o;

//         test(`decode: ${encryption}`, () => {
//             expect(decodeByPython(encryption)).toBe(decryption);
//         });
//     }
// });

/** Only for test. If it comes out with error, just remove it */
if (process.env.TEST) {
    const assert = require('node:assert');
    /** Only for test. If it comes out with error, just remove it */
    assert.strictEqual(
        crc64('chatimg:73C393EEE6BA2A917FADD8F675985B8C'),
        '79e215c8f13ee1e7'
    );
}
