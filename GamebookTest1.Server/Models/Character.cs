using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace GamebookTest1.Server.Models
{
    public class Character
    {
        [Key]
        public int CharacterId { get; set; }

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        public string? Nickname { get; set; }
        public string? BackStory { get; set; }

        // Navigation property for images
        public ICollection<Image> CharacterImages { get; set; } = new List<Image>();
    }
}
