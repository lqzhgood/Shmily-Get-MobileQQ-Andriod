const dayjs = require('dayjs');
const path = require('path');
const fs = require('fs-extra');
const { ddString } = require('../utils/ddData');
const { TYPE_DICT } = require('../utils/dictMap');

const { FILE_WEB_PUBLIC_DIR, FILE_DIR_OUT_DIR } = require('@/config.js');

const { matchFile } = require('../utils/matchFile');

const DIR_TYPE = 'system';
const FILE_DIR = path.join(FILE_DIR_OUT_DIR, DIR_TYPE);
fs.mkdirpSync(FILE_DIR);

const WEB_DIR = `${FILE_WEB_PUBLIC_DIR}/${DIR_TYPE}`;

async function handler(m, merger) {
    const o = JSON.parse(ddString(m, 'msgData.data'));
    merger.res.msgData = o;

    // type O = {
    //    field_baseprofile: { age: number, gender: 1 |2 , place: string, addfrd_src: '帐号查找'| 'QQ群-ABC' | ?? },
    //     field_personal_labels: string[],
    //     key_ask_anonymously?:{
    //         key_question_time:number,
    //         key_question_str:string,
    //         key_answer_str:string,
    //     }
    //     field_qzone?: {
    //         img_urls: string[]
    //     }
    // }

    const nicePics = [];
    const qZonePics = [];

    let html = `<div>`;

    html += `<h3>系统消息-添加好友</h3>
            <h4>基本信息</h4>
            <ul>
                <li>年龄：${o.field_baseprofile.age}</li>
                <li>性别：${genderMap(o.field_baseprofile.gender)}</li>
                <li>地点：${o.field_baseprofile.place}</li>
                <li>来源：${o.field_baseprofile.addfrd_src}</li>
            </ul>`;

    html += `<h4>个人标签</h4>
             <ul>
                ${o.field_personal_labels.map(v => `<li>${v}</li>`).join('')}
            </ul>`;

    if (o.field_nicepics) {
        for (let i = 0; i < o.field_nicepics.length; i++) {
            const p = o.field_nicepics[i];

            const { ori, medium, ...otherUrl } = p;

            const urls = [ori, medium, ...Object.values(otherUrl)];

            const match = await matchFile(WEB_DIR, FILE_DIR, urls, m);

            if (match) {
                const { webUrl } = match;
                nicePics.push(webUrl);
            } else {
                nicePics.push(urls[0]);
            }
        }

        html +=
            `<h4>精选照片</h4>` + nicePics.map(v => `<div><img src="${v}" alt='[图]' title='[图]' /></div>`).join('');
    }

    if (o.field_qzone) {
        for (let i = 0; i < o.field_qzone.img_urls.length; i++) {
            const url = o.field_qzone.img_urls[i];
            const urls = [url];

            const match = await matchFile(WEB_DIR, FILE_DIR, urls, m);

            if (match) {
                const { webUrl } = match;
                qZonePics.push(webUrl);
            } else {
                qZonePics.push(urls[0]);
            }
        }

        html +=
            `<h4>空间照片</h4>` + qZonePics.map(v => `<div><img src="${v}" alt='[图]' title='[图]' /></div>`).join('');
    }

    if (o.key_ask_anonymously) {
        html += `<h4>好友匿名提问</h4>
        <div>${dayjs(o.key_ask_anonymously.key_question_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div>问：${o.key_ask_anonymously.key_question_str}</div>
        <div>答：${o.key_ask_anonymously.key_answer_str}</div>`;
    }

    html += `</div>`;
    merger.data = {
        type: TYPE_DICT('_系统消息_添加好友'),
        ...o,
        field_nicepics: nicePics,
        field_qzone: qZonePics,
    };

    return {
        html,
    };
}

function genderMap(g) {
    switch (g) {
        case 1:
            return '男';
        case 2:
            return '女';
        default:
            return `未知-${g}`;
    }
}

module.exports = handler;

const tp = {
    _id: 3,
    extInt: 0,
    extLong: 0,
    extStr: '',
    extraflag: 0,
    frienduin: '110',
    isValid: 1,
    isread: 1,
    issend: 0,
    istroop: 0,
    longMsgCount: 0,
    longMsgId: 0,
    longMsgIndex: 0,
    msgData: {
        type: 'Buffer',
        data: {
            field_baseprofile: {
                age: 110,
                gender: 1, // 男
                place: '地球',
                addfrd_src: 'QQ群-ABC',
            },
            field_personal_labels: ['4个共同好友', '巨蟹座', 'MC'],
            field_nicepics: [
                {
                    ori: 'http://ugc.qpic.cn/mqq_photo/0/xxxxx/0',
                    medium: 'http://ugc.qpic.cn/mqq_photo/0/xxxxx/160',
                },
            ],
            key_ask_anonymously: {
                key_question_id: 'U_123456',
                key_question_str: 'Q',
                key_question_time: 1661481729,
                key_answer_str: 'A',
            },
        },
    },
    msgId: 0,
    msgUid: 0,
    msgseq: 1664542548,
    msgtype: -7012,
    selfuin: '119',
    sendFailCode: 0,
    senderuin: '110',
    shmsgseq: 0,
    time: 1664542548,
    uniseq: '7149155854704733851',
    versionCode: 3,
    vipBubbleID: 0,
    mExJsonObject: null,
};

const tp2 = {
    msgData: {
        field_baseprofile: { age: 102, gender: 2, place: '广州', addfrd_src: '帐号查找' },
        field_personal_labels: ['1个共同好友', '狮子座', '二次元', '明日方舟', '刀客塔'],
        field_qzone: {
            img_urls: ['http://1.com', 'http://2.com', 'http://3.com'],
        },
    },
};
