using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class Image
    {
        [Key]
        public int ImageId { get; set; } // Primary key

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string FilePath { get; set; } = string.Empty;
    }
}
