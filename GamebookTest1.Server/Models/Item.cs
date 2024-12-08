using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace GamebookTest1.Server.Models
{
    public class Item
    {
        [Key]
        public int ItemId { get; set; }

        [Required]
        public string ItemName { get; set; } = string.Empty;

        public string? ItemDescription { get; set; }

        // One-to-One relationship with ItemImage
        public int? ItemImageId { get; set; } // Foreign Key for ItemImage
        public virtual Image ItemImage { get; set; } // Navigation property for ItemImage
    }
}
