const { Log } = require('@/utils/index');
const { TYPE_DICT } = require('./utils/dictMap');

/**
 * @name: 各种类型的 handler
 * @description:
 *              - 会修改 m ,解密 [key] 的 [Value] 至 m.$data[key] =[Value] *
 *
 * 有两种 return
 * @return html
 * @return {
 *              type: enum in TYPE_DICT
 *              html: String
 *              merger: Object  <-- 合并到 msg.$MobileQQ, 内容为前端要用到的各种值
 *              fn(msg){ } 可以修改msg根
 *          }
 */
const text = require('./typeHandle/text/index.js');
const system = require('./typeHandle/system.js');
const image = require('./typeHandle/image/index.js');
const mixMsg = require('./typeHandle/mixMsg.js');
const file = require('./typeHandle/file.js');
const voip = require('./typeHandle/voip.js');
const share5008 = require('./typeHandle/share5008/index.js');
const share2011 = require('./typeHandle/share2011/index.js');
const video = require('./typeHandle/video.js');
const audio = require('./typeHandle/audio.js');
const emoticon = require('./typeHandle/emoticon/index.js');
const addFriend = require('./typeHandle/addFriend.js');
const unknown_7010 = require('./typeHandle/unknown_7010/index.js');
const unknown_8018 = require('./typeHandle/unknown_8018/index.js');

const _test = require('./typeHandle/_test.js');

async function typeMap(m) {
    const { msgtype } = m;

    // 贯穿全部操作, 操作中直接对 merger 赋值 不再作为返回值
    const merger = { res: {} };

    //  "os":    "Android",
    // "raw": { } // 数据的原始样貌
    // "key": {} // 解密过程中有帮助的值或备注
    // "res": {} // 和 raw  key一一对应, value 为解密后的数据   如未加密则  raw =res
    // "data": {} // 前端组件显示所需要的数据
    // "rootPath" ///  /data/ $rootPath /img/123.png 资源文件夹名称

    if (m.extStr) {
        merger.res.extStr = JSON.parse(m.extStr);
    }

    switch (msgtype) {
        case -1000:
            return {
                type: TYPE_DICT('消息'),
                html: text(m, TYPE_DICT('_文本'), merger),
                merger,
            };
        case -1002:
            return {
                type: TYPE_DICT('系统消息'),
                html: system(m, TYPE_DICT('_系统消息_钱提醒'), merger),
                merger,
            };
        case -1013:
            return {
                type: TYPE_DICT('系统消息'),
                html: system(m, TYPE_DICT('_系统消息_成为好友'), merger),
                merger,
            };
        case -1035: {
            const { type, html } = await mixMsg(m, merger);
            return {
                type,
                html,
                merger,
            };
        }
        case -1049: // _回复的文本 not template
            return {
                type: TYPE_DICT('消息'),
                html: text(m, '_文本_回复的消息', merger),
                merger,
            };
        case -1051:
            return {
                type: TYPE_DICT('消息'),
                html: text(m, TYPE_DICT('_文本_长文本'), merger),
                merger,
            };

        case -2000: {
            const { html } = await image(m, merger);
            return {
                type: TYPE_DICT('图片'),
                html,
                merger,
            };
        }
        case -2002: {
            const { html } = await audio(m, merger);
            return {
                type: TYPE_DICT('语音'),
                html,
                merger,
            };
        }

        case -2005: {
            const { html } = file(m, TYPE_DICT('_文件_发送文件'), merger);
            return {
                type: TYPE_DICT('文件'),
                html,
                merger,
            };
        }

        case -2007: {
            const { html } = await emoticon(m, merger);
            return {
                type: TYPE_DICT('自定义表情'),
                html,
                merger,
            };
        }

        case -2009: {
            const { html } = voip(m, merger);
            return {
                type: TYPE_DICT('视频通话'),
                html,
                merger,
            };
        }
        case -2011: {
            // 这里样本数据不够, 解码方法大概率不完备 可能导致死循环
            // 如果死循环 可以使用
            // const { type = TYPE_DICT('分享'), html = '' } = {};
            // 替代下一行代码
            const { type, html } = await share2011(m, merger);
            return {
                type,
                html,
                merger,
            };
        }
        case -2012: {
            return {
                type: TYPE_DICT('系统消息'),
                html: system(m, TYPE_DICT('_系统消息_好友_黑名单开关'), merger),
                merger,
            };
        }

        case -2022: {
            const { html } = await video(m, merger);
            return {
                type: TYPE_DICT('视频'),
                html,
                merger,
            };
        }

        case -2031: {
            return {
                type: TYPE_DICT('撤回'),
                html: text(m, TYPE_DICT('_文本_对方尝试撤回'), merger),
                merger,
            };
        }

        case -3008: {
            const { html } = file(m, TYPE_DICT('_文件_收到文件'), merger);
            return {
                type: TYPE_DICT('文件'),
                html,
                merger,
            };
        }
        case -5008: {
            const { type, html } = await share5008(m, merger);
            return {
                type,
                html,
                merger,
            };
        }
        case -5012: {
            return {
                type: TYPE_DICT('动作'),
                html: text(m, TYPE_DICT('_文本_戳一戳'), merger),
                merger,
            };
        }
        case -5018:
            return {
                type: TYPE_DICT('动作'),
                html: text(m, TYPE_DICT('_文本_未知动作'), merger),
                merger,
            };

        case -5040: {
            return {
                type: TYPE_DICT('撤回'),
                html: text(m, TYPE_DICT('_文本_撤回'), merger),
                merger,
            };
        }

        case -7012: {
            const { html } = await addFriend(m, merger);

            return {
                type: TYPE_DICT('系统消息'),
                html,
                merger,
            };
        }

        case -10000: {
            return {
                type: TYPE_DICT('消息'),
                html: text(m, TYPE_DICT('_文本_自动回复'), merger),
                merger,
            };
        }

        case 'TEST': {
            _test(m);

            return {
                type: '',
                html: '',
                merger,
            };
        }

        default: {
            const test = _test(m);
            Log.unknownType(m, test);
            const o = {
                type: TYPE_DICT('未知'),
                html: '[未知类型]',

                merger: {
                    test,
                    ...merger,
                },
            };

            if (msgtype == -7010) {
                const { html } = unknown_7010(m, merger);
                o.html = html;
            }

            if (msgtype == -8018) {
                // TYPE应该归类到 消息 但是没完全解密之前还是归类到未知吧
                // 解密完还需要考虑 Show 的表情统计
                const { html } = unknown_8018(m, merger);
                o.html = html;
            }

            return o;
        }
    }
}

module.exports = typeMap;
