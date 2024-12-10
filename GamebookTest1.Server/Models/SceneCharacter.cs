using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamebookTest1.Server.Models
{
    public class SceneCharacter
    {
        [Key]
        public int SceneCharacterId { get; set; } // Primary key

        [Required]
        public int SceneId { get; set; }
        public Scene Scene { get; set; } = null!; // Navigation property to Scene

        [Required]
        public int CharacterId { get; set; }
        public Character Character { get; set; } = null!; // Navigation property to Character

        [Required]
        public string Position { get; set; } = string.Empty; // Position in the scene (e.g., coordinates)

        [Required]
        public string Size { get; set; } = string.Empty; // Size (e.g., scale or dimensions)
    }
}
