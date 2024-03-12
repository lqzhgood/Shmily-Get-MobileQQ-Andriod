const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

function decodeByPython(str) {
    // python 源码执行 需要 python 环境
    // const pyPath = path.join(__dirname, './crc64.py');
    // if (!fs.existsSync(pyPath)) throw new Error('crc64.py not found');
    // let CRC64Value = spawnSync('python', [pyPath, str]).stdout.toString('utf-8').trim();

    // exe 执行, 需要 Windows 环境

    const exePath = path.join(__dirname, './crc64.python.exe');
    if (!fs.existsSync(exePath)) throw new Error('crc64.exe not found');
    let CRC64Value = spawnSync(exePath, [str]).stdout.toString('utf-8').trim();

    const hasHyphen = CRC64Value.startsWith('-');

    // 删除 0x 标记
    CRC64Value = hasHyphen
        ? CRC64Value.replace(/^-0x/, '')
        : CRC64Value.replace(/^0x/, '');

    if (CRC64Value.length % 2 !== 0) CRC64Value = '0' + CRC64Value;
    CRC64Value = Buffer.from(CRC64Value, 'hex').toString('hex');
    CRC64Value = CRC64Value.replace(/^0/, '');
    if (hasHyphen) {
        CRC64Value = '-' + CRC64Value;
    }
    return CRC64Value;
}

module.exports = {
    decodeByPython,
};
