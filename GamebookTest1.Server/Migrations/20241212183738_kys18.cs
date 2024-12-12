using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class kys18 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Characters_CharacterId1",
                table: "Images");

            migrationBuilder.DropForeignKey(
                name: "FK_Images_Items_ItemId1",
                table: "Images");

            migrationBuilder.DropForeignKey(
                name: "FK_Images_Scenes_SceneId",
                table: "Images");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_Images_SceneId",
                table: "Scenes");

            migrationBuilder.DropIndex(
                name: "IX_Images_CharacterId1",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_ItemId1",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_SceneId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "CharacterId1",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "ItemId1",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "SceneId",
                table: "Images");

            migrationBuilder.AlterColumn<int>(
                name: "SceneId",
                table: "Scenes",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "BackgroundImageImageId",
                table: "Scenes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Scenes_BackgroundImageImageId",
                table: "Scenes",
                column: "BackgroundImageImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_Images_BackgroundImageImageId",
                table: "Scenes",
                column: "BackgroundImageImageId",
                principalTable: "Images",
                principalColumn: "ImageId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_Images_BackgroundImageImageId",
                table: "Scenes");

            migrationBuilder.DropIndex(
                name: "IX_Scenes_BackgroundImageImageId",
                table: "Scenes");

            migrationBuilder.DropColumn(
                name: "BackgroundImageImageId",
                table: "Scenes");

            migrationBuilder.AlterColumn<int>(
                name: "SceneId",
                table: "Scenes",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "CharacterId1",
                table: "Images",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ItemId1",
                table: "Images",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SceneId",
                table: "Images",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_CharacterId1",
                table: "Images",
                column: "CharacterId1");

            migrationBuilder.CreateIndex(
                name: "IX_Images_ItemId1",
                table: "Images",
                column: "ItemId1");

            migrationBuilder.CreateIndex(
                name: "IX_Images_SceneId",
                table: "Images",
                column: "SceneId");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Characters_CharacterId1",
                table: "Images",
                column: "CharacterId1",
                principalTable: "Characters",
                principalColumn: "CharacterId");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Items_ItemId1",
                table: "Images",
                column: "ItemId1",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Scenes_SceneId",
                table: "Images",
                column: "SceneId",
                principalTable: "Scenes",
                principalColumn: "SceneId");

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_Images_SceneId",
                table: "Scenes",
                column: "SceneId",
                principalTable: "Images",
                principalColumn: "ImageId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
