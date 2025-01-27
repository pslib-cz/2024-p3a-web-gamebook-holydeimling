using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class upravenQuest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "Quests");

            migrationBuilder.DropColumn(
                name: "IsStoryQuest",
                table: "Quests");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Quests",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsStoryQuest",
                table: "Quests",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }
    }
}
