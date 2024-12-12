using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamebookTest1.Server.Models
{
    public class Inventory
    {
        [Key]
        public int InventoryId { get; set; }

        // Directly save references to Item objects (no IDs exposed)
        public Item? Item1 { get; set; }
        public Item? Item2 { get; set; }
        public Item? Item3 { get; set; }
        public Item? Item4 { get; set; }
        public Item? Item5 { get; set; }
        public Item? Item6 { get; set; }
        public Item? Item7 { get; set; }
        public Item? Item8 { get; set; }
        public Item? Item9 { get; set; }
    }
}
