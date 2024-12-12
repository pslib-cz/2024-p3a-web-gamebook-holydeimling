using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class kys22 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Items_Inventories_InventoryId",
                table: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Items_InventoryId",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "InventoryId",
                table: "Items");

            migrationBuilder.AddColumn<int>(
                name: "Item1ItemId",
                table: "Inventories",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Item2ItemId",
                table: "Inventories",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Item3ItemId",
                table: "Inventories",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Item4ItemId",
                table: "Inventories",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Item5ItemId",
                table: "Inventories",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Item6ItemId",
                table: "Inventories",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Item7ItemId",
                table: "Inventories",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Item8ItemId",
                table: "Inventories",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Item9ItemId",
                table: "Inventories",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_Item1ItemId",
                table: "Inventories",
                column: "Item1ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_Item2ItemId",
                table: "Inventories",
                column: "Item2ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_Item3ItemId",
                table: "Inventories",
                column: "Item3ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_Item4ItemId",
                table: "Inventories",
                column: "Item4ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_Item5ItemId",
                table: "Inventories",
                column: "Item5ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_Item6ItemId",
                table: "Inventories",
                column: "Item6ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_Item7ItemId",
                table: "Inventories",
                column: "Item7ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_Item8ItemId",
                table: "Inventories",
                column: "Item8ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Inventories_Item9ItemId",
                table: "Inventories",
                column: "Item9ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Items_Item1ItemId",
                table: "Inventories",
                column: "Item1ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Items_Item2ItemId",
                table: "Inventories",
                column: "Item2ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Items_Item3ItemId",
                table: "Inventories",
                column: "Item3ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Items_Item4ItemId",
                table: "Inventories",
                column: "Item4ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Items_Item5ItemId",
                table: "Inventories",
                column: "Item5ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Items_Item6ItemId",
                table: "Inventories",
                column: "Item6ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Items_Item7ItemId",
                table: "Inventories",
                column: "Item7ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Items_Item8ItemId",
                table: "Inventories",
                column: "Item8ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventories_Items_Item9ItemId",
                table: "Inventories",
                column: "Item9ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Items_Item1ItemId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Items_Item2ItemId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Items_Item3ItemId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Items_Item4ItemId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Items_Item5ItemId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Items_Item6ItemId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Items_Item7ItemId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Items_Item8ItemId",
                table: "Inventories");

            migrationBuilder.DropForeignKey(
                name: "FK_Inventories_Items_Item9ItemId",
                table: "Inventories");

            migrationBuilder.DropIndex(
                name: "IX_Inventories_Item1ItemId",
                table: "Inventories");

            migrationBuilder.DropIndex(
                name: "IX_Inventories_Item2ItemId",
                table: "Inventories");

            migrationBuilder.DropIndex(
                name: "IX_Inventories_Item3ItemId",
                table: "Inventories");

            migrationBuilder.DropIndex(
                name: "IX_Inventories_Item4ItemId",
                table: "Inventories");

            migrationBuilder.DropIndex(
                name: "IX_Inventories_Item5ItemId",
                table: "Inventories");

            migrationBuilder.DropIndex(
                name: "IX_Inventories_Item6ItemId",
                table: "Inventories");

            migrationBuilder.DropIndex(
                name: "IX_Inventories_Item7ItemId",
                table: "Inventories");

            migrationBuilder.DropIndex(
                name: "IX_Inventories_Item8ItemId",
                table: "Inventories");

            migrationBuilder.DropIndex(
                name: "IX_Inventories_Item9ItemId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "Item1ItemId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "Item2ItemId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "Item3ItemId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "Item4ItemId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "Item5ItemId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "Item6ItemId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "Item7ItemId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "Item8ItemId",
                table: "Inventories");

            migrationBuilder.DropColumn(
                name: "Item9ItemId",
                table: "Inventories");

            migrationBuilder.AddColumn<int>(
                name: "InventoryId",
                table: "Items",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Items_InventoryId",
                table: "Items",
                column: "InventoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Items_Inventories_InventoryId",
                table: "Items",
                column: "InventoryId",
                principalTable: "Inventories",
                principalColumn: "InventoryId");
        }
    }
}
