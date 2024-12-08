using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public required string UserName { get; set; }
        public required string UserEmail { get; set; }
        public required string UserPassword { get; set; }
    }
}
