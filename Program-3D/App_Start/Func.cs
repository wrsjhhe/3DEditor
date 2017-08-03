using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Program_3D
{
    public class Func
    {
        public static string GetArrsTostring(object objs)
        {
            try
            {
                string[] arrs = (string[])objs;
                string ret = string.Empty;
                if (arrs != null && arrs.Length > 0)
                {
                    foreach (var item in arrs)
                    {
                        ret += item;
                    }
                }
                return ret;
            }
            catch (Exception e)
            {
                return string.Empty;
            }
        }

    }
}