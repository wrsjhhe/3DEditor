using System.Web.Mvc;
using Program_3D.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.IO;

namespace Program_3D.Controllers
{
    public class WorkController : Controller
    {
        // GET: Home
        protected static IMongoClient _client;

        protected static IMongoDatabase _database;

        private const string conn = "mongodb://127.0.0.1:27017";

        private const string dbName = "Program-3D";

        protected static string tbName;

     //   private const string tbName = "ObjectsPara";

        // GET: MongoDB
        public ActionResult Work(string accountNumber)
        {
            tbName = accountNumber;
            InitDataBase();
            _database.CreateCollection(tbName);
            return View();
        }


        public void ReceiveData(ObjectPara model)
        {
            var collection = _database.GetCollection<ObjectPara>(tbName);
            collection.InsertOne(model);

        }

        public void UpdateData(ObjectPara model)
        {
            var collection = _database.GetCollection<BsonDocument>(tbName);
            var filter = Builders<BsonDocument>.Filter.Eq("_id", "123");
            var update = Builders<BsonDocument>.Update.Set("Attr", model.Attr).CurrentDate("lastModified");
            var result = collection.UpdateOne(filter, update);
        }

        public string SearchData()
        {
            var collection = _database.GetCollection<BsonDocument>(tbName);
            var filter = Builders<BsonDocument>.Filter.Eq("_id","123");
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

        static private void InitDataBase()
        {

            _client = new MongoClient(conn);
            _database = _client.GetDatabase(dbName);      
        }

        

    }


}