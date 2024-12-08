using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class Image
    {
        [Key]
        public int ImageId { get; set; } // Primary key

        [Required]
        public byte[] ImageData { get; set; } // Binary data for the image

        [Required]
        public string MimeType { get; set; } // e.g., "image/png"

        public string? Description { get; set; } // Optional description for the image

        // Foreign Keys
        public int? CharacterId { get; set; }
        public Character? Character { get; set; }

        public int? ItemId { get; set; }
        public Item? Item { get; set; }

        public int? SceneId { get; set; }
        public Scene? Scene { get; set; }
    }
}
