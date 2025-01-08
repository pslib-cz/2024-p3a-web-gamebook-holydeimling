import { useEffect, useState } from "react";
import { Scene } from "../types";
import "./Scene.css";
import { useUser } from "../UserContext";
import { InventoryComponent } from "../components/Inventory/Inventory";
import { QuestContainer } from "../components/QuestContainer";
import { editQuestState } from "../utils/editQuestState";
import { fetchScene } from "../utils/fetchScene";

export const ScenePage = () => {
  const { user, setUser } = useUser();
  const [sceneId, setSceneId] = useState<number>(
    user?.gameState.checkpointSceneId ? user.gameState.checkpointSceneId : 1
  ); // State to store the scene ID
  const [currentScene, setCurrentScene] = useState<Scene | null>(null); // State to store the fetched scene object

  const [dialogIndex, setDialogIndex] = useState(0);

  useEffect(() => {
    if (user) {
      setSceneId(user.gameState.checkpointSceneId);
    }
  }, [user]);

  useEffect(() => {
    fetchScene(sceneId, setCurrentScene);
  }, [sceneId]); // Fetch scene whenever sceneId changes

  const handleButtonClick = () => {
    setSceneId(sceneId + 1); // Increment sceneId by 1
  };

  const handleContinueClick = () => {
    if (
      currentScene?.sceneDialogs.length !== undefined &&
      currentScene?.sceneDialogs.length > 0 &&
      dialogIndex !== undefined &&
      dialogIndex !== null &&
      dialogIndex >= 0 &&
      dialogIndex < currentScene?.sceneDialogs.length - 1
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
          backgroundImage: currentScene
            ? `url(${currentScene.backgroundImage.filePath})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="scene-background__image"
      >
        <h1>Scene id: {sceneId}</h1>
        <h2>Scene Data</h2>

        <div>
          <button onClick={handleButtonClick}>Change Scene</button>
        </div>
        {/* items */}
        {currentScene?.sceneItems.map((sceneItem) => (
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
        {currentScene?.sceneCharacters.map((sceneCharacter) => (
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
        {currentScene?.sceneDialogs.length !== undefined &&
          currentScene?.sceneDialogs.length > 0 && (
            <div className="dialog-system">
              <img
                src={
                  currentScene.sceneDialogs[dialogIndex].character
                    .characterImages[0].filePath
                }
                alt=""
                className="dialog-system__character"
              />
              <h3>
                {currentScene.sceneDialogs[dialogIndex].character.firstName}{" "}
                {currentScene.sceneDialogs[dialogIndex].character.nickname}{" "}
                {currentScene.sceneDialogs[dialogIndex].character.lastName}
              </h3>
              <p>{currentScene.sceneDialogs[dialogIndex].text}</p>
              {currentScene.sceneDialogs[dialogIndex].dialogAnswers.length <=
              0 ? (
                <button
                  onClick={() => {
                    handleContinueClick();
                  }}
                >
                  Continue
                </button>
              ) : (
                <div>
                  {currentScene.sceneDialogs[dialogIndex].dialogAnswers.map(
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
