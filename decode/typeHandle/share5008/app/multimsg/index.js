const { TYPE_DICT } = require('../../../../utils/dictMap.js');
const { replaceQQEmoji } = require('../../../text/decode.js');

function handler(m, merger) {
    const json = merger.res.msgData;
    const { app, view, meta } = json;

    const metaData = meta.detail;
    merger.data = metaData;
    merger.type = TYPE_DICT('_分享_5008');

    const body = metaData.news
        .map(v => {
            v.$html = replaceQQEmoji(v.text);
            return v.$html;
        })
        .join('<br/>');

    return {
        type: TYPE_DICT('聊天记录'),
        html: `${metaData.source}<br/>${body}<br/>${metaData.summary}`,
    };
}

module.exports = handler;
