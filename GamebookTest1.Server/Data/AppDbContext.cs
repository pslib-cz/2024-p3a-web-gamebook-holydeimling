using System.Collections.Generic;
using GamebookTest1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Scene> Scenes { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
                .Entity<Item>()
                .HasData(
                    new Item
                    {
                        ItemId = 1,
                        ItemImage = "image1",
                        ItemName = "Item1",
                        ItemDescription = "Description1",
                    }
                );

            modelBuilder
                .Entity<Character>()
                .HasData(
                    new Character
                    {
                        CharacterId = 1,
                        CharacterFirstname = "John",
                        CharacterSecondname = "Doe",
                        CharacterNickname = "JD",
                        Images = new List<string> { "image1", "image2" },
                    }
                );

            modelBuilder
                .Entity<Scene>()
                .HasData(
                    new Scene
                    {
                        SceneId = 1,
                        SceneName = "Scene1",
                        BackGroundImage = "image1",
                        Characters = new List<SceneCharacters>
                        {
                            new SceneCharacters
                            {
                                CharacterPosition = new CharacterPosition { X = 1, Y = 1 },
                                CharacterSize = new CharacterSize { Width = 1, Height = 1 },
                                Character = new Character
                                {
                                    CharacterId = 1,
                                    CharacterFirstname = "John",
                                    CharacterSecondname = "Doe",
                                    CharacterNickname = "JD",
                                    Images = new List<string> { "image1", "image2" },
                                },
                            },
                        },
                        Items = new List<SceneItems>
                        {
                            new SceneItems
                            {
                                ItemPosition = new ItemPosition { X = 1, Y = 1 },
                                ItemSize = new ItemSize { Width = 1, Height = 1 },
                                Item = new Item
                                {
                                    ItemId = 1,
                                    ItemImage = "image1",
                                    ItemName = "Item1",
                                    ItemDescription = "Description1",
                                },
                            },
                        },
                    }
                );

            // Mark CharacterPosition, CharacterSize, ItemPosition, and ItemSize as keyless entities
            modelBuilder.Entity<CharacterPosition>().HasNoKey();
            modelBuilder.Entity<CharacterSize>().HasNoKey();
            modelBuilder.Entity<ItemPosition>().HasNoKey();
            modelBuilder.Entity<ItemSize>().HasNoKey();
        }
    }
}
