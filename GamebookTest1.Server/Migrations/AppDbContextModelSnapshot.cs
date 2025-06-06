﻿// <auto-generated />
using System;
using GamebookTest1.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GamebookTest1.Server.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("GamebookTest1.Server.Models.Character", b =>
                {
                    b.Property<int>("CharacterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("BackStory")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Nickname")
                        .HasColumnType("TEXT");

                    b.HasKey("CharacterId");

                    b.ToTable("Characters");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Dialog", b =>
                {
                    b.Property<int>("DialogId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CharacterId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("SceneId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("DialogId");

                    b.HasIndex("CharacterId");

                    b.HasIndex("SceneId");

                    b.ToTable("Dialogs");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.DialogAnswer", b =>
                {
                    b.Property<int>("DialogAnswerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("AnswerText")
                        .HasColumnType("TEXT");

                    b.Property<int?>("DialogId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("NextDialogId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("NextSceneId")
                        .HasColumnType("INTEGER");

                    b.HasKey("DialogAnswerId");

                    b.HasIndex("DialogId");

                    b.ToTable("DialogAnswers");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.GameState", b =>
                {
                    b.Property<int>("GameStateId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("CheckpointSceneId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("InventoryStateInventoryId")
                        .HasColumnType("INTEGER");

                    b.HasKey("GameStateId");

                    b.HasIndex("InventoryStateInventoryId");

                    b.ToTable("GameStates");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Image", b =>
                {
                    b.Property<int>("ImageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("CharacterId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("FilePath")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int?>("ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("ImageId");

                    b.HasIndex("CharacterId");

                    b.HasIndex("ItemId");

                    b.ToTable("Images");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Inventory", b =>
                {
                    b.Property<int>("InventoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Item1ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Item2ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Item3ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Item4ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Item5ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Item6ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Item7ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Item8ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("Item9ItemId")
                        .HasColumnType("INTEGER");

                    b.HasKey("InventoryId");

                    b.HasIndex("Item1ItemId");

                    b.HasIndex("Item2ItemId");

                    b.HasIndex("Item3ItemId");

                    b.HasIndex("Item4ItemId");

                    b.HasIndex("Item5ItemId");

                    b.HasIndex("Item6ItemId");

                    b.HasIndex("Item7ItemId");

                    b.HasIndex("Item8ItemId");

                    b.HasIndex("Item9ItemId");

                    b.ToTable("Inventories");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Item", b =>
                {
                    b.Property<int>("ItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ItemDescription")
                        .HasColumnType("TEXT");

                    b.Property<string>("ItemName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("ItemId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Position", b =>
                {
                    b.Property<int>("PositionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("X")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Y")
                        .HasColumnType("INTEGER");

                    b.HasKey("PositionId");

                    b.ToTable("Positions");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Quest", b =>
                {
                    b.Property<int>("QuestId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("GameStateId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("QuestContent")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("QuestHeading")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("QuestId");

                    b.HasIndex("GameStateId");

                    b.ToTable("Quests");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Scene", b =>
                {
                    b.Property<int>("SceneId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("BackgroundImageImageId")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("GameOver")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsCheckpoint")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("MinigameId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("QuestToAddId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("QuestToRemoveId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("SceneName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("SceneId");

                    b.HasIndex("BackgroundImageImageId");

                    b.ToTable("Scenes");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.SceneCharacter", b =>
                {
                    b.Property<int>("SceneCharacterId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("CharacterId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("PositionId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("SizeId")
                        .HasColumnType("INTEGER");

                    b.HasKey("SceneCharacterId");

                    b.HasIndex("CharacterId");

                    b.HasIndex("PositionId");

                    b.HasIndex("SizeId");

                    b.ToTable("SceneCharacters");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.SceneItem", b =>
                {
                    b.Property<int>("SceneItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("PositionId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("SceneId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("SizeId")
                        .HasColumnType("INTEGER");

                    b.HasKey("SceneItemId");

                    b.HasIndex("ItemId");

                    b.HasIndex("PositionId");

                    b.HasIndex("SceneId");

                    b.HasIndex("SizeId");

                    b.ToTable("SceneItems");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Size", b =>
                {
                    b.Property<int>("SizeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("Height")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Width")
                        .HasColumnType("INTEGER");

                    b.HasKey("SizeId");

                    b.ToTable("Sizes");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("GameStateId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserRole")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("GameStateId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("SceneSceneCharacter", b =>
                {
                    b.Property<int>("SceneCharactersSceneCharacterId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("SceneId")
                        .HasColumnType("INTEGER");

                    b.HasKey("SceneCharactersSceneCharacterId", "SceneId");

                    b.HasIndex("SceneId");

                    b.ToTable("SceneToSceneCharacter", (string)null);
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Dialog", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.Character", "Character")
                        .WithMany()
                        .HasForeignKey("CharacterId");

                    b.HasOne("GamebookTest1.Server.Models.Scene", null)
                        .WithMany("SceneDialogs")
                        .HasForeignKey("SceneId");

                    b.Navigation("Character");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.DialogAnswer", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.Dialog", null)
                        .WithMany("DialogAnswers")
                        .HasForeignKey("DialogId");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.GameState", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.Inventory", "InventoryState")
                        .WithMany()
                        .HasForeignKey("InventoryStateInventoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("InventoryState");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Image", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.Character", null)
                        .WithMany("CharacterImages")
                        .HasForeignKey("CharacterId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("GamebookTest1.Server.Models.Item", null)
                        .WithMany("ItemImages")
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Inventory", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.Item", "Item1")
                        .WithMany()
                        .HasForeignKey("Item1ItemId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("GamebookTest1.Server.Models.Item", "Item2")
                        .WithMany()
                        .HasForeignKey("Item2ItemId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("GamebookTest1.Server.Models.Item", "Item3")
                        .WithMany()
                        .HasForeignKey("Item3ItemId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("GamebookTest1.Server.Models.Item", "Item4")
                        .WithMany()
                        .HasForeignKey("Item4ItemId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("GamebookTest1.Server.Models.Item", "Item5")
                        .WithMany()
                        .HasForeignKey("Item5ItemId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("GamebookTest1.Server.Models.Item", "Item6")
                        .WithMany()
                        .HasForeignKey("Item6ItemId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("GamebookTest1.Server.Models.Item", "Item7")
                        .WithMany()
                        .HasForeignKey("Item7ItemId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("GamebookTest1.Server.Models.Item", "Item8")
                        .WithMany()
                        .HasForeignKey("Item8ItemId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("GamebookTest1.Server.Models.Item", "Item9")
                        .WithMany()
                        .HasForeignKey("Item9ItemId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Item1");

                    b.Navigation("Item2");

                    b.Navigation("Item3");

                    b.Navigation("Item4");

                    b.Navigation("Item5");

                    b.Navigation("Item6");

                    b.Navigation("Item7");

                    b.Navigation("Item8");

                    b.Navigation("Item9");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Quest", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.GameState", null)
                        .WithMany("QuestsState")
                        .HasForeignKey("GameStateId");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Scene", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.Image", "BackgroundImage")
                        .WithMany()
                        .HasForeignKey("BackgroundImageImageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BackgroundImage");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.SceneCharacter", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.Character", "Character")
                        .WithMany()
                        .HasForeignKey("CharacterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GamebookTest1.Server.Models.Position", "Position")
                        .WithMany()
                        .HasForeignKey("PositionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GamebookTest1.Server.Models.Size", "Size")
                        .WithMany()
                        .HasForeignKey("SizeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Character");

                    b.Navigation("Position");

                    b.Navigation("Size");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.SceneItem", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.Item", "Item")
                        .WithMany()
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GamebookTest1.Server.Models.Position", "Position")
                        .WithMany()
                        .HasForeignKey("PositionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GamebookTest1.Server.Models.Scene", null)
                        .WithMany("SceneItems")
                        .HasForeignKey("SceneId");

                    b.HasOne("GamebookTest1.Server.Models.Size", "Size")
                        .WithMany()
                        .HasForeignKey("SizeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Item");

                    b.Navigation("Position");

                    b.Navigation("Size");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.User", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.GameState", "GameState")
                        .WithMany()
                        .HasForeignKey("GameStateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GameState");
                });

            modelBuilder.Entity("SceneSceneCharacter", b =>
                {
                    b.HasOne("GamebookTest1.Server.Models.SceneCharacter", null)
                        .WithMany()
                        .HasForeignKey("SceneCharactersSceneCharacterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GamebookTest1.Server.Models.Scene", null)
                        .WithMany()
                        .HasForeignKey("SceneId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Character", b =>
                {
                    b.Navigation("CharacterImages");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Dialog", b =>
                {
                    b.Navigation("DialogAnswers");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.GameState", b =>
                {
                    b.Navigation("QuestsState");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Item", b =>
                {
                    b.Navigation("ItemImages");
                });

            modelBuilder.Entity("GamebookTest1.Server.Models.Scene", b =>
                {
                    b.Navigation("SceneDialogs");

                    b.Navigation("SceneItems");
                });
#pragma warning restore 612, 618
        }
    }
}
