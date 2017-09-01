using System.Collections.Generic;
using MongoDB.Bson;
using System;
using MongoDB.Bson.Serialization.Attributes;
using System.Linq;
using Newtonsoft.Json.Linq;


namespace Program_3D.Models
{

    [BsonIgnoreExtraElements]
    public class ObjectPara
    {
        [BsonId]
        public string UserId { get; set; }

        [BsonIgnore]
        [NonSerialized]
        //private List<object> attr = new List<object>();
        //public List<object> Parameter
        //{
        //    get
        //    {
        //        if (attr.Count() != 0)
        //        {
        //            List<object> ar = new List<object>();
        //            for (int i = 0; i < attr.Count(); i++)
        //            {
        //                ar.Add(BsonDocument.Parse(attr[i].ToString()));
        //            }
        //            return ar;
        //        }
        //        else
        //        {
        //            return null;
        //        }
        //    }
        //        set
        //    {
        //        attr = value;
        //    }
        //}
        private List<string> attr = new List<string>();
        public object Parameter
        {

            get
            {
                if (attr.Count() != 0)
                {
                    BsonArray ar = new BsonArray();
                    for (int i = 0; i < attr.Count(); i++)
                    {
                        ar.Add(BsonDocument.Parse(attr[i]));
                    }

                    return ar;
                }
                else
                {
                    return null;
                }
            }
            set
            {
                attr = StringHandle.GetArrsToString(value);
            }
        }



    }



}