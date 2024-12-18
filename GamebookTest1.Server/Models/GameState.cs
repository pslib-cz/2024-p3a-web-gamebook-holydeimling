using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class GameState
    {
        [Key]
        public int GameStateId { get; set; }

        public Inventory InventoryState { get; set; } = new Inventory { };

        [Required]
        public ICollection<Quest> QuestsState { get; set; } = new List<Quest>();

        [Required]
        public int CheckpointSceneId { get; set; }
    }
}
