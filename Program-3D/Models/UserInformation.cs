using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace Program_3D.Models
{

    public class UserInformation
    {
        [BsonId]
        [Required(ErrorMessage = "用户名不能为空")]
        [Remote("CheckAccount", "Registered",HttpMethod ="Get",ErrorMessage = "用户名已经存在")]
        public string UserName{ get;set; }

        [Required(ErrorMessage = "密码不能为空")]
        public string Password { get; set; }

        [Required(ErrorMessage = "确认密码不能为空")]
        [System.ComponentModel.DataAnnotations.Compare("Password", ErrorMessage = "两次密码不一致,请重新输入")]
        public string rePassword { get; set; }
    }
    public class LoginInformation
    {
        [BsonId]
        [Required(ErrorMessage = "用户名不能为空")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "密码不能为空")]
        public string Password { get; set; }


    }

}