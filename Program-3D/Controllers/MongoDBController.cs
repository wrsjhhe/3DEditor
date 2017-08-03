using System.Web.Mvc;
using MongoDB.Driver;
using Program_3D.Models;

namespace Program_3D.Controllers
{
    public class MongoDBController : Controller
    {
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

        public ContentResult ReceiveJson(ObjectA model)
        {
          
            return this.Content("sdsd");
           
     }

        public JsonResult SendJson()
        {
            var obj = Request["obj"];
            return Json(obj);
        }

        private static void initDataBase()
        {
           

         
        }
     
    }
}