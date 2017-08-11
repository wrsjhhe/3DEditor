using System.Web.Mvc;
using System.Web.Routing;

namespace Program_3D
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Login", action = "Login", id = UrlParameter.Optional }
            );

            routes.MapRoute(
             name: "WorkSpace",
             url: "{action}",
             defaults: new { controller = "Work", action = "WorkSpace", accountNumber = UrlParameter.Optional }
         );

        }
    }
}
