using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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