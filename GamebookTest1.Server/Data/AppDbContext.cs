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
        public DbSet<User> Users { get; set; } //users
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<GameState> GameStates { get; set; }
        public DbSet<Quest> Quests { get; set; }
        public DbSet<Position> Positions { get; set; }
        public DbSet<Size> Sizes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SceneCharacter>().HasOne(sc => sc.Position); // A SceneCharacter has one Position
            modelBuilder.Entity<SceneCharacter>().HasOne(sc => sc.Size); // A SceneCharacter has one Size

            modelBuilder.Entity<SceneItem>().HasOne(si => si.Position); // A SceneItem has one Position
            modelBuilder.Entity<SceneItem>().HasOne(si => si.Size); // A SceneItem has one Size

            // One-to-One relationship between Item and Image
            modelBuilder
                .Entity<Item>()
                .HasMany(i => i.ItemImages)
                .WithOne()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Character>()
                .HasMany(c => c.CharacterImages)
                .WithOne()
                .OnDelete(DeleteBehavior.Restrict);

            // Define one-to-many relationship between Character and SceneCharacter
            modelBuilder.Entity<SceneCharacter>().HasOne(sc => sc.Character).WithMany(); // Cascading delete ensures SceneCharacters are removed when Character is deleted
            // Define one-to-many relationship between Item and SceneItem
            modelBuilder.Entity<SceneItem>().HasOne(si => si.Item).WithMany(); // Cascading delete ensures SceneItems are removed when Item is deleted

            modelBuilder.Entity<Dialog>().HasOne(ci => ci.Character).WithMany(); // A Dialog has one Character

            //scene relationships
            modelBuilder.Entity<Scene>().HasOne(s => s.BackgroundImage).WithMany(); // A Scene has many SceneCharacters
            modelBuilder.Entity<Scene>().HasMany(s => s.SceneCharacters).WithOne(); // A Scene has many SceneItems
            modelBuilder.Entity<Scene>().HasMany(s => s.SceneItems).WithOne(); // A Scene has many Dialogs
            modelBuilder.Entity<Scene>().HasMany(s => s.SceneDialogs).WithOne(); // A Scene has many Quests

            // Configure relationships without exposing IDs
            modelBuilder
                .Entity<Inventory>()
                .HasOne(i => i.Item1)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascading deletes if not needed

            modelBuilder
                .Entity<Inventory>()
                .HasOne(i => i.Item2)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Inventory>()
                .HasOne(i => i.Item3)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Inventory>()
                .HasOne(i => i.Item4)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Inventory>()
                .HasOne(i => i.Item5)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Inventory>()
                .HasOne(i => i.Item6)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Inventory>()
                .HasOne(i => i.Item7)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Inventory>()
                .HasOne(i => i.Item8)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder
                .Entity<Inventory>()
                .HasOne(i => i.Item9)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder
                .Entity<User>()
                .HasOne(u => u.GameState)
                .WithMany()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
