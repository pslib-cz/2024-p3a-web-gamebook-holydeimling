using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace GamebookTest1.Server.Models
{
    public class Scene
    {
        [Key]
        public int SceneId { get; set; }

        [Required]
        // One-to-One relationship with Image
        public required Image BackgroundImage { get; set; }

        [Required]
        public required string SceneName { get; set; }

        [Required]
        public required ICollection<SceneCharacter> SceneCharacters { get; set; }

        [Required]
        public required ICollection<SceneItem> SceneItems { get; set; }

        [Required]
        public required ICollection<Dialog> SceneDialogs { get; set; }

        [Required]
        public bool IsCheckpoint { get; set; } = false;
        public bool GameOver { get; set; } = false;
        public int? MinigameId { get; set; }
        public int? QuestToAddId { get; set; }
        public int? QuestToRemoveId { get; set; }
    }
}
