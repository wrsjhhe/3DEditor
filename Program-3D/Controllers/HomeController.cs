using System.Web.Mvc;
using Program_3D.Models;
using MongoDB.Driver;

namespace Program_3D.Controllers
{
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


        public string ReceiveJson(ObjectPara model)
        {
           _database.GetCollection<ObjectPara>("ObjectPara").InsertOne(model);
            return "";

        }

        static private void initDataBase()
        {
            _cliet = new MongoClient(conn);
            _database = _cliet.GetDatabase(dbName);      

        }

    }


}