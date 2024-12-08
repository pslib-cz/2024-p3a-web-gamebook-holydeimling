using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamebookTest1.Server.Models
{
    public class SceneItem
    {
        [Key]
        public int SceneItemId { get; set; } // Primary key

        public int SceneId { get; set; }
        public Scene Scene { get; set; } // Navigation property to Scene

        public int ItemId { get; set; }
        public Item Item { get; set; } // Navigation property to Item

        [Required]
        public string Position { get; set; } // Position in the scene (e.g., coordinates)

        [Required]
        public string Size { get; set; } // Size (e.g., scale or dimensions)
    }
}
