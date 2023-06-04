const fs = require("fs-extra");
const path = require("path");

const config = require("../config.js");
const { DIST_DIR_TEMP } = config;

function fillQQName() {
    const FRIEND_LIST = fs.readJsonSync(
        path.join(DIST_DIR_TEMP, "./table/friends.json")
    );

    // send.sender = config.rightNum;
    // send.senderName = config.rightName;

    // receive.receiver = config.leftNum;
    // receive.receiverName = config.leftName;

    if (!config.rightName) {
        config.rightName = FRIEND_LIST.find(
            (v) => v.uin === config.rightNum
        ).remark;
    }

    if (!config.leftName) {
        config.leftName = FRIEND_LIST.find(
            (v) => v.uin === config.leftNum
        ).remark;
    }

    if (!config.rightName || !config.leftName) {
        Log.errAndThrow("没有找到QQ号对应的昵称");
    }
}

module.exports = {
    fillQQName,
};
