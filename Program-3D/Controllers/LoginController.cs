using System.Web.Mvc;
using Program_3D.Models;
using MongoDB.Driver;

namespace Program_3D.Controllers
{
    public class LoginController : Controller
    {
        protected static IMongoClient _cliet;

        protected static IMongoDatabase _database;

        private const string conn = "mongodb://127.0.0.1:27017";

        private const string dbName = "Program-3D";

        private const string tbName = "UserInformation";
        // GET: Login
        public ActionResult Login()
        {
            InitDataBase();
            return View();
        }
         
        public string SearchData(UserInformation model)
        {
            var collection = _database.GetCollection<UserInformation>(tbName);
            var filter = Builders<UserInformation>.Filter.Eq("_id", model.accountNumber);
            var result = collection.Find(filter).ToList();
            if ((result.Count == 0)||(result[0].passWord != model.passWord))
            {
                return "0";
            }
            else
            {
                // return RedirectToRoute("Work", new { controller = "Work", action = "Work", accountNumber = model.accountNumber }); 
                return "1";
            }

        }
        public ActionResult ToWorkSpace(UserInformation model)
        {
            //return RedirectToAction("/Work/WorkSpace", new { accountNumber = model.accountNumber });
            return RedirectToRoute( new { controller = "Work", action = "WorkSpace", accountNumber = model.accountNumber });
        }

        private void InitDataBase()
        {
            _cliet = new MongoClient(conn);
            _database = _cliet.GetDatabase(dbName);

        }
    }
}