using System.Collections.Generic;
using MongoDB.Bson;
using System;
using Newtonsoft.Json;
using System.Web.Script.Serialization;
using MongoDB.Bson.Serialization.Attributes;

namespace Program_3D.Models
{
    public class ObjectParas
    {
        public long KeyId { get; set; }
        public string Name { get; set; }
        public string Uuid { get; set; }
        public string Type { get; set; }
        public string Text { get; set; }
        public string Position { get; set; }
        public string Scale { get; set; }
        public string Rotation { get; set; }
    }

   
    public class ObjectA
    {
       
   

        [BsonIgnore]
        [NonSerialized]
        private string attr = string.Empty;
        public object Attr
        {
            get
            {
                if (!string.IsNullOrEmpty(attr))
                {
                    var ss = BsonDocument.Parse(attr);
                    return ss;
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

    public class NormalStruct : ObjectParas
    {
        public struct Material
        {
            long KeyId { get; set; }
            string material { get; set; }
            string textureSrc { get; set; }

        }

        public string obj { get; set; }
    }


    [Serializable]
    public class Terence
    {
        [ScriptIgnore]
        [BsonIgnore]
        public dynamic item;       
    }

   
    
}