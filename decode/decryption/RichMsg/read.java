// 作者：Shepherd
// 链接：https://www.zhihu.com/question/23479178/answer/2629308283
// 来源：知乎
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

public static void testMsg(Connection connection) throws SQLException, InvalidProtocolBufferException {
        Statement statement = connection.createStatement();
        statement.setQueryTimeout(30); // set timeout to 30 sec.
        // 执行查询语句
        ResultSet rs = statement.executeQuery("select extStr,selfuin, frienduin, senderuin, issend, msgUid, msgData from mr_friend_3DAEEB4D801A88F08AF16930B5DB7C60_New where msgtype=-2000");
        while (rs.next()) {
            byte[] msgData = QqDecryptUtil.decryptBytes(rs.getBytes("msgData"));
            RichMsg.PicRec picRec = RichMsg.PicRec.parseFrom(msgData);
            String url = "chatimg:" + picRec.getMd5();
            long value = CRC64FromString(url);
            String filename = "";
            if (value < 0) {
                long abs = Math.abs(value);
                filename = "-"+Long.toHexString(abs);
            } else {
                filename = Long.toHexString(value);
            }
            filename = "Cache_" + filename.replace("0x", "");
            System.out.println(picRec);
​
        }
    }
​
​
​
    private static final long[] table = new long[256];
    static {
        for(int n = 0; n < 256; ++n) {
            long crc = (long)n;
​
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
​
    public  static  long CRC64FromString(String val) {
        byte[] s = val.getBytes();
        long v = -1;
        for (int i = 0; i < val.length(); i++) {
            int value = s[i];
            v = table[(value ^ ((int) v)) & 255] ^ v >> 8;
        }
        return v;
    }
​
​