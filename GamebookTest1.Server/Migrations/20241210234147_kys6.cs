using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class kys6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SceneId1",
                table: "SceneCharacters",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SceneCharacters_SceneId1",
                table: "SceneCharacters",
                column: "SceneId1");

            migrationBuilder.AddForeignKey(
                name: "FK_SceneCharacters_Scenes_SceneId1",
                table: "SceneCharacters",
                column: "SceneId1",
                principalTable: "Scenes",
                principalColumn: "SceneId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SceneCharacters_Scenes_SceneId1",
                table: "SceneCharacters");

            migrationBuilder.DropIndex(
                name: "IX_SceneCharacters_SceneId1",
                table: "SceneCharacters");

            migrationBuilder.DropColumn(
                name: "SceneId1",
                table: "SceneCharacters");
        }
    }
}
