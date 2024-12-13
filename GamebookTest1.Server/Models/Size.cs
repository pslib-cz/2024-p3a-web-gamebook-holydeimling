using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Models
{
    public class Size
    {
        [Key]
        public int SizeId { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }
    }
}
