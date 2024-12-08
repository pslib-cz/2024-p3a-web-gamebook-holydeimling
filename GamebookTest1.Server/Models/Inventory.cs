using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class Inventory
    {
        [Key]
        public int InventoryId { get; set; }

        [Required]
        public int CharacterId { get; set; }
        public Character Character { get; set; } = null!;

        [Required]
        public ICollection<Item> Items { get; set; } = new List<Item>();
    }
}
