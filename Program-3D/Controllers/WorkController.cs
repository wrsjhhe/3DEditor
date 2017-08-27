using System.Web.Mvc;
using Program_3D.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using System;
using Newtonsoft.Json.Linq;
using System.Web.Script.Serialization;
using System.Collections.Generic;

namespace Program_3D.Controllers
{
    public class WorkController : Controller
    {
        // GET: Home
        protected static IMongoClient _client;

        protected static IMongoDatabase _database;

        private const string conn = "mongodb://127.0.0.1:27017";

        private const string dbName = "Program-3D";

        protected static string tbName = "ObjectPara";

        protected static string account;

        // GET: MongoDB
        public ActionResult WorkSpace(string userName)
        {
            account = userName;
            InitDataBase();
            Modify();
            return View();
        }


        public void ReceiveData(ObjectPara model)
        {
            model.UserId = account;           
            try
            {
                var collection = _database.GetCollection<ObjectPara>(tbName);
                collection.InsertOne(model);
            }
            catch (Exception)
            { 
                var collection = _database.GetCollection<BsonDocument>(tbName);
                var filter = Builders<BsonDocument>.Filter.Eq("_id", account);
                var update = Builders<BsonDocument>.Update.Set("Parameter", model.Parameter).CurrentDate("lastModified");
                var result = collection.UpdateOne(filter, update);

            }

        }
        /// <summary>
        /// 找到数据并返回
        /// </summary>
        /// <returns></returns>
        public string SearchData()                         
        {
            var collection = _database.GetCollection<BsonDocument>(tbName);
            var filter = Builders<BsonDocument>.Filter.Eq("_id", account);
            var result = collection.Find(filter).ToList();
            if (result.Count != 0)
            {
                var jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
                return result[0].ToJson(jsonWriterSettings);               
            }
            else
            {
                return "error";
            }
            
        }
        public void Modify()
        {
            var jsonWriterSettings = new JsonWriterSettings { OutputMode = JsonOutputMode.Strict };
            var collection = _database.GetCollection<BsonDocument>(tbName);
            var filter = Builders<BsonDocument>.Filter.Eq("_id", "test");
            var result = collection.Find(filter).ToList();
            JObject ja = JObject.Parse(result[0].ToJson(jsonWriterSettings));
            //   JArray ja =JArray.Parse(result.ToJson(jsonWriterSettings));
           
               var vertices = ja["Parameter"]["_v"][0]["geometry"]["vertices"];
            List<Product> products = new List<Product>();
            products = JSONStringToList<Product>(vertices.ToString());

            if (result.Count != 0)
            {            
                System.Diagnostics.Debug.WriteLine(result[0]); 
            }
        }
        public List<T> JSONStringToList<T>(string JsonStr)
        {
            JavaScriptSerializer Serializer = new JavaScriptSerializer();
            List<T> objs = Serializer.Deserialize<List<T>>(JsonStr);
            return objs;
        }
         class Product
        { 
           public double x { get; set; }
           public double y { get; set; }
           public double z { get; set; }
        }

         private void InitDataBase()
        {
            _client = new MongoClient(conn);
            _database = _client.GetDatabase(dbName);
        }

        

    }


}