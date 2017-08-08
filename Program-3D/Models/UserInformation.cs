using MongoDB.Bson.Serialization.Attributes;

namespace Program_3D.Models
{
    public class UserInformation
    {
        [BsonId]
        public string accountNumber { get; set; }
        public string passWord { get; set; }
    }
}