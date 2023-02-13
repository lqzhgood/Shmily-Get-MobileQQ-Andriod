const config = require('@/config');

const { TYPE_DICT } = require('../utils/dictMap');
const { ddString } = require('../utils/ddData');

function system(m, type) {
    switch (type) {
        case TYPE_DICT('_系统消息_钱提醒'):
            return systemAboutMoney(m);
        case TYPE_DICT('_系统消息_成为好友'):
            return systemBecomeFriends(m);
        case TYPE_DICT('_系统消息_好友_黑名单开关'):
            return systemFriendBlacklistSwitch(m);
        default:
            throw new Error('未知的系统类型 不该出现');
    }
}

function systemBecomeFriends(m) {
    m.$data.msgData = ddString(m, 'msgData.data');

    return '我们已经是好友啦,一起来聊天吧!';
}

function systemAboutMoney(m) {
    // -1002 msgData  固定 [50, 55, 3, 39, 54, 43, 48] 含义未知
    // extStr 固定 sens_msg_original_text: "请QQ电话核实好友身份，涉及钱财务必警惕。发现异常？立即举报。"
    return m.$data.extStr.sens_msg_original_text;
}

function systemFriendBlacklistSwitch(m) {
    //  你已屏蔽%s的会话
    // 你已允许接收%s的会话
    m.$data.msgData = ddString(m, 'msgData.data');
    return m.$data.msgData.replace('%s', ` ${config.leftName} `);
}

module.exports = system;
