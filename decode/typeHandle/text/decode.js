const EMOJI_ARR = require('../../../lib/qqEmoji/emoji/qqEmoji.json');

function replaceQQEmoji(str, WEB_DIR) {
    const s = EMOJI_ARR.reduce((pre, cV) => {
        const { magicStr, group, index10, ext = 'gif', packName, des } = cV;
        const title = `${packName}-${des}`;
        return pre.replaceAll(
            magicStr,
            `<img class="baseEmoji" src="${WEB_DIR}/${group}/${index10}.${ext}" alt="${title}" title="${title}" />`,
        );
    }, str);
    return s;
}

module.exports = {
    replaceQQEmoji,
};
