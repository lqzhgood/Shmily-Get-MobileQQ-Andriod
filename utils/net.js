const fs = require('fs-extra');
const path = require('path');
const axiosBase = require('axios');
const ResizeImage = require('../lib/ResizeImage.js');
const { QQ_COOKIE, DIST_DIR } = require('@/config.js');

const axiosDown = axiosBase.create({
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    },
    // timeout: 60 * 1000,
});

function down(url, absoluteOutFile) {
    url = ResizeImage(url);
    if (!absoluteOutFile) {
        const tmpDir = path.join(DIST_DIR, 'tmp');
        fs.mkdirpSync(tmpDir);
        const tmpName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
        const tmpFile = path.join(tmpDir, tmpName);
        absoluteOutFile = tmpFile;
    }
    const writer = fs.createWriteStream(absoluteOutFile);

    return axiosDown({
        method: 'get',
        url,
        responseType: 'stream',
    })
        .then(response => {
            return new Promise((resolve, reject) => {
                response.data.pipe(writer);
                let error = null;
                writer.on('error', err => {
                    error = err;
                    writer.close();
                    resolve([error, null]);
                });
                writer.on('close', () => {
                    if (!error) {
                        let file_type = '';

                        const type = response.headers['content-type'].toLowerCase();
                        if (type.startsWith('text/html')) {
                            file_type = '.html';
                        } else if (type.startsWith('application/pdf')) {
                            file_type = '.pdf';
                        } else if (type.startsWith('image/jpeg')) {
                            file_type = '.jpg ';
                        } else if (type.startsWith('image/gif')) {
                            file_type = '.gif ';
                        } else if (type.startsWith('image/png')) {
                            file_type = '.png ';
                        } else if (type.startsWith('application/x-zip-compressed')) {
                            file_type = '.zip ';
                        }

                        if (file_type) {
                            const nFile = absoluteOutFile + file_type;
                            fs.renameSync(absoluteOutFile, nFile);
                            absoluteOutFile = nFile;
                        }
                        resolve([null, absoluteOutFile]);
                    } else {
                        resolve([error, null]);
                    }
                });
            });
        })
        .catch(err => {
            return [err, null];
        });
}

const axiosQQ = axiosBase.create({
    headers: {
        'User-Agent':
            'Mozilla/5.0 (Linux; Android 7.1.2; ONEPLUS A3010 Build/N2G47H; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/89.0.4389.72 MQQBrowser/6.2 TBS/046011 Mobile Safari/537.36 V1_AND_SQ_8.8.88_2770_YYB_D A_8088800 QQ/8.8.88.7830 NetType/WIFI WebP/0.3.0 Pixel/1080 StatusBarHeight/73 SimpleUISwitch/0 QQTheme/1000 InMagicWin/0 StudyMode/0 CurrentMode/0 CurrentFontScale/1.0 GlobalDensityScale/1.0285715 AppId/537117916',
        'cookie': QQ_COOKIE,
    },
});

function isUrl(u) {
    try {
        new URL(u);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    down,
    axiosQQ,
    isUrl,
};
