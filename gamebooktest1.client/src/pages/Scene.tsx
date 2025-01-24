import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Scene } from "../types";
import "./Scene.css";
import { useUser } from "../UserContext";
import { InventoryComponent } from "../components/Inventory/Inventory";
import { QuestContainer } from "../components/QuestContainer";
import { fetchScene } from "../utils/fetchScene";
import { saveDataOnCheckpoint } from "../utils/saveDataOnCheckpoint";
import { PauseScreen } from "../components/PauseScreen";
import { loadGame } from "../utils/startGame";
import { GameOverScreen } from "../components/GameOverScreen";

export const ScenePage = () => {
  const { user, setUser } = useUser();
  const { id } = useParams<{ id: string }>(); // Get the id from the URL
  const [sceneId, setSceneId] = useState<number>(1); // State to store the scene id
  const [currentScene, setCurrentScene] = useState<Scene | null>(null); // State to store the fetched scene object
  const navigate = useNavigate();
  const [dialogIndex, setDialogIndex] = useState(0);

  // Fetch scene whenever id changes
  useEffect(() => {
    const newSceneId = parseInt(id || "1");
    /* 
    if (currentScene) {
      const allPossibleIdsFromCurrentScene = currentScene.sceneDialogs
        ?.map((dialog) =>
          dialog.dialogAnswers.map((answer) => answer.nextSceneId)
        )
        .flat();

      console.log(
        "All possible ids from the current scene",
        allPossibleIdsFromCurrentScene
      );

      if (
        allPossibleIdsFromCurrentScene &&
        !allPossibleIdsFromCurrentScene.includes(newSceneId) &&
        newSceneId !== sceneId + 1
      ) {
        console.log("Scene id is incorrect", newSceneId);
        navigate(`/`);
      }
    } */

    setSceneId(newSceneId);
    fetchScene(newSceneId, setCurrentScene);
    console.log("Scene id is correct", newSceneId);
  }, [id]); //this need to fix

  // Temporary scene ID increment for testing
  const handleButtonClick = () => {
    if (currentScene?.isCheckpoint) {
      saveDataOnCheckpoint(
        user,
        setUser,
        sceneId,
        user?.gameState.inventoryState,
        user?.gameState.questsState
      );
    }
    if (currentScene?.gameOver) {
      setShowGameOver(true);
    } else {
      navigate(`/scene/${sceneId + 1}`); // Navigate to the next scene if no game over
    }
  };

  // Handle continue click
  const handleContinueClick = () => {
    if (
      currentScene?.sceneDialogs &&
      currentScene.sceneDialogs.length > 0 &&
      dialogIndex >= 0 &&
      dialogIndex < currentScene.sceneDialogs.length - 1
    ) {
      setDialogIndex(dialogIndex + 1);
    } else {
      setDialogIndex(0);
      navigate(`/scene/${sceneId + 1}`); // Navigate to the next scene
    }
    if (currentScene?.isCheckpoint) {
      saveDataOnCheckpoint(
        user,
        setUser,
        sceneId,
        user?.gameState.inventoryState,
        user?.gameState.questsState
      );
    }
    if (currentScene?.gameOver) {
      setShowGameOver(true);
    } else {
      navigate(`/scene/${sceneId + 1}`); // Navigate to the next scene if no game over
    }
  };

  useEffect(() => {
    if (
      currentScene?.questToAddId !== null ||
      currentScene?.questToAddId !== 0
    ) {
      // Add quest to the user
    }
  }, [currentScene]);

  const [showPauseMenu, setShowPauseMenu] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowPauseMenu((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleResumeClick = () => {
    setShowPauseMenu(false);
  };

  const HandleToMainMenu = () => {
    setShowPauseMenu(false);
    setSceneId(1);
    setCurrentScene(null);
    navigate("/");
  };

  const [showGameOver, setShowGameOver] = useState(false);

  return (
    <>
      {showGameOver && (
        <GameOverScreen
          user={user}
          setUser={setUser}
          setShowGameOver={setShowGameOver}
        />
      )}
      {showPauseMenu && (
        <PauseScreen
          handleResume={handleResumeClick}
          handleExitToMainMenu={HandleToMainMenu}
        />
      )}
      <InventoryComponent currentInventory={user?.gameState.inventoryState} />
      <QuestContainer questState={user?.gameState.questsState} />
      <div
        style={{
          backgroundImage: currentScene
            ? `url(/${currentScene.backgroundImage.filePath})`
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
        {currentScene?.sceneItems?.map((sceneItem) => {
          return (
            <div key={sceneItem.sceneItemId}>
              <h3>{sceneItem.item.itemName}</h3>
              <img
                key={sceneItem.sceneItemId}
                src={`/${sceneItem.item.itemImages[0].filePath}`}
                alt={sceneItem.item.itemName}
                style={{
                  top: `${sceneItem.position.y}%`,
                  left: `${sceneItem.position.x}%`,
                  width: `${sceneItem.size.width}%`,
                  height: `${sceneItem.size.height}%`,
                }}
                className="scene__image scene-item"
              />
            </div>
          );
        })}
        {/* characters */}
        {currentScene?.sceneCharacters?.map((sceneCharacter) => {
          return (
            <div key={sceneCharacter.sceneCharacterId}>
              <h3>
                {sceneCharacter.character.firstName}{" "}
                {sceneCharacter.character.nickname}{" "}
                {sceneCharacter.character.lastName}
              </h3>
              <img
                key={sceneCharacter.sceneCharacterId}
                src={`/${sceneCharacter.character.characterImages[0].filePath}`}
                alt={sceneCharacter.character.firstName}
                style={{
                  top: `${sceneCharacter.position.y}%`,
                  left: `${sceneCharacter.position.x}%`,
                  width: `${sceneCharacter.size.width}%`,
                  height: `${sceneCharacter.size.height}%`,
                }}
                className="scene__image scene-character"
              />
            </div>
          );
        })}
        {/* dialogs*/}
        {currentScene?.sceneDialogs?.length !== undefined &&
          currentScene.sceneDialogs.length > 0 && (
            <div className="dialog-system">
              <img
                src={`/${currentScene.sceneDialogs[dialogIndex].character.characterImages[0].filePath}`}
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
                          if (currentScene?.isCheckpoint) {
                            saveDataOnCheckpoint(
                              user,
                              setUser,
                              sceneId,
                              user?.gameState.inventoryState,
                              user?.gameState.questsState
                            );
                          }
                          if (currentScene?.gameOver) {
                            setShowGameOver(true);
                          } else {
                            if (dialogAnswer.nextSceneId) {
                              navigate(`/scene/${dialogAnswer.nextSceneId}`);
                              setDialogIndex(0);
                            } else if (dialogAnswer.nextDialogId) {
                              // Find the index of the next dialog within the current scene
                              const nextDialogIndex =
                                currentScene.sceneDialogs.findIndex(
                                  (dialog) =>
                                    dialog.dialogId ===
                                    dialogAnswer.nextDialogId
                                );
                              if (nextDialogIndex !== -1) {
                                // Update the dialogIndex to render the next dialog
                                setDialogIndex(nextDialogIndex);
                              }
                            } else {
                              navigate(`/scene/${dialogAnswer.nextSceneId}`);
                            }
                          }
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
      </div>
    </>
  );
};
