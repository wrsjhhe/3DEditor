using System.Collections.Generic;
using MongoDB.Bson;
using System;
using Newtonsoft.Json;
using System.Web.Script.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization;
using System.Linq;

namespace Program_3D.Models
{

   
    public class ObjectPara
    {

        public string UserId { get; set; }

        [BsonIgnore]
        [NonSerialized]
        private List<string> attr = new List<string>();
      //  private string attr = string.Empty;
        public object Attr
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
               
                attr =Func.GetArrsTostring(value);
            }
        }

    }

   
    
}