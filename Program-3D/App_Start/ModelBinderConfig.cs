
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Program_3D
{
    using Newtonsoft.Json;
    using Models;
    public class ModelBinderConfig
    {
        public static void RegisterModelBinder(ModelBinderDictionary binders)
        {
            ///Dynamic Model Binder
            binders.Add(GetBinder<JObject>());
            ///FormData Model Binder
            binders.Add(GetBinder<Terence>());
        }

        private static KeyValuePair<Type, IModelBinder> GetBinder<T>()
        {
            return new KeyValuePair<Type, IModelBinder>(typeof(T), new DynamicModelBinder<T>());
        }
    }

    public class DynamicModelBinder<T> : IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {

            var stream = controllerContext.HttpContext.Request.InputStream;
            stream.Seek(0, SeekOrigin.Begin);
            string json = new StreamReader(stream).ReadToEnd();
            var arr = new List<object>();

            var item = new Terence() { item = new { a = "a" } };
            var itemStr = JsonConvert.SerializeObject(item);

            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}