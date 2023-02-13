package com.tencent.mobileqq.data;

import com.tencent.mobileqq.emoticon.StickerInfo;

import org.json.JSONObject;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

public class MarkFaceMessage implements Serializable {
    public static final long serialVersionUID = 102222L;

    public String backColor;

    public long beginTime = 0L;

    public int cFaceInfo = 1;

    public int cSubType = 3;

    public String copywritingContent;

    public int copywritingType = 0;

    public int dwMSGItemType = 6;

    public int dwTabID;

    public long endTime = 0L;

    public String faceName = null;

    public String from;

    public boolean hasIpProduct = false;

    public int imageHeight = 0;

    public int imageWidth = 0;

    public long index = 0L;

    public boolean isAPNG = false;

    public boolean isReword = false;

    public String jumpUrl;

    public int mediaType = 0;

    public byte[] mobileparam;

    public byte[] resvAttr;

    public byte[] sbfKey;

    public byte[] sbufID;

    public boolean shouldDisplay = false;

    public boolean showIpProduct = false;

    public StickerInfo stickerInfo = null;

    public List<Integer> voicePrintItems;

    public String volumeColor;

    public int wSize = 37;


    public String toJsonString() {
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("index",this.index);
            jSONObject.put("faceName",this.faceName);
            jSONObject.put("dwMSGItemType",this.dwMSGItemType);
            jSONObject.put("cFaceInfo",this.cFaceInfo);
            jSONObject.put("wSize",this.wSize);
            jSONObject.put("sbufID",this.sbufID);
            jSONObject.put("dwTabID",this.dwTabID);
            jSONObject.put("cSubType",this.cSubType);
            jSONObject.put("hasIpProduct",this.hasIpProduct);
            jSONObject.put("showIpProduct",this.showIpProduct);
            jSONObject.put("sbfKey",this.sbfKey);
            jSONObject.put("mediaType",this.mediaType);
            jSONObject.put("imageWidth",this.imageWidth);
            jSONObject.put("imageHeight",this.imageHeight);
            jSONObject.put("mobileparam",this.mobileparam);
            jSONObject.put("resvAttr",this.resvAttr);
            jSONObject.put("isReword",this.isReword);
            jSONObject.put("copywritingType",this.copywritingType);
            jSONObject.put("copywritingContent",this.copywritingContent);
            jSONObject.put("jumpUrl",this.jumpUrl);
            jSONObject.put("shouldDisplay",this.shouldDisplay);
            jSONObject.put("stickerInfo",this.stickerInfo);
            return jSONObject.toString();
        } catch (Exception exception) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append("MarkFaceMessage.toJsonString error + e = ");
            stringBuilder.append(exception);
            return "";
        }
    }

    public String toString() {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("MarkFaceMessage{index=");
        stringBuilder.append(this.index);
        stringBuilder.append(", faceName='");
        stringBuilder.append(this.faceName);
        stringBuilder.append('\'');
        stringBuilder.append(", dwMSGItemType=");
        stringBuilder.append(this.dwMSGItemType);
        stringBuilder.append(", cFaceInfo=");
        stringBuilder.append(this.cFaceInfo);
        stringBuilder.append(", wSize=");
        stringBuilder.append(this.wSize);
        stringBuilder.append(", sbufID=");
        stringBuilder.append(Arrays.toString(this.sbufID));
        stringBuilder.append(", dwTabID=");
        stringBuilder.append(this.dwTabID);
        stringBuilder.append(", cSubType=");
        stringBuilder.append(this.cSubType);
        stringBuilder.append(", hasIpProduct=");
        stringBuilder.append(this.hasIpProduct);
        stringBuilder.append(", showIpProduct=");
        stringBuilder.append(this.showIpProduct);
        stringBuilder.append(", sbfKey=");
        stringBuilder.append(Arrays.toString(this.sbfKey));
        stringBuilder.append(", mediaType=");
        stringBuilder.append(this.mediaType);
        stringBuilder.append(", imageWidth=");
        stringBuilder.append(this.imageWidth);
        stringBuilder.append(", imageHeight=");
        stringBuilder.append(this.imageHeight);
        stringBuilder.append(", mobileparam=");
        stringBuilder.append(Arrays.toString(this.mobileparam));
        stringBuilder.append(", resvAttr=");
        stringBuilder.append(Arrays.toString(this.resvAttr));
        stringBuilder.append(", isReword=");
        stringBuilder.append(this.isReword);
        stringBuilder.append(", copywritingType=");
        stringBuilder.append(this.copywritingType);
        stringBuilder.append(", copywritingContent='");
        stringBuilder.append(this.copywritingContent);
        stringBuilder.append('\'');
        stringBuilder.append(", jumpUrl='");
        stringBuilder.append(this.jumpUrl);
        stringBuilder.append('\'');
        stringBuilder.append(", shouldDisplay=");
        stringBuilder.append(this.shouldDisplay);
        stringBuilder.append(", stickerInfo=");
        stringBuilder.append(this.stickerInfo);
        stringBuilder.append('}');
        return stringBuilder.toString();
    }
}
