using System.Web.Mvc;
using Program_3D.Models;
using MongoDB.Driver;

namespace Program_3D.Controllers
{
    public class RegisteredController : Controller
    {
        protected static IMongoClient _cliet;

        protected static IMongoDatabase _database;

        private const string conn = "mongodb://127.0.0.1:27017";

        private const string dbName = "Program-3D";

        private const string tbName = "UserInformation";
        // GET: Registered
        public ActionResult Registered()
        {
            InitDataBase();
            return View();
        }

        public ActionResult ReceiveInformation(UserInformation model)
        {
            var collection = _database.GetCollection<UserInformation>(tbName);
            collection.InsertOne(model);
            return RedirectToAction("../Login/Login");

        }

        private void InitDataBase()
        {
            _cliet = new MongoClient(conn);
            _database = _cliet.GetDatabase(dbName);
        }
    }
}