require('module-alias/register');
const { fillEmoticon } = require('@/decode/typeHandle/emoticon/extend');

(async () => {
    await fillEmoticon();
})();
