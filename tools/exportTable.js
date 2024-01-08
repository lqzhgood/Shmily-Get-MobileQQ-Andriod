const path = require('path');

const { exportTable, exportTableName } = require('../decode/utils/db');
const { Emoticon, EmoticonPackage, EmoticonTab } = require(path.join(
    __dirname,
    '../decode/table/Emoticon'
));

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
