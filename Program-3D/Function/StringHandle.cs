using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace Program_3D
{
    public class StringHandle
    {
        public static List<string>  GetArrsToString(object objs)
        {

            string[] arrs = (string[])objs;
            List<string> lst = new List<string>(arrs);

            return lst;

        }
        public static List<T> JSONStringToList<T>(string JsonStr)
        {
            JavaScriptSerializer Serializer = new JavaScriptSerializer();
            List<T> objs = Serializer.Deserialize<List<T>>(JsonStr);
            return objs;
        }
    }
}