using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamebookTest1.Server.Models
{
    public class Dialog
    {
        [Key]
        public int DialogId { get; set; }

        [Required]
        public Character Character { get; set; } = null!;

        [Required]
        public required string Text { get; set; }
    }
}
