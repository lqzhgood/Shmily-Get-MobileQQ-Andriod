# 说明

请先阅读 https://github.com/lqzhgood/Shmily

此工具是将 Android QQ/Tim 导出并转换为 `Shmily-Msg` 格式的工具


## 使用

> [!NOTE]
> Windows Only <br />
> 因为有使用到 Python C 等其他语言环境 <br />
> 为了减少依赖, 编译为 `exe` 捆绑在代码中  <br />

 
1. 🎞️ 安装 node 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs.html]
3. 🏞️ 下载本项目并解压 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/github-down-repo.html]
2. 复制文件到目录
    <details>

    -   数据库
        -   数据库 `input\data\databases`
            -   QQ
                -   /data/data/com.tencent.mobileqq/databases/
            -   Tim
                -   /data/data/com.tencent.tim/databases/
        -   密钥 `input\data\files\kc` <-- 这是个文件
            -   QQ
                -   /data/data/com.tencent.mobileqq/files/kc
            -   Tim
                -   /data/data/com.tencent.tim/files/kc
    -   资源文件 `input\assets`
        -   表情 `input\assets\.emotionsm`
            -   QQ
                -   /tencent/MobileQQ/.emotionsm
                -   /Android/data/com.tencent.mobileqq/Tencent/MobileQQ/.emotionsm
            -   Tim
                -   /tencent/Tim/.emotionsm
                -   /Android/data/com.tencent.tim/Tencent/Tim/.emotionsm
        -   图片 `input\assets\chatpic`
            -   QQ
                -   /Android/data/com.tencent.mobileqq/Tencent/MobileQQ/chatpic
            -   Tim
                -   /Android/data/com.tencent.tim/Tencent/Tim/chatpic
        -   语音 `input\assets\ptt`
            -   qq
                -   /Android/data/com.tencent.mobileqq/Tencent/MobileQQ/${QQ 号}/ptt
            -   Tim
                -   /tencent/Tim/${QQ 号}/ptt
                -   /Android/data/com.tencent.tim/Tencent/Tim/${QQ 号}/ptt
        -   文件 `input\assets\file`
            -   QQ
                -   /Android/data/com.tencent.mobileqq/Tencent/QQfile_recv
            -   TIM
                -   /Android/data/com.tencent.tim/Tencent/TIMfile_recv
        -   视频 `input\assets\video`
            -   Tim
                -   /tencent/Tim/shortvideo
                -   /Android/data/com.tencent.tim/Tencent/Tim/shortvideo
        -   其他 `input\assets\other`
            -   /tencent
            -   QQ /Android/data/com.tencent.mobileqq
            -   Tim /Android/data/com.tencent.tim
            -   所有你认为和聊天记录有关的文件
            -   如果找不到文件会,从这里面尽可能的 MD5 或者 文件名 去匹配

    </details>

-   修改 `config.js`
-   `npm run exportTable` 导出数据库
    > 产物是 `.\dist\_temp\table\*.json` 本次所有数据库中用到的数据
-   `npm run md5assets` 生成资源 MD5, 用来辅助资源解密

-   `npm run build` 解密并生成数据

    如果程序长时间(>10min)进度条无变化, 可能有以下原因

    -   下载资源时间过长，大部分原因是 CDN 的资源已经没有了，需要回源拿，导致第一次下载时间过长，有以下两种办法
        -   ctrl+c 重新来过吧，过会儿再试，第二次请求大概率就快了。 // 下载有断点机制，下载过的不会重复下载
        -   可以去 `utils\net.js` 设置 axiosDown 的 timeout，使每次下载若超过 timeout 则放弃
    -   `share2011` 解码失败, 可以去 `decode\typeMap.js` 中注释掉相应代码 (吐槽 ` java.io.Serializable` 用 js 硬解太难搞了, 还是建议用原生 `java` 去做解密吧)

-   [可选] 若和 QQ-PC 数据同时使用, 可通过 [Shmily-Get-QQ-PC_utils](https://github.com/lqzhgood/Shmily-Get-QQ-PC_utils) 去重

## 工具

### 批量导出

1. 执行完 `npm run build ` 之前的步骤
    - 可以在 `.\dist\_temp\table\friends.json` 查看到所有好友信息
        - uin 是 QQ 号码 | remark 是昵称（备注）
    - `.\tools\makeAll.js` 的 `EXCLUDE_LIST` 添加需要排除的 uin 或 remark
2. 修改 `config`
    - 将 `leftNum` 设置为 `MAKE_ALL_REPLACE_TEMPLATE_LEFT_NUM`
    - 将 `rootPath` 设置为 `MAKE_ALL_REPLACE_TEMPLATE_ROOT_PATH`
3. 执行 `npm run makeAll`


## 开发

### 消息特殊结构

QQ 消息中 表情/标识 等是使用 Map 表以二维的形式 传递/存储. 详见 `lib\qqEmoji\`

> 例如  你好呀 \u00014\u0011  -> 你好呀 [QQ经典-菜刀]

-   \u00014 表情组
    -   \u0011 第 11 个表情
-   \u0015 ??
-   \u0016 某种标识 多出现于字符串最前面（file、voip）

### 源码

https://github.com/tsuzcx/qq_apk




## 解密进度

```
// 2023/07/21

// js 本项目
// java https://github.com/ZhangJun2017/QQChatHistoryExporter
// python https://github.com/Yiyiyimu/QQ-History-Backup

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
//  "-5008" x-  x       x
//  "-5012" x   x       x
//  "-5018" x   x       x
//  "-5040" x   x
//  "-7012" x

// x- 部分支持


// 本项目支持类型详见
// /decode/typeMap.js

```

## 感谢

http://lqzhgood.github.io/Shmily/guide/other/thanks.html

## 捐赠

点击链接 http://lqzhgood.github.io/Shmily/guide/other/donation.html 看世界上最可爱的动物
