using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string UserName { get; set; } = null!;

        [Required]
        public string UserEmail { get; set; } = null!;

        [Required]
        public string UserPassword { get; set; } = null!;

        [Required]
        public string UserRole { get; set; } = "player"; // Default to player

        // Navigation property for player role
        public GameState? GameState { get; set; }
    }
}
