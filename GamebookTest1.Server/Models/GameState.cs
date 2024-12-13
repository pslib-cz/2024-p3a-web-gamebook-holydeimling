using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class GameState
    {
        [Key]
        public int GameStateId { get; set; }

        [Required]
        public int UserId { get; set; }

        // Navigation property for User
        public User User { get; set; } = null!;

        [Required]
        public int InventoryId { get; set; }
        public Inventory Inventory { get; set; } = null!;

        [Required]
        public ICollection<Quest> Quests { get; set; } = new List<Quest>();
    }
}
