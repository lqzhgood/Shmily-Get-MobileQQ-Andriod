const cheerio = require('cheerio');

const getUniqArr = {
    arr: [],
    uniq(s, v) {
        if (!this.arr.includes(s)) {
            this.arr.push(s);
            console.log(s, v);
        }
    },
};

function htmlToText(html) {
    const $ = cheerio.load(html, { decodeEntities: false }, false);
    $('img').replaceWith((i, elm) => {
        const alt = elm.attribs.alt || '图';
        return `<span>[${alt}]</span>`;
    });
    return $.text();
}

module.exports = {
    getUniqArr,
    htmlToText,
};
