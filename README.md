# 说明

请先阅读 https://github.com/lqzhgood/Shmily

此工具是将 Android QQ/Tim 导出并转换为 `Shmily-Msg` 格式的工具

### 使用

-   安装 node 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs.html]
-   安装 python 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/python.html]
    -   python 3.7.2
-   复制文件到目录
    <details>

    -   数据库
        -   数据库 input\data\databases
            -   QQ
                -   /data/data/com.tencent.mobileqq/databases/
            -   Tim
                -   /data/data/com.tencent.tim/databases/
        -   秘钥 input\data\files\kc <-- 这是个文件
            -   QQ
                -   /data/data/com.tencent.mobileqq/files/kc
            -   Tim
                -   /data/data/com.tencent.tim/files/kc
    -   资源文件 input\assets
        -   表情 input\assets\.emotionsm
            -   QQ
                -   /tencent/MobileQQ/.emotionsm
                -   /Android/data/com.tencent.mobileqq/Tencent/MobileQQ/.emotionsm
            -   Tim
                -   /tencent/Tim/.emotionsm
                -   /Android/data/com.tencent.tim/Tencent/Tim/.emotionsm
        -   图片 input\assets\chatpic
            -   QQ
                -   /Android/data/com.tencent.mobileqq/Tencent/MobileQQ/chatpic
            -   Tim
                -   /Android/data/com.tencent.tim/Tencent/Tim/chatpic
        -   语音 input\assets\ptt
            -   qq
                -   /Android/data/com.tencent.mobileqq/Tencent/MobileQQ/${QQ 号}/ptt
            -   Tim
                -   /tencent/Tim/${QQ 号}/ptt
                -   /Android/data/com.tencent.tim/Tencent/Tim/${QQ 号}/ptt
        -   文件
            -   QQ
                -   /Android/data/com.tencent.mobileqq/Tencent/QQfile_recv
            -   TIM
                -   /Android/data/com.tencent.tim/Tencent/TIMfile_recv
        -   视频
            -   Tim
                -   /tencent/Tim/shortvideo
                -   /Android/data/com.tencent.tim/Tencent/Tim/shortvideo
        -   其他 input\assets\other
            -   /tencent
            -   QQ /Android/data/com.tencent.mobileqq
            -   Tim /Android/data/com.tencent.tim
            -   所有你认为和聊天记录有关的文件
            -   如果找不到文件会,从这里面竟可能的 MD5 或者 文件名 去匹配

    </details>

-   修改 `config.js`
-   `npm run exportTable` 导出数据库
    > 产物是 `.\dist\table\*.json` 本次所有数据库中用到的数据
-   `npm run md5assets` 生成资源 MD5, 用来辅助资源解密
-   解压缩 `decode\decryption\javaSerialization\emoticon2007\jdk-18.0.2.1.zip`
    -   确保 `decode\decryption\javaSerialization\emoticon2007\jdk-18.0.2.1\bin\java.exe`
-   `npm run build` 解密并生成数据

    如果程序长时间(>10min)进度条无变化, 可能有以下原因

    -   `share2011` 解码失败, 可以去 `decode\typeMap.js` 中注释掉相应代码 (吐槽 ` java.io.Serializable` 用 js 硬解太难搞了, 还是建议用原生 `java` 去做解密吧)
    -   下载资源时间过长，大部分原因是 CDN 的资源已经没有了，需要回源拿，导致第一次下载时间过长，有以下两种办法
        -   可以去 `utils\net.js` 设置 axiosDown 的 timeout
        -   ctrl+c 重新来过吧，第二次请求大概率就快了。 // 下载有断点机制，下载过的不会重复下载

-   [可选] 若和 QQ-PC 数据同时使用, 可通过 [Shmily-Get-QQ-PC_utils](https://github.com/lqzhgood/Shmily-Get-QQ-PC_utils) 去重

### Msg 格式

```
{
        "source": "MobileQQ",
        "device": "OnePlus 3T",
        "type": "自定义表情",
        "direction": "come",
        "sender": "1111111111",
        "senderName": "fish",
        "receiver": "00000000",
        "receiverName": "null",
        "day": "2017-12-22",
        "time": "08:53:33",
        "ms": 1513904013000,
        "content": "[甜橙少女新年系列-吃饺子]",
        "html": "[甜橙少女新年系列-吃饺子]",

        ↑↑↑↑↑  参考 ${Msg} ↑↑↑↑↑↑↑

        "$MobileQQ": {
            // !!! 必须 !!! MobileQQ 细分类型
            "os": "Android",

            // 特殊类型标识
            type: "_混合消息"

            "raw": {
                // 数据库原始导出
                ……
                "msgData": {
                    "type": "Buffer"
                },
            },

            // 解密过程数据
            "key": {
                keyCode: 110
            },

            // 最终数据
            "res": {
                msgData:{} // 数据库相应字段解密
            },

            data:{
                // 其他前端展示需要的数据
                "webUrl": "/data/qq-android/emoticon/5e671f8149d1b094c44aa0f5232f9cfd.gif",
                "packName": "甜橙少女新年系列",
                "desc": "吃饺子",
                "mark": "过年喽，想要的祝福全在这里"
            },
            rootPath: `${config.rootPath}`,
        }
    },
```

#### 说明

QQ 内部的 Map 表为二维的形式

-   \u00014 表情组
    -   \u0011 第 11 个表情
-   \u0015 ??
-   \u0016 某种标识 多出现于字符串最前面（file、voip）

### QQ 源码

https://github.com/tsuzcx/qq_apk

## 解密进度

```
// 2023/02/12

// python https://github.com/Yiyiyimu/QQ-History-Backup
// java https://github.com/ZhangJun2017/QQChatHistoryExporter

//          js   java    python
//  "-1000" x   x       x
//  "-1002" x
//  "-1013" x
//  "-1035" x   x       x
//  "-1049" x   x       x
//  "-1051" x   x       x
//  "-2000" x   x       x
//  "-2005" x   x
//  "-2007" x   x
//  "-2009" x   x
//  "-2002" x   x
//  "-2011" x-  x
//  "-2012" x
//  "-2022" x   x
//  "-3008" x   x
//  "-5008" x   x       x
//  "-5012" x   x       x
//  "-5018" x   x       x
//  "-5040" x   x

// x- 部分支持


```

## 感谢

http://lqzhgood.github.io/Shmily/guide/other/thanks.html

## 捐赠

点击链接 http://lqzhgood.github.io/Shmily/guide/other/donation.html 看世界上最可爱的动物
