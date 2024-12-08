using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    /// <inheritdoc />
    public partial class idkasaas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Characters",
                columns: table => new
                {
                    CharacterId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FirstName = table.Column<string>(type: "TEXT", nullable: false),
                    LastName = table.Column<string>(type: "TEXT", nullable: false),
                    Nickname = table.Column<string>(type: "TEXT", nullable: true),
                    BackStory = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Characters", x => x.CharacterId);
                });

            migrationBuilder.CreateTable(
                name: "Quest",
                columns: table => new
                {
                    QuestId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    QuestHeading = table.Column<string>(type: "TEXT", nullable: false),
                    QuestContent = table.Column<string>(type: "TEXT", nullable: false),
                    IsStoryQuest = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsCompleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quest", x => x.QuestId);
                });

            migrationBuilder.CreateTable(
                name: "Scenes",
                columns: table => new
                {
                    SceneId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SceneName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scenes", x => x.SceneId);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserName = table.Column<string>(type: "TEXT", nullable: false),
                    UserEmail = table.Column<string>(type: "TEXT", nullable: false),
                    UserPassword = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Inventory",
                columns: table => new
                {
                    InventoryId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CharacterId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inventory", x => x.InventoryId);
                    table.ForeignKey(
                        name: "FK_Inventory_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "CharacterId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Dialog",
                columns: table => new
                {
                    DialogId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DialogCharacterId = table.Column<int>(type: "INTEGER", nullable: false),
                    Text = table.Column<string>(type: "TEXT", nullable: false),
                    SceneId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dialog", x => x.DialogId);
                    table.ForeignKey(
                        name: "FK_Dialog_Scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "Scenes",
                        principalColumn: "SceneId");
                });

            migrationBuilder.CreateTable(
                name: "SceneCharacters",
                columns: table => new
                {
                    SceneCharacterId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SceneId = table.Column<int>(type: "INTEGER", nullable: false),
                    CharacterId = table.Column<int>(type: "INTEGER", nullable: false),
                    Position = table.Column<string>(type: "TEXT", nullable: false),
                    Size = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SceneCharacters", x => x.SceneCharacterId);
                    table.ForeignKey(
                        name: "FK_SceneCharacters_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "CharacterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SceneCharacters_Scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "Scenes",
                        principalColumn: "SceneId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameState",
                columns: table => new
                {
                    GameStateId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    InventoryId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameState", x => x.GameStateId);
                    table.ForeignKey(
                        name: "FK_GameState_Inventory_InventoryId",
                        column: x => x.InventoryId,
                        principalTable: "Inventory",
                        principalColumn: "InventoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameState_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    ItemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ItemName = table.Column<string>(type: "TEXT", nullable: false),
                    ItemDescription = table.Column<string>(type: "TEXT", nullable: true),
                    ItemImageId = table.Column<int>(type: "INTEGER", nullable: true),
                    InventoryId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.ItemId);
                    table.ForeignKey(
                        name: "FK_Items_Inventory_InventoryId",
                        column: x => x.InventoryId,
                        principalTable: "Inventory",
                        principalColumn: "InventoryId");
                });

            migrationBuilder.CreateTable(
                name: "GameStateQuest",
                columns: table => new
                {
                    GameStatesGameStateId = table.Column<int>(type: "INTEGER", nullable: false),
                    QuestsQuestId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameStateQuest", x => new { x.GameStatesGameStateId, x.QuestsQuestId });
                    table.ForeignKey(
                        name: "FK_GameStateQuest_GameState_GameStatesGameStateId",
                        column: x => x.GameStatesGameStateId,
                        principalTable: "GameState",
                        principalColumn: "GameStateId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GameStateQuest_Quest_QuestsQuestId",
                        column: x => x.QuestsQuestId,
                        principalTable: "Quest",
                        principalColumn: "QuestId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    ImageId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ImageData = table.Column<byte[]>(type: "BLOB", nullable: false),
                    MimeType = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CharacterId = table.Column<int>(type: "INTEGER", nullable: true),
                    ItemId = table.Column<int>(type: "INTEGER", nullable: true),
                    SceneId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.ImageId);
                    table.ForeignKey(
                        name: "FK_Images_Characters_CharacterId",
                        column: x => x.CharacterId,
                        principalTable: "Characters",
                        principalColumn: "CharacterId");
                    table.ForeignKey(
                        name: "FK_Images_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Images_Scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "Scenes",
                        principalColumn: "SceneId");
                });

            migrationBuilder.CreateTable(
                name: "SceneItems",
                columns: table => new
                {
                    SceneItemId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SceneId = table.Column<int>(type: "INTEGER", nullable: false),
                    ItemId = table.Column<int>(type: "INTEGER", nullable: false),
                    Position = table.Column<string>(type: "TEXT", nullable: false),
                    Size = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SceneItems", x => x.SceneItemId);
                    table.ForeignKey(
                        name: "FK_SceneItems_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SceneItems_Scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "Scenes",
                        principalColumn: "SceneId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Characters",
                columns: new[] { "CharacterId", "BackStory", "FirstName", "LastName", "Nickname" },
                values: new object[] { 1, "Alice is a brave adventurer who loves to explore the world.", "Alice", "Adventurer", "Idk" });

            migrationBuilder.CreateIndex(
                name: "IX_Dialog_SceneId",
                table: "Dialog",
                column: "SceneId");

            migrationBuilder.CreateIndex(
                name: "IX_GameState_InventoryId",
                table: "GameState",
                column: "InventoryId");

            migrationBuilder.CreateIndex(
                name: "IX_GameState_UserId",
                table: "GameState",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_GameStateQuest_QuestsQuestId",
                table: "GameStateQuest",
                column: "QuestsQuestId");

            migrationBuilder.CreateIndex(
                name: "IX_Images_CharacterId",
                table: "Images",
                column: "CharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_Images_ItemId",
                table: "Images",
                column: "ItemId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Images_SceneId",
                table: "Images",
                column: "SceneId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Inventory_CharacterId",
                table: "Inventory",
                column: "CharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_InventoryId",
                table: "Items",
                column: "InventoryId");

            migrationBuilder.CreateIndex(
                name: "IX_SceneCharacters_CharacterId",
                table: "SceneCharacters",
                column: "CharacterId");

            migrationBuilder.CreateIndex(
                name: "IX_SceneCharacters_SceneId",
                table: "SceneCharacters",
                column: "SceneId");

            migrationBuilder.CreateIndex(
                name: "IX_SceneItems_ItemId",
                table: "SceneItems",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_SceneItems_SceneId",
                table: "SceneItems",
                column: "SceneId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dialog");

            migrationBuilder.DropTable(
                name: "GameStateQuest");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropTable(
                name: "SceneCharacters");

            migrationBuilder.DropTable(
                name: "SceneItems");

            migrationBuilder.DropTable(
                name: "GameState");

            migrationBuilder.DropTable(
                name: "Quest");

            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "Scenes");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Inventory");

            migrationBuilder.DropTable(
                name: "Characters");
        }
    }
}
