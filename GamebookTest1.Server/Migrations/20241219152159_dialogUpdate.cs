using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class dialogUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GameStateQuest");

            migrationBuilder.AddColumn<int>(
                name: "GameStateId",
                table: "Quests",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "DialogAnswers",
                columns: table => new
                {
                    DialogAnswerId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AnswerText = table.Column<string>(type: "TEXT", nullable: true),
                    NextSceneIds = table.Column<string>(type: "TEXT", nullable: false),
                    DialogId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DialogAnswers", x => x.DialogAnswerId);
                    table.ForeignKey(
                        name: "FK_DialogAnswers_Dialogs_DialogId",
                        column: x => x.DialogId,
                        principalTable: "Dialogs",
                        principalColumn: "DialogId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Quests_GameStateId",
                table: "Quests",
                column: "GameStateId");

            migrationBuilder.CreateIndex(
                name: "IX_DialogAnswers_DialogId",
                table: "DialogAnswers",
                column: "DialogId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quests_GameStates_GameStateId",
                table: "Quests",
                column: "GameStateId",
                principalTable: "GameStates",
                principalColumn: "GameStateId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quests_GameStates_GameStateId",
                table: "Quests");

            migrationBuilder.DropTable(
                name: "DialogAnswers");

            migrationBuilder.DropIndex(
                name: "IX_Quests_GameStateId",
                table: "Quests");

            migrationBuilder.DropColumn(
                name: "GameStateId",
                table: "Quests");

            migrationBuilder.CreateTable(
                name: "GameStateQuest",
                columns: table => new
                {
                    GameStatesGameStateId = table.Column<int>(type: "INTEGER", nullable: false),
                    QuestsStateQuestId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameStateQuest", x => new { x.GameStatesGameStateId, x.QuestsStateQuestId });
                    table.ForeignKey(
                        name: "FK_GameStateQuest_GameStates_GameStatesGameStateId",
                        column: x => x.GameStatesGameStateId,
                        principalTable: "GameStates",
                        principalColumn: "GameStateId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameStateQuest_Quests_QuestsStateQuestId",
                        column: x => x.QuestsStateQuestId,
                        principalTable: "Quests",
                        principalColumn: "QuestId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameStateQuest_QuestsStateQuestId",
                table: "GameStateQuest",
                column: "QuestsStateQuestId");
        }
    }
}
