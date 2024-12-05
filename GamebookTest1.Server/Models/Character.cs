using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Models
{
    public class Character
    {
        public required int CharacterId { get; set; }
        public required string CharacterFirstname { get; set; }
        public required string CharacterSecondname { get; set; }
        public string? CharacterNickname { get; set; }
        public required List<string> Images { get; set; }
    }
}
