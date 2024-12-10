using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class Image
    {
        [Key]
        public int ImageId { get; set; } // Primary key

        [Required]
        public string FilePath { get; set; } = string.Empty;

        // Foreign Keys
        public int? CharacterId { get; set; }
        public Character? Character { get; set; }

        public int? ItemId { get; set; } // Optional for reverse navigation
        public Item? Item { get; set; }

        public int? SceneId { get; set; }
        public Scene? Scene { get; set; }
    }
}
