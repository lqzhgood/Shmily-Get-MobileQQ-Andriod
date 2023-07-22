const { TYPE_DICT } = require('../../../../utils/dictMap.js');

function handler(m, merger) {
    const json = merger.res.msgData;
    const { app, view, meta } = json;

    // "Location.Search": {
    //     "id": "",
    //     "name": "位置分享",
    //     "address": "湖南省长沙市浏阳国际家具城西50米(开元大道北)",
    //     "lat": 28.273582,
    //     "lng": 113.365936,
    //     "from": "plusPanel"
    // }
    const { address, lat, lng, name } = meta['Location.Search'];

    merger.data = {
        location: meta['Location.Search'],
    };

    return {
        type: TYPE_DICT('位置'),
        html: `${address}<br/>${lat},${lng}<br/>${name}`,
    };
}

module.exports = handler;
