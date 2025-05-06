namespace LEARNING.Server.Models
{
    public class User
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string role { get; set; } = "user";
        public string? designation { get; set; }
      
    }
}
