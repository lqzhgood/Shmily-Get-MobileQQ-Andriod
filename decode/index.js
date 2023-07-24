const dayjs = require('dayjs');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const cliProgress = require('cli-progress');
const bar = new cliProgress.SingleBar({});

const typeMap = require('./typeMap');
const { htmlToText } = require('./utils/index.js');

const config = require('../config');
const { DEVICE, DIST_DIR_TEMP } = config;

async function ToMsg() {
    const _rawMsgArr = fs.readJsonSync(path.join(DIST_DIR_TEMP, './table/message.json'));
    let rawMsgArr = _rawMsgArr;

    // debug
    // rawMsgArr = _rawMsgArr.filter(v => [1683792639].includes(v.time));
    // rawMsgArr = _rawMsgArr.filter(v => [-2011].includes(v.msgtype));

    bar.start(rawMsgArr.length - 1, 0);

    const msgArr = [];
    for (let i = 0; i < rawMsgArr.length; i++) {
        bar.update(i);

        const m = rawMsgArr[i];
        const { type, html, merger, fn } = await typeMap(m);
        if (!merger) {
            throw new Error('忘记传 merger 了');
        }

        let direction = getDirection(m);
        if (config.isFromOtherAccount) {
            direction = direction === 'go' ? 'come' : 'go';
        }

        const send = {};
        const receive = {};

        if (direction === 'go') {
            send.sender = config.rightNum;
            send.senderName = config.rightName;

            receive.receiver = config.leftNum;
            receive.receiverName = config.leftName;
        }

        if (direction === 'come') {
            send.sender = config.leftNum;
            send.senderName = config.leftName;

            receive.receiver = config.rightNum;
            receive.receiverName = config.rightName;
        }

        const t = m.time * 1000;

        // 压缩  m.msgData
        if (Array.isArray(m.msgData?.data)) m.msgData.data = '0x' + Buffer.from(m.msgData?.data).toString('hex');

        const msg = {
            source: 'MobileQQ',
            device: DEVICE,
            type,

            direction,

            ...send,
            ...receive,

            day: dayjs(t).format('YYYY-MM-DD'),
            time: dayjs(t).format('HH:mm:ss'),
            ms: t,

            content: htmlToText(html),
            html: html.replace(/(\r\n|\r|\n)/gim, '<br/>'),

            $MobileQQ: {
                os: 'Android',
                raw: m,
                ...merger, // key res data
                rootPath: `${config.rootPath}`,
            },
        };
        fn && fn(msg);

        if (config.isFromOtherAccount) {
            _.set(msg, '_isDev.isFromOtherAccount', config.isFromOtherAccount);
        }

        _.set(msg, '$MobileQQ.key.input_files_kc', config.KEY);

        msgArr.push(msg);
    }
    bar.stop();

    return msgArr;
}

function getDirection(m) {
    return m.senderuin == m.frienduin ? 'come' : 'go';
}

module.exports = ToMsg;

// setTimeout(() => {}, 10000000);
