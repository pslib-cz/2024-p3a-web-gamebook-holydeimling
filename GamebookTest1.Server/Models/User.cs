using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public required string Username { get; set; }
        public required string UserEmail { get; set; }
        public required string Password { get; set; }
    }
}
