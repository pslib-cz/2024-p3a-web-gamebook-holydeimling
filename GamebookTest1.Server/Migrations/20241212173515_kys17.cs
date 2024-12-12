using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class kys17 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Images_SceneId",
                table: "Images");

            migrationBuilder.AlterColumn<int>(
                name: "SceneId",
                table: "Scenes",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_SceneId",
                table: "Images",
                column: "SceneId");

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_Images_SceneId",
                table: "Scenes",
                column: "SceneId",
                principalTable: "Images",
                principalColumn: "ImageId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_Images_SceneId",
                table: "Scenes");

            migrationBuilder.DropIndex(
                name: "IX_Images_SceneId",
                table: "Images");

            migrationBuilder.AlterColumn<int>(
                name: "SceneId",
                table: "Scenes",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_SceneId",
                table: "Images",
                column: "SceneId",
                unique: true);
        }
    }
}
