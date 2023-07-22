async function handler(m, merger, metaData) {}

module.exports = handler;

const tp = {
    app: 'com.tencent.structmsg',
    desc: '新闻',
    view: 'news',
    ver: '0.0.0.1',
    prompt: '[分享]【杭州#失联女童和父亲最后通话#：爸爸 我回不来了】#失',
    appID: '',
    sourceName: '',
    actionData: '',
    actionData_A: '',
    meta: {
        news: {
            action: '',
            android_pkg_name: 'com.sina.weibo',
            app_type: 1,
            appid: 100736903,
            desc: '来自 新浪新闻客户端 的微博',
            jumpUrl: 'url.cn/5DteCnh', // 真实 url https://m.weibo.cn/status/4393686140019894?sourceType=qq&from=1097195010&wm=20005_0002&featurecode=newtitle
            preview: 'url.cn/54iqpY2', // 过期
            source_icon: 'url.cn/5sVXO4i', // icon png
            source_url: 'url.cn/51Spvti', // https://web.p.qq.com/qqmpmobile/aio/app.html?id=100736903
            tag: '新浪微博',
            title: '【杭州#失联女童和父亲最后通话#：爸爸 我回不来了】#失联...',
        },
    },
    config: {
        forward: true,
        type: 'normal',
        autosize: true,
    },
};
