using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace GamebookTest1.Server.Models
{
    public class Scene
    {
        public required int SceneId { get; set; }
        public string? SceneName { get; set; }
        public required string? BackGroundImage { get; set; }

        [NotMapped]
        public List<SceneCharacters>? Characters { get; set; } = new List<SceneCharacters>();

        [NotMapped]
        public List<SceneItems>? Items { get; set; } = new List<SceneItems>();
    }

    [NotMapped]
    public class CharacterPosition
    {
        [NotMapped]
        public required int X { get; set; }

        [NotMapped]
        public required int Y { get; set; }
    }

    public class CharacterSize
    {
        [NotMapped]
        public required int Width { get; set; }

        [NotMapped]
        public required int Height { get; set; }
    }

    [NotMapped]
    public class SceneCharacters
    {
        [NotMapped]
        public required CharacterPosition CharacterPosition { get; set; }

        [NotMapped]
        public required CharacterSize CharacterSize { get; set; }

        [NotMapped]
        public required Character Character { get; set; }
    }

    [NotMapped]
    public class ItemPosition
    {
        [NotMapped]
        public required int X { get; set; }

        [NotMapped]
        public required int Y { get; set; }
    }

    [NotMapped]
    public class ItemSize
    {
        [NotMapped]
        public required int Width { get; set; }

        [NotMapped]
        public required int Height { get; set; }
    }

    [NotMapped]
    public class SceneItems
    {
        [NotMapped]
        public required ItemPosition ItemPosition { get; set; }

        [NotMapped]
        public required ItemSize ItemSize { get; set; }

        [NotMapped]
        public required Item Item { get; set; }
    }
}
