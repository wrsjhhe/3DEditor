using Microsoft.Owin;
using Owin;


namespace Program_3D
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
