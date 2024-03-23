const { describe, test } = require('node:test');
const { deepStrictEqual } = require('node:assert');
const { decodeByJs } = require('./crc64');
const { decodeByPython } = require('./crc64.python');
const testArr = require('./crc64.test.data.json');

describe('decode by js', () => {
    for (let i = 0; i < testArr.length; i++) {
        const o = testArr[i];
        const { encryption, decryption } = o;

        test(`decode: ${encryption}`, () => {
            deepStrictEqual(decodeByJs(encryption), decryption);
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
