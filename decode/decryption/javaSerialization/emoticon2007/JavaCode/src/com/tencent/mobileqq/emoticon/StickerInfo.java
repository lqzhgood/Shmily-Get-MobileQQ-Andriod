package com.tencent.mobileqq.emoticon;

import java.io.Serializable;
import org.json.JSONObject;

public class StickerInfo implements Serializable {
    public static final String TAG = "StickerInfo";

    public static final long serialVersionUID = 1L;

    public float height = 0.0F;

    public long hostMsgSeq = 0L;

    public long hostMsgTime = 0L;

    public long hostMsgUid = 0L;

    public boolean isDisplayed = false;

    public boolean isShown = false;

    public String msg = "";

    public int originMsgType = 0;

    public int rotate = 0;

    public float width = 0.0F;

    public float x = 0.0F;

    public float y = 0.0F;

    public String toJsonString() {
        try {
            JSONObject jSONObject = new JSONObject();
           // this();
            jSONObject.put("originMsgType", this.originMsgType);
            jSONObject.put("x", this.x);
            jSONObject.put("y", this.y);
            jSONObject.put("width", this.width);
            jSONObject.put("height", this.height);
            jSONObject.put("rotate", this.rotate);
            jSONObject.put("hostMsgSeq", this.hostMsgSeq);
            jSONObject.put("hostMsgUid", this.hostMsgUid);
            jSONObject.put("hostMsgTime", this.hostMsgTime);
            jSONObject.put("isDisplayed", this.isDisplayed);
            jSONObject.put("isShown", this.isShown);
            jSONObject.put("msg", this.msg);
            return jSONObject.toString();
        } catch (Exception exception) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append("StickerInfo.toJsonString error + e = ");
            stringBuilder.append(exception);
            return "";
        }
    }

    public String toString() {
        return String.format("EmojiStickerInfo, originMsgType: %d,  x: %f, y: %f, width: %f, height: %f, rotate: %d, msgseq: %d, msgUid: %d", new Object[] { Integer.valueOf(this.originMsgType), Float.valueOf(this.x), Float.valueOf(this.y), Float.valueOf(this.width), Float.valueOf(this.height), Integer.valueOf(this.rotate), Long.valueOf(this.hostMsgSeq), Long.valueOf(this.hostMsgUid) });
    }
}
