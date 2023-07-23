const { TYPE_DICT } = require('../../../../utils/dictMap.js');
const { replaceQQEmoji } = require('../../../text/decode.js');

function handler(m, merger) {
    const json = merger.res.msgData;
    const { app, view, meta } = json;

    const metaData = meta.detail;
    merger.data = metaData;

    const body = metaData.news
        .map(v => {
            const h = replaceQQEmoji(v.text);
            v.$text = h;
            return h;
        })
        .join('<br/>');

    return {
        type: TYPE_DICT('聊天记录'),
        html: `${metaData.source}<br/>${body}<br/>${metaData.summary}`,
    };
}

module.exports = handler;
