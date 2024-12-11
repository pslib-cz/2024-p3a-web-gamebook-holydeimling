using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamebookTest1.Server.Models
{
    public class SceneCharacter
    {
        [Key]
        public int SceneCharacterId { get; set; } // Primary key

        [Required]
        public Scene Scene { get; set; } = null!; // Navigation property to Scene

        [Required]
        public Character Character { get; set; } = null!; // Navigation property to Character

        [Required]
        public Position Position { get; set; } = new Position(); // Position in the scene (e.g., coordinates)

        [Required]
        public Size Size { get; set; } = new Size(); // Size (e.g., scale or dimensions)
    }
}
