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
         
        public ActionResult SearchData(UserInformation model)
        {
            var collection = _database.GetCollection<UserInformation>(tbName);
            var filter = Builders<UserInformation>.Filter.Eq("_id", model.accountNumber);
            var result = collection.Find(filter).ToList();
            if ((result.Count == 0)||(result[0].passWord != model.passWord))
            {
                return this.Content("<script>alert('用户名或密码错误')</script>");
            }
            else
            {
                // return RedirectToRoute("Work", new { controller = "Work", action = "Work", accountNumber = model.accountNumber });
                return RedirectToAction("../Work/Work",new { accountNumber = model.accountNumber });
            }

        }

        private void InitDataBase()
        {
            _cliet = new MongoClient(conn);
            _database = _cliet.GetDatabase(dbName);

        }
    }
}