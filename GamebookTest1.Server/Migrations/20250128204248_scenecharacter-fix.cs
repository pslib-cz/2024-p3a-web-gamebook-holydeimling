using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class scenecharacterfix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SceneCharacters_Scenes_SceneId",
                table: "SceneCharacters");

            migrationBuilder.DropIndex(
                name: "IX_SceneCharacters_SceneId",
                table: "SceneCharacters");

            migrationBuilder.DropColumn(
                name: "SceneId",
                table: "SceneCharacters");

            migrationBuilder.CreateTable(
                name: "SceneToSceneCharacter",
                columns: table => new
                {
                    SceneCharactersSceneCharacterId = table.Column<int>(type: "INTEGER", nullable: false),
                    SceneId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SceneToSceneCharacter", x => new { x.SceneCharactersSceneCharacterId, x.SceneId });
                    table.ForeignKey(
                        name: "FK_SceneToSceneCharacter_SceneCharacters_SceneCharactersSceneCharacterId",
                        column: x => x.SceneCharactersSceneCharacterId,
                        principalTable: "SceneCharacters",
                        principalColumn: "SceneCharacterId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SceneToSceneCharacter_Scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "Scenes",
                        principalColumn: "SceneId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SceneToSceneCharacter_SceneId",
                table: "SceneToSceneCharacter",
                column: "SceneId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SceneToSceneCharacter");

            migrationBuilder.AddColumn<int>(
                name: "SceneId",
                table: "SceneCharacters",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SceneCharacters_SceneId",
                table: "SceneCharacters",
                column: "SceneId");

            migrationBuilder.AddForeignKey(
                name: "FK_SceneCharacters_Scenes_SceneId",
                table: "SceneCharacters",
                column: "SceneId",
                principalTable: "Scenes",
                principalColumn: "SceneId");
        }
    }
}
