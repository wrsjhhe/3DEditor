using System.Web.Mvc;
using Program_3D.Models;
using MongoDB.Driver;

namespace Program_3D.Controllers
{
    using MongoDB.Bson;
    using Newtonsoft.Json;
    using System;
    using System.Web.Script.Serialization;

    using MongoDB.Bson.Serialization.Attributes;
    using Newtonsoft.Json.Converters;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;
    using System.Dynamic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.ComponentModel.DataAnnotations;

    public class HomeController : Controller
    {
        // GET: Home
        protected static IMongoClient _cliet;

        protected static IMongoDatabase _database;

        private const string conn = "mongodb://127.0.0.1:27017";

        private const string dbName = "Program-3D";

        private const string tbName = "ObjectsPara";
        // GET: MongoDB
        public ActionResult Index()
        {
            initDataBase();
            return View();
        }


        public string ReceiveJson(ObjectA model)
        {
           _database.GetCollection<ObjectA>("ObjectA").InsertOne(model);
            return "";

        }

        private void initDataBase()
        {
            _cliet = new MongoClient(conn);
            _database = _cliet.GetDatabase(dbName);

            ObjectParas objP = new ObjectParas();
            objP.Name = "test";
            _database.GetCollection<ObjectParas>(tbName).InsertOne(objP);

        }

    }


}