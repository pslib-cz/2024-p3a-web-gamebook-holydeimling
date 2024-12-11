using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class kys7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SceneId1",
                table: "SceneItems",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SceneItems_SceneId1",
                table: "SceneItems",
                column: "SceneId1");

            migrationBuilder.AddForeignKey(
                name: "FK_SceneItems_Scenes_SceneId1",
                table: "SceneItems",
                column: "SceneId1",
                principalTable: "Scenes",
                principalColumn: "SceneId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SceneItems_Scenes_SceneId1",
                table: "SceneItems");

            migrationBuilder.DropIndex(
                name: "IX_SceneItems_SceneId1",
                table: "SceneItems");

            migrationBuilder.DropColumn(
                name: "SceneId1",
                table: "SceneItems");
        }
    }
}
