const { TYPE_DICT } = require('../../../utils/dictMap.js');

function shareCommon(m, merger) {
    const json = merger.res.msgData;
    const { app, view } = json;

    merger.type = TYPE_DICT('_分享_5008');
    merger.data.$app = app;
    merger.data.$view = view;
}

module.exports = {
    shareCommon,
};
