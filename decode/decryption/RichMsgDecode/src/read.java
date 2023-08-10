// 作者：Shepherd
// 链接：https://www.zhihu.com/question/23479178/answer/2629308283
// 来源：知乎
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.util.JsonFormat;
import java.io.*;


public class read {

    public static void testMsg(String p) throws InvalidProtocolBufferException {

            byte[] msgData = fs(p) ;
            RichMsg.PicRec picRec = RichMsg.PicRec.parseFrom(msgData);

//            String url = "chatimg:" + picRec.getMd5();
            // long value = CRC64FromString(url);
            //  System.out.println(value);

//            String filename = "";
//            if (value < 0) {
//                long abs = Math.abs(value);
//                filename = "-"+Long.toHexString(abs);
//            } else {
//                filename = Long.toHexString(value);
//            }
//            filename = "Cache_" + filename.replace("0x", "");
//            System.out.println(filename);

            String jsonString = JsonFormat.printer().print(picRec);
//            System.out.println(jsonString);
            OutputStreamWriter writer = null;
            try {
                writer = new OutputStreamWriter(new FileOutputStream(p+".json"),"UTF-8");
                writer.write(jsonString);
                writer.flush();
                writer.close();

            } catch (IOException e1) {
                e1.printStackTrace();
            }

//             System.out.println(picRec.toString());
    }
    private static final long[] table = new long[256];
    static {
        for(int n = 0; n < 256; ++n) {
            long crc = (long)n;
            for(int k = 0; k < 8; ++k) {
                if ((crc & 1L) != 0L) {
                    crc = crc >> 1 ^ -7661587058870466123L;
                } else {
                    crc >>= 1;
                }
            }
            table[n] = crc;
        }
    }

    public  static  long CRC64FromString(String val) {
        byte[] s = val.getBytes();
        long v = -1;
        for (int i = 0; i < val.length(); i++) {
            int value = s[i];
            v = table[(value ^ ((int) v)) & 255] ^ v >> 8;
        }
        return v;
    }

    public static byte[] fs(String p) {
        File file = new File(p);
        // File file = new File("./src/error/image-err-1620540174.data"); // 替换为你要读取的文件路径
        // File file = new File("./src/ok/1513351636.data"); // 替换为你要读取的文件路径
        byte[] msgData = null;
        FileInputStream fis = null;

        try {
            fis = new FileInputStream(file);
            msgData = new byte[(int) file.length()];
            int bytesRead = fis.read(msgData);
            if (bytesRead == -1) {
                throw new IOException("Failed to read file");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }


        return msgData;
    }
}




