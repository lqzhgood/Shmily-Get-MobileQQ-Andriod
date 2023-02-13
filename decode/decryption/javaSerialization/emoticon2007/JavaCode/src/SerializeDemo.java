import com.tencent.mobileqq.data.MarkFaceMessage;

import java.io.*;

public class SerializeDemo{
    public static void main(String [] args)
    {
        MarkFaceMessage e = new MarkFaceMessage();
        try
        {
            FileOutputStream fileOut =
                    new FileOutputStream("./emoji.txt");
            ObjectOutputStream out = new ObjectOutputStream(fileOut);
            out.writeObject(e);
            out.close();
            fileOut.close();
            System.out.printf("Serialized data is saved in /tmp/employee.ser");
        }catch(IOException i)
        {
            i.printStackTrace();
        }
    }
}
