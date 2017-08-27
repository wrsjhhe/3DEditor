using System.Web.Mvc;
using Program_3D.Models;
using MongoDB.Driver;
using MongoDB.Bson;

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
            var BsonModel = new BsonDocument
            {   
                { "_id",model.UserName},
                { "Password",model.Password}
            };
            if (ModelState.IsValid)
            {
                var collection = _database.GetCollection<BsonDocument>(tbName);
                collection.InsertOne(BsonModel);
                return RedirectToRoute(new { controller = "Login", action = "Login" });
            }
            else {
                return View("Registered");
            }     
        }

        [HttpGet]
<<<<<<< HEAD
        public ActionResult CheckAccount([Bind(Prefix = "UserName")]string userName)
        {
            var collection = _database.GetCollection<UserInformation>(tbName);
            var filter = Builders<UserInformation>.Filter.Eq("_id", userName);
=======
        public ActionResult CheckAccount([Bind(Prefix = "UserName")]string UserName)
        {
            var collection = _database.GetCollection<UserInformation>(tbName);
            var filter = Builders<UserInformation>.Filter.Eq("_id", UserName);
>>>>>>> 0054246fd55b344d34ccd80ba27ff70cf699c14b
            var result = collection.Find(filter).ToList();
            if ((result.Count == 0))
            {
                bool ok = true;
                return Json(ok, JsonRequestBehavior.AllowGet);
            }
            else
            {
                bool no = false;
                return Json(no, JsonRequestBehavior.AllowGet);
            }
        }

        private void InitDataBase()
        {
            _cliet = new MongoClient(conn);
            _database = _cliet.GetDatabase(dbName);
        }
    }
}
