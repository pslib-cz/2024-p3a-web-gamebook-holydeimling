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
        public DbSet<Image> Images { get; set; }
        public DbSet<Dialog> Dialogs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<GameState> GameStates { get; set; }
        public DbSet<Quest> Quests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // One-to-One relationship between Item and Image
            modelBuilder
                .Entity<Item>()
                .HasMany(i => i.ItemImages)
                .WithOne()
                .HasForeignKey(i => i.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Character>()
                .HasMany(c => c.CharacterImages)
                .WithOne()
                .HasForeignKey(i => i.CharacterId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
