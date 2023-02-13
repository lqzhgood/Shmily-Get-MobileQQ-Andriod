const { ddString } = require('../utils/ddData');

const { getUniqArr } = require('../utils/index.js');
// const s = `${d1}_${d2}_${null}`;
// getUniqArr.uniq(s, m);

/**
 * @name:
 * @description:
 * @param undefined
 * @return {*}
 */
function voip(m) {
    m.$data.msgData = ddString(m, 'msgData.data');
    const [_desc, d1, d2, d3] = m.$data.msgData.split('|');
    // "\u0016未接听，点击回拨|2|3|1"
    // description 全部 \u0016 开头
    // d1 0 2 6 不知道什么意思
    // d2 总是3 不知道什么意思
    // d3 1 代表视频  0 代表语音

    // eslint-disable-next-line no-control-regex
    const desc = _desc.replace(/^\u0016/, '');

    // test
    // const s = `${desc},${d1}_${d2}_${d3}`;
    // getUniqArr.uniq(s, m);

    const voipParse = {
        type: typeMap(d3),
        desc,
    };

    return {
        html: `${voipParse.type} ${voipParse.desc}`,
        merger: voipParse,
    };
}

function typeMap(t) {
    t = Number(t);
    switch (t) {
        case 0:
            return '语音';
        case 1:
            return '视频';
        default:
            return '未知';
    }
}

module.exports = voip;
