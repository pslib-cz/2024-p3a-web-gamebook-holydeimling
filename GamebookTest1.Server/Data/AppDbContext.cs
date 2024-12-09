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
        public DbSet<SceneCharacter> SceneCharacters { get; set; }
        public DbSet<SceneItem> SceneItems { get; set; }
        public DbSet<Image> Images { get; set; } // Add DbSet for Images
        public DbSet<User> Users { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // One-to-many relationship between Scene and SceneCharacter
            modelBuilder
                .Entity<SceneCharacter>()
                .HasOne(sc => sc.Scene)
                .WithMany(s => s.SceneCharacters)
                .HasForeignKey(sc => sc.SceneId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder
                .Entity<SceneCharacter>()
                .HasOne(sc => sc.Character)
                .WithMany()
                .HasForeignKey(sc => sc.CharacterId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-many relationship between Scene and SceneItem
            modelBuilder
                .Entity<SceneItem>()
                .HasOne(si => si.Scene)
                .WithMany(s => s.SceneItems)
                .HasForeignKey(si => si.SceneId)
                .OnDelete(DeleteBehavior.Cascade);
            // One-to-many relationship between scene and scene item
            modelBuilder
                .Entity<SceneItem>()
                .HasOne(si => si.Item)
                .WithMany()
                .HasForeignKey(si => si.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            // One-to-One relationship between Item and ItemImage
            modelBuilder
                .Entity<Item>()
                .HasOne(i => i.ItemImage) // Item has one ItemImage
                .WithOne() // ItemImage is associated with one Item
                .HasForeignKey<Item>(i => i.ItemImageId) // Foreign key in Item
                .OnDelete(DeleteBehavior.Cascade); // Optionally, use Cascade delete if desired

            // One-to-One relationship between Image and Item (reverse side)
            modelBuilder
                .Entity<Image>()
                .HasOne(i => i.Item) // Image references Item
                .WithOne(i => i.ItemImage) // One Item has one ItemImage
                .HasForeignKey<Image>(i => i.ItemId); // Foreign key in Image

            modelBuilder
                .Entity<GameState>()
                .HasOne(gs => gs.User)
                .WithMany()
                .HasForeignKey(gs => gs.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Image>().HasData();

            modelBuilder.Entity<Scene>().HasData();
            modelBuilder.Entity<SceneCharacter>().HasData();
            modelBuilder
                .Entity<Character>()
                .HasData(
                    new Character
                    {
                        CharacterId = 1,
                        FirstName = "Alice",
                        LastName = "Adventurer",
                        Nickname = "Idk",
                        BackStory = "Alice is a brave adventurer who loves to explore the world.",
                    }
                );

            modelBuilder.Entity<SceneItem>().HasData();
            modelBuilder.Entity<Item>().HasData();

            modelBuilder.Entity<Dialog>().HasData();

            modelBuilder.Entity<User>().HasData();

            modelBuilder.Entity<Inventory>().HasData();
            modelBuilder.Entity<GameState>().HasData();
            modelBuilder.Entity<Quest>().HasData();
        }
    }
}
