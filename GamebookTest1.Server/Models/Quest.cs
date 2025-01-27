using System.ComponentModel.DataAnnotations;

namespace GamebookTest1.Server.Models
{
    public class Quest
    {
        [Key]
        public int QuestId { get; set; }

        [Required]
        public required string QuestHeading { get; set; }

        [Required]
        public required string QuestContent { get; set; }
    }
}
