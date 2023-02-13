/* eslint-disable no-useless-escape */
// https://clso.fun/

function ResizeImage(url) {
    let m = null;
    let nUrl;

    //google
    if (
        (m = url.match(
            /^(https?:\/\/lh\d+\.googleusercontent\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i,
        ))
    ) {
        if (m[2] != 's0') {
            nUrl = m[1] + 's0' + m[3];
        }
    } else if ((m = url.match(/^(https?:\/\/lh\d+\.googleusercontent\.com\/.+=)(.+)(?:\?.+)?$/i))) {
        if (m[2] != 's0') {
            nUrl = m[1] + 's0';
        }
    } else if (
        (m = url.match(
            /^(https?:\/\/\w+\.ggpht\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i,
        ))
    ) {
        if (m[2] != 's0') {
            nUrl = m[1] + 's0' + m[3];
        }
    }

    //blogspot
    else if (
        (m = url.match(
            /^(https?:\/\/\w+\.bp\.blogspot\.com\/.+\/)([^\/]+)(\/[^\/]+(\.(jpg|jpeg|gif|png|bmp|webp))?)(?:\?.+)?$/i,
        ))
    ) {
        if (m[2] != 's0') {
            nUrl = m[1] + 's0' + m[3];
        }
    }

    //性浪微博
    else if (
        (m = url.match(
            /^(https?:\/\/(?:(?:ww|wx|ws|tvax|tva)\d+|wxt|wt)\.sinaimg\.(?:cn|com)\/)([\w\.]+)(\/.+)(?:\?.+)?$/i,
        ))
    ) {
        if (m[2] != 'large') {
            nUrl = m[1] + 'large' + m[3];
        }
    }

    //zhihu
    else if (
        (m = url.match(
            /^(https?:\/\/.+\.zhimg\.com\/)(?:\d+\/)?([\w\-]+_)(\w+)(\.(jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i,
        ))
    ) {
        if (m[3] != 'r') {
            nUrl = m[1] + m[2] + 'r' + m[4];
        }
    }

    //pinimg
    else if ((m = url.match(/^(https?:\/\/i\.pinimg\.com\/)(\w+)(\/.+)$/i))) {
        if (m[2] != 'originals') {
            nUrl = m[1] + 'originals' + m[3];
        }
    } else if ((m = url.match(/^(https?:\/\/s-media[\w-]+\.pinimg\.com\/)(\w+)(\/.+)$/i))) {
        //need delete?
        if (m[2] != 'originals') {
            nUrl = m[1] + 'originals' + m[3];
        }
    }

    //bilibili
    else if ((m = url.match(/^(https?:\/\/\w+\.hdslb\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))(@|_).+$/i))) {
        nUrl = m[1];
    }

    //taobao(tmall)
    else if ((m = url.match(/^(https?:\/\/(?:img|gma)\.alicdn\.com\/.+\.(jpg|jpeg|gif|png|bmp|webp))_.+$/i))) {
        nUrl = m[1];
    }

    //jd
    else if ((m = url.match(/^(https?:\/\/(?:img\d+)\.360buyimg\.com\/)((?:.+?)\/(?:.+?))(\/(?:.+?))(\!.+)?$/i))) {
        if (m[2] != 'sku/jfs') {
            nUrl = m[1] + 'sku/jfs' + m[3];
        }
    }

    //百度贴吧（然而对于画质提升什么的并没有什么卵用...）
    else if (!(m = url.match(/^https?:\/\/imgsrc\.baidu\.com\/forum\/pic\/item\/.+/i))) {
        if (
            (m = url.match(
                /^(https?):\/\/(?:imgsrc|imgsa|\w+\.hiphotos)\.(?:bdimg|baidu)\.com\/(?:forum|album)\/.+\/(\w+\.(?:jpg|jpeg|gif|png|bmp|webp))(?:\?.+)?$/i,
            ))
        ) {
            nUrl = m[1] + '://imgsrc.baidu.com/forum/pic/item/' + m[2];
        }
    }

    if (nUrl) {
        // console.log('ResizeImage', url, nUrl);
    }

    return nUrl || url;
}

module.exports = ResizeImage;
