using System.Collections.Generic;
using System.Web.Script.Serialization;
using Newtonsoft.Json.Linq;

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

        public static string GetString(object obj)
        {
            string str = (string)obj;
            return str;
        }
        public static List<T> JSONStringToList<T>(string JsonStr)
        {
            JavaScriptSerializer Serializer = new JavaScriptSerializer();
            List<T> objs = Serializer.Deserialize<List<T>>(JsonStr);
            return objs;
        }
    }
}