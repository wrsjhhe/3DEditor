using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization;

namespace Program_3D
{
    public class Func
    {
        public static List<string>  GetArrsTostring(object objs)
        {

            string[] arrs = (string[])objs;
            List<string> lst = new List<string>(arrs);

            return lst;


        }

    }
}