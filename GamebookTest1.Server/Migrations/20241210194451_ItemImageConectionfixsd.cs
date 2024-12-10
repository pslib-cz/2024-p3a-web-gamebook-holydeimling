using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class ItemImageConectionfixsd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Items_ItemId",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_ItemId",
                table: "Images");

            migrationBuilder.CreateIndex(
                name: "IX_Items_ItemImageId",
                table: "Items",
                column: "ItemImageId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_ItemId",
                table: "Images",
                column: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Items_ItemId",
                table: "Images",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Images_ItemImageId",
                table: "Items",
                column: "ItemImageId",
                principalTable: "Images",
                principalColumn: "ImageId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Items_ItemId",
                table: "Images");

            migrationBuilder.DropForeignKey(
                name: "FK_Items_Images_ItemImageId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_ItemImageId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Images_ItemId",
                table: "Images");

            migrationBuilder.CreateIndex(
                name: "IX_Images_ItemId",
                table: "Images",
                column: "ItemId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Items_ItemId",
                table: "Images",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
