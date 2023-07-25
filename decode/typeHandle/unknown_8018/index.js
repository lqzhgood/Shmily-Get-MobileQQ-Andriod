const { ddString } = require('../../utils/ddData');

function handler(m, merger) {
    const s = ddString(m, 'msgData.data');

    const reg = s.match(/(?<=\/).+(?=B)/);

    const alt = reg ? reg[0] : '未知';

    return {
        html: `[QQ超级表情-${alt}]`,
    };
}

module.exports = handler;
