# 说明

请先阅读 https://github.com/lqzhgood/Shmily

此工具是将 Android QQ/Tim 导出并转换为 `Shmily-Msg` 格式的工具

## 使用

> [!NOTE]
> Windows Only <br />
> 因为有使用到 Python C 等其他语言环境 <br />
> 为了减少依赖, 编译为 `exe` 捆绑在代码中 <br />

1. 🎞️ 安装 node 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs.html]
```diff
+ 🎞️ 2-10   -->   https://www.bilibili.com/video/BV1P94y1P7hs/
```
2. 🏞️ 下载本项目并解压 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/github-down-repo.html]
3. 🎞️ 安装依赖 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs-dependencies.html]
4. 按说明将 手机QQ 相关文件复制到 `input` 目录 (Git 不允许上传空目录, 没有就自己新建)
    <details>

    ```
    // input 文件夹结构

    -\ input
        -\ data
            -\ databases  // 数据库
            -\ files      // 数据库解密相关文件
                - kc
        -\ assets
            -\ .emotionsm // 表情 注意有个 . 开头
            -\ chatpic    // 图片
            -\ ptt        // 语音
            -\ file       // 文件
            -\ video      // 视频
            -\ other      // 其他文件
                -\ tencent
                -\ QQ
                -\ Tim
                -\ ...

    // 关于 `other\*`
    所有和聊天记录相关的文件都可以放这里, 结构不限
    找不到的文件会从`other`中使用`MD5`或`文件名`去匹配
    ```

    | 一级      | 二级          | QQ 路径                                                         | TIM 路径                                              |
    | --------- | ------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
    | `data\`   |               |                                                                 |                                                       |
    |           | `databases\`  | /data/data/com.tencent.mobileqq/databases/                      | /data/data/com.tencent.tim/databases/                 |
    |           | `files\kc`    | /data/data/com.tencent.mobileqq/files/kc                        | /data/data/com.tencent.tim/files/kc                   |
    | `assets\` |               |                                                                 |                                                       |
    |           | `.emotionsm\` | /tencent/MobileQQ/.emotionsm/                                   | /tencent/Tim/.emotionsm/                              |
    |           |               | /Android/data/com.tencent.mobileqq/Tencent/MobileQQ/.emotionsm/ | /Android/data/com.tencent.tim/Tencent/Tim/.emotionsm/ |
    |           | `chatpic\`    | /Android/data/com.tencent.mobileqq/Tencent/MobileQQ/chatpic/    | /Android/data/com.tencent.tim/Tencent/Tim/chatpic/    |
    |           | `ptt\`        | /Android/data/com.tencent.mobileqq/Tencent/MobileQQ/${QQ}/ptt/  | /tencent/Tim/${QQ}/ptt/                               |
    |           |               |                                                                 | /Android/data/com.tencent.tim/Tencent/Tim/${QQ}/ptt/  |
    |           | `file\`       | /Android/data/com.tencent.mobileqq/Tencent/QQfile_recv/         | /Android/data/com.tencent.tim/Tencent/TIMfile_recv/   |
    |           | `video\`      |                                                                 | /tencent/Tim/shortvideo/                              |
    |           |               |                                                                 | /Android/data/com.tencent.tim/Tencent/Tim/shortvideo/ |
    |           | `other\*`     | /tencent                                                        | /tencent                                              |
    |           |               | /Android/data/com.tencent.mobileqq                              | /Android/data/com.tencent.tim                         |
    |           |               | ...                                                             | ...                                                   |

    </details>

5. 修改 `config.js`
   ```js
    rightNum: '110', //  我自己的QQ 展示在右边
    rightName: '', // 留空将从数据库中获取
    leftNum: '119', // 对方的QQ 展示在左边
    leftName: '', // 留空将从数据库中获取

    // 此次资源的标识符 会作为以下用途
    // [数据文件].json
    // [资源文件] 夹名称   /data/${rootPath}/**.*
    // 建议按以下规则修改
    rootPath: 'MobileQQ-Android-123456-20230101',
   ```
6. `npm run exportTable` 导出数据库
   > 产物是 `.\dist\_temp\table\*.json` 本次所有数据库中用到的数据
7. `npm run md5assets` 生成资源 MD5, 用来辅助资源解密
8. `npm run build` 解密并生成数据 
   > 如果程序长时间(>10min)进度条无变化, 可能有以下原因
   > 
   > - 下载资源时间过长，大部分原因是 CDN 的资源已经没有了，需要回源拿，导致第一次下载时间过长，有以下两种办法
   >   - `ctrl+c` 重新来过吧，过会儿再试，第二次请求大概率就快了。 // 下载有断点机制，下载过的不会重复下载
   >   - 可以去 `utils\net.js` 按说明修改 `axiosDown` 的 `timeout`，使每次下载若超过 `timeout` 则放弃
   > - `share2011` 解码失败
   >   - 可以去 `decode\typeMap.js` 中按说明注释掉相应代码 (吐槽 `java.io.Serializable` 用 `js` 硬解太难搞了, 还是建议用原生 `java` 去做解密吧)

9. [可选] 若和 QQ-PC 数据同时使用, 可通过 [Shmily-Get-QQ-PC_utils](https://github.com/lqzhgood/Shmily-Get-QQ-PC_utils) 去重
10. 完成
```
                           是  ---> Get   http://lqzhgood.github.io/Shmily/guide/use/get.html
                          /  
还需要导出其他类型的数据吗 ? 
                          \  
                           否  ---> Show  http://lqzhgood.github.io/Shmily/guide/use/show.html
```

## 工具

### 获取第 n 条消息
命令行执行 `node .\tools\findOne.js {n}`

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

> 例如 你好呀 \u00014\u0011 -> 你好呀 [QQ 经典-菜刀]

-   \u00014 表情组
    -   \u0011 第 11 个表情
-   \u0015 ??
-   \u0016 某种标识 多出现于字符串最前面（file、voip）

### 源码

https://github.com/tsuzcx/qq_apk

## 解密进度

所有支持的类型详见 [dictMap.js](./decode/utils/dictMap.js)

`msgtype` 详见 [typeMap.js](./decode/typeMap.js)

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
```

## 感谢

http://lqzhgood.github.io/Shmily/guide/other/thanks.html

## 捐赠

点击链接 http://lqzhgood.github.io/Shmily/guide/other/donation.html 看世界上最可爱的动物
