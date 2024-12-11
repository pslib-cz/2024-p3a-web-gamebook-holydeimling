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
            migrationBuilder.RenameColumn(
                name: "DialogCharacterId",
                table: "Dialogs",
                newName: "CharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_Dialogs_CharacterId",
                table: "Dialogs",
                column: "CharacterId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dialogs_Characters_CharacterId",
                table: "Dialogs",
                column: "CharacterId",
                principalTable: "Characters",
                principalColumn: "CharacterId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dialogs_Characters_CharacterId",
                table: "Dialogs");

            migrationBuilder.DropIndex(
                name: "IX_Dialogs_CharacterId",
                table: "Dialogs");

            migrationBuilder.RenameColumn(
                name: "CharacterId",
                table: "Dialogs",
                newName: "DialogCharacterId");
        }
    }
}
