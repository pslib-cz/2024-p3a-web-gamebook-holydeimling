using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;

namespace GamebookTest1.Server.Models
{
    public class SceneCharacter
    {
        [Key]
        public int SceneCharacterId { get; set; } // Primary key

        public int SceneId { get; set; }
        public Scene Scene { get; set; } // Navigation property to Scene

        [ForeignKey("Character")] // Mark CharacterId as foreign key
        public int CharacterId { get; set; }
        public Character Character { get; set; } // Navigation property to Character

        [Required]
        public string Position { get; set; } // Position in the scene (e.g., coordinates)

        [Required]
        public string Size { get; set; } // Size (e.g., scale or dimensions)
    }
}
