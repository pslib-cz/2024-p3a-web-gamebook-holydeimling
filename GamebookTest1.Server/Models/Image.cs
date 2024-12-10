using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class Image
    {
        [Key]
        public int ImageId { get; set; } // Primary key

        [Required]
        public required string FilePath { get; set; }

        // Foreign Keys
        public int? CharacterId { get; set; }
        public Character? Character { get; set; }

        public int? ItemId { get; set; }
        public Item? Item { get; set; }

        public int? SceneId { get; set; }
        public Scene? Scene { get; set; }
    }
}
