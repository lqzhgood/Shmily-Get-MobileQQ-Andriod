const { ddString } = require('../../utils/ddData');

function handler(m, merger) {
    const o = JSON.parse(ddString(m, 'msgData.data'));
    merger.data = o;

    return {
        html: JSON.stringify(o, null, 4),
    };
}

module.exports = handler;
