using System.Web.Mvc;
using System.Web.Routing;

namespace Program_3D
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            //ModelBinderConfig.RegisterModelBinder(ModelBinders.Binders);
        }
    }
}
