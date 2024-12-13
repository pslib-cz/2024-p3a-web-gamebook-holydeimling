using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Models
{
    public class Position
    {
        [Key]
        public int PositionId { get; set; } // Primary Key for Position

        public int X { get; set; } // X Coordinate
        public int Y { get; set; } // Y Coordinate
    }
}
