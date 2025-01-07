using System.ComponentModel.DataAnnotations;
using System.Security.Policy;

namespace GamebookTest1.Server.Models
{
    public class DialogAnswer
    {
        [Key]
        public int DialogAnswerId { get; set; }
        public string? AnswerText { get; set; }

        public int? NextSceneId { get; set; }
    }
}
