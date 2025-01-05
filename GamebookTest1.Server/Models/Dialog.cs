using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamebookTest1.Server.Models
{
    public class Dialog
    {
        [Key]
        public int DialogId { get; set; }

        public Character? Character { get; set; }

        [Required]
        public required string Text { get; set; }

        public ICollection<DialogAnswer>? DialogAnswers { get; set; } = null!;
    }
}
