const path = require('path');
const fs = require('fs-extra');
const config = require('../config');

const { exportTable, exportTableName } = require('../decode/utils/db');
const { Emoticon, EmoticonPackage, EmoticonTab } = require(path.join(
    __dirname,
    '../decode/table/Emoticon'
));

fs.mkdirpSync(path.join(config.DIST_DIR_TEMP, './table'));

const { friends, friendMulti } = require('../decode/table/friends');

const message = require(path.join(__dirname, '../decode/table/message.js'));

(async () => {
    exportTableName();
    await exportTable(message, 'message');
    await exportTable(friends, 'friends');
    await exportTable(friendMulti, 'friendMulti');
    await exportTable(Emoticon, 'Emoticon');
    await exportTable(EmoticonPackage, 'EmoticonPackage');
    await exportTable(EmoticonTab, 'EmoticonTab');
})();
