import React, { useContext, useEffect, useState } from "react";
import { Scene, SceneCharacter } from "../types";
import "./Scene.css";
import { useUser } from "../UserContext";
import { InventoryComponent } from "../components/Inventory/Inventory";
import { QuestContainer } from "../components/QuestContainer";
import { editQuestState } from "../utils/editQuestState";

export const ScenePage = () => {
  const { user, setUser } = useUser(); // Get the user object from context
  const [sceneId, setSceneId] = useState<number>(
    user?.gameState.checkpointSceneId || 1
  ); // State to store the scene ID
  const [scene, setScene] = useState<Scene | null>(null); // State to store the fetched scene object
  const [error, setError] = useState<string | null>(null); // State to store any errors

  const [dialogIndex, setDialogIndex] = useState(0);

  const fetchScene = async (id: number) => {
    try {
      const response = await fetch(`https://localhost:7174/api/Scene/${id}`, {
        method: "GET",
        headers: {
          Accept: "*/*", // Header matching your curl command
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Parse response as JSON
      setScene(data as Scene); // Set the scene object in state
      setError(null); // Clear any previous errors
      console.log(data); // Log the object to console
    } catch (error) {
      console.error("Error fetching scene:", error);
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    fetchScene(sceneId);
  }, [sceneId]); // Fetch scene whenever sceneId changes

  const handleButtonClick = () => {
    setSceneId(sceneId + 1); // Increment sceneId by 1
  };

  const handleContinueClick = () => {
    if (
      scene?.sceneDialogs.length !== undefined &&
      scene?.sceneDialogs.length > 0 &&
      dialogIndex !== undefined &&
      dialogIndex !== null &&
      dialogIndex >= 0 &&
      dialogIndex < scene?.sceneDialogs.length - 1
    ) {
      setDialogIndex(dialogIndex + 1);
    } else {
      setDialogIndex(0);
      setSceneId(sceneId + 1);
    }
  };

  return (
    <>
      <InventoryComponent currentInventory={user?.gameState.inventoryState} />
      <QuestContainer questState={user?.gameState.questsState} />
      <div
        style={{
          backgroundImage: scene
            ? `url(${scene.backgroundImage.filePath})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="scene-background__image"
      >
        <h1>Scene id: {sceneId}</h1>
        <h2>Scene Data</h2>
        {error ? (
          <p className="error">{error}</p>
        ) : scene ? (
          <pre>{JSON.stringify(scene, null, 2)}</pre> // Pretty-print JSON data
        ) : (
          <p>Loading...</p>
        )}
        <div>
          <button onClick={handleButtonClick}>Change Scene</button>
        </div>
        {/* items */}
        {scene?.sceneItems.map((sceneItem) => (
          <div key={sceneItem.sceneItemId}>
            <h3>{sceneItem.item.itemName}</h3>
            <img
              key={sceneItem.sceneItemId}
              src={sceneItem.item.itemImages[0].filePath}
              alt={sceneItem.item.itemName}
              style={{
                position: "absolute",
                top: `${sceneItem.position.y}px`,
                left: `${sceneItem.position.x}px`,
                width: `${sceneItem.size.width}px`,
                height: `${sceneItem.size.height}px`,
              }}
              className="scene-item"
            />
          </div>
        ))}
        {/* characters */}
        {scene?.sceneCharacters.map((sceneCharacter) => (
          <div key={sceneCharacter.sceneCharacterId}>
            <h3>
              {sceneCharacter.character.firstName}{" "}
              {sceneCharacter.character.nickname}{" "}
              {sceneCharacter.character.lastName}
            </h3>
            <img
              key={sceneCharacter.sceneCharacterId}
              src={sceneCharacter.character.characterImages[0].filePath}
              alt={sceneCharacter.character.firstName}
              style={{
                position: "absolute",
                top: `${sceneCharacter.position.y}px`,
                left: `${sceneCharacter.position.x}px`,
                width: `${sceneCharacter.size.width}px`,
                height: `${sceneCharacter.size.height}px`,
              }}
              className="scene-character"
            />
          </div>
        ))}
        {/* dialogs*/}
        {scene?.sceneDialogs.length !== undefined &&
          scene?.sceneDialogs.length > 0 && (
            <div className="dialog-system">
              <img
                src={
                  scene.sceneDialogs[dialogIndex].character.characterImages[0]
                    .filePath
                }
                alt=""
                className="dialog-system__character"
              />
              <h3>
                {scene.sceneDialogs[dialogIndex].character.firstName}{" "}
                {scene.sceneDialogs[dialogIndex].character.nickname}{" "}
                {scene.sceneDialogs[dialogIndex].character.lastName}
              </h3>
              <p>{scene.sceneDialogs[dialogIndex].text}</p>
              {scene.sceneDialogs[dialogIndex].dialogAnswers.length <= 0 ? (
                <button
                  onClick={() => {
                    handleContinueClick();
                  }}
                >
                  Continue
                </button>
              ) : (
                <div>
                  {scene.sceneDialogs[dialogIndex].dialogAnswers.map(
                    (dialogAnswer) => (
                      <button
                        key={dialogAnswer.dialogAnswerId}
                        onClick={() => {
                          setSceneId(dialogAnswer.nextSceneId);
                          console.log(dialogAnswer.nextSceneId);
                        }}
                      >
                        {dialogAnswer.answerText}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        <button
          onClick={() => {
            editQuestState(user, setUser, user?.gameState.gameStateId, [1, 2]);
          }}
        >
          Change Quest
        </button>
      </div>
    </>
  );
};
