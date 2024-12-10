using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class kys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_Images_ItemImageId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_ItemImageId",
                table: "Items");

            migrationBuilder.AddColumn<int>(
                name: "ItemId1",
                table: "Images",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_ItemId",
                table: "Images",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Images_ItemId1",
                table: "Images",
                column: "ItemId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Items_ItemId",
                table: "Images",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Items_ItemId1",
                table: "Images",
                column: "ItemId1",
                principalTable: "Items",
                principalColumn: "ItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Items_ItemId",
                table: "Images");

            migrationBuilder.DropForeignKey(
                name: "FK_Images_Items_ItemId1",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_ItemId",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_ItemId1",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "ItemId1",
                table: "Images");

            migrationBuilder.CreateIndex(
                name: "IX_Items_ItemImageId",
                table: "Items",
                column: "ItemImageId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Images_ItemImageId",
                table: "Items",
                column: "ItemImageId",
                principalTable: "Images",
                principalColumn: "ImageId",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
