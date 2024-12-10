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
        public DbSet<Dialog> Dialogs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<GameState> GameStates { get; set; }
        public DbSet<Quest> Quests { get; set; }

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

            modelBuilder
                .Entity<SceneItem>()
                .HasOne(si => si.Item)
                .WithMany()
                .HasForeignKey(si => si.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Item>()
                .HasOne(i => i.ItemImage)
                .WithOne() // Or WithMany if it's a one-to-many relationship
                .HasForeignKey<Item>(i => i.ItemImageId);

            modelBuilder
                .Entity<GameState>()
                .HasOne(gs => gs.User)
                .WithMany()
                .HasForeignKey(gs => gs.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
