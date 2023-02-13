import java.io.*;
import java.util.Scanner;

import com.tencent.mobileqq.data.MarkFaceMessage;

public class DeserializeDemo
{
    public static void main(String [] args)
    {
        // 读取路径
        String p = args[0].trim();

        // decode emoji
        MarkFaceMessage e = null;
        try
        {
            FileInputStream fileIn = new FileInputStream(p);
            ObjectInputStream in = new ObjectInputStream(fileIn);
            e = (MarkFaceMessage) in.readObject();
            in.close();
            fileIn.close();
        }catch(IOException i)
        {
            i.printStackTrace();
            return;
        }catch(ClassNotFoundException c)
        {
            System.out.println("MarkFaceMessage class not found");
            c.printStackTrace();
            return;
        }


        OutputStreamWriter writer = null;
        try {
            writer = new OutputStreamWriter(new FileOutputStream(p+".json"),"UTF-8");
            writer.write(e.toJsonString());
            writer.flush();
            writer.close();

        } catch (IOException e1) {
            e1.printStackTrace();
        }
        //  System.out.println("Name: " + e.toJsonString());

    }
}