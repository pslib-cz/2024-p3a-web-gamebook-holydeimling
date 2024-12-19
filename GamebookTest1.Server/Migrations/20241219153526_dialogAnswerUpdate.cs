using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class dialogAnswerUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NextSceneIds",
                table: "DialogAnswers");

            migrationBuilder.AddColumn<int>(
                name: "NextSceneId",
                table: "DialogAnswers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NextSceneId",
                table: "DialogAnswers");

            migrationBuilder.AddColumn<string>(
                name: "NextSceneIds",
                table: "DialogAnswers",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
