import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Inventory, Item, Quest, Scene, SceneCharacter } from "../types";
import "./Scene.css";
import { User, useUser } from "../UserContext";
import { InventoryComponent } from "../components/Inventory/Inventory";
import { QuestContainer } from "../components/QuestContainer";
import { fetchScene } from "../utils/fetchScene";
import { saveDataOnCheckpoint } from "../utils/saveDataOnCheckpoint";
import { PauseScreen } from "../components/PauseScreen";
import { GameOverScreen } from "../components/GameOverScreen";
import { SceneCharacterComponent } from "../components/SceneCharacterComponent";
import { SceneItemComponent } from "../components/SceneItemComponent";
import { addItemToInventory } from "../utils/inventoryFunctions";
import { getQuestFromDb } from "../utils/questsFunctions";
import { WrongOrientationScreen } from "../components/WrongOrientationScreen";
import { Minigame1 } from "../components/minigames/Minigame1";
import { Minigame2 } from "../components/minigames/Minigame2";
import { Minigame3 } from "../components/minigames/Minigame3";

export const ScenePage = () => {
  const { user, setUser } = useUser();
  const { id } = useParams<{ id: string }>(); // Get the id from the URL
  const [sceneId, setSceneId] = useState<number>(1); // State to store the scene id
  const [currentScene, setCurrentScene] = useState<Scene | null>(null); // State to store the fetched scene object
  const navigate = useNavigate();
  const [dialogIndex, setDialogIndex] = useState(0);

  const [showMiniGame, setShowMiniGame] = useState(false);

  const [currentInventory, setCurrentInventory] = useState<
    Inventory | undefined
  >(user?.gameState.inventoryState);

  const [currentQuests, setCurrentQuests] = useState<Quest[]>(
    user?.gameState.questsState || []
  );

  useEffect(() => {
    console.log("Current inventory", currentInventory);
    if (user) {
      const updatedUser = {
        ...user,
        gameState: {
          ...user.gameState,
          inventoryState: currentInventory,
        },
      };
      setUser(updatedUser as User);
      console.log("User updated", updatedUser);
    }
  }, [currentInventory]);
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

  //handle quests
  useEffect(() => {
    const fetchQuest = async () => {
      if (
        currentScene?.questToAddId !== null &&
        currentScene?.questToAddId !== 0 &&
        currentScene?.questToAddId !== undefined
      ) {
        try {
          const quest = await getQuestFromDb(currentScene.questToAddId);
          console.log("Quest", quest);
          if (quest) {
            setCurrentQuests((prev) => [...(prev || []), quest]);
          }
        } catch (error) {
          console.error("Error fetching quest:", error);
        }
      }
    };
    const removeQuestLocaly = () => {
      if (
        currentScene?.questToRemoveId !== null &&
        currentScene?.questToRemoveId !== 0 &&
        currentScene?.questToRemoveId !== undefined
      ) {
        setCurrentQuests((prev) =>
          prev?.filter(
            (quest) => quest.questId !== currentScene.questToRemoveId
          )
        );
      }
    };

    fetchQuest();
    removeQuestLocaly();
  }, [currentScene?.sceneId]);

  useEffect(() => {
    if (currentScene?.minigameId) {
      setShowMiniGame(true);
    }
  }, [currentScene]);

  // Temporary scene ID increment for testing
  const handleButtonClick = () => {
    if (currentScene?.isCheckpoint) {
      saveDataOnCheckpoint(
        user,
        setUser,
        sceneId,
        user?.gameState.inventoryState,
        currentQuests
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

  const [showWrongOrientationDevice, setShowWrongOrientationDevice] =
    useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.screen.orientation.type.includes("portrait")) {
        setShowWrongOrientationDevice(true);
      } else {
        setShowWrongOrientationDevice(false);
      }
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return (
    <>
      {showMiniGame && currentScene?.minigameId === 1 && (
        <Minigame1 currentScene={currentScene} />
      )}
      {showMiniGame && currentScene?.minigameId === 2 && (
        <Minigame2 currentScene={currentScene} />
      )}
      {showMiniGame && currentScene?.minigameId === 3 && <Minigame3 />}
      {showWrongOrientationDevice && <WrongOrientationScreen />}
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
      <QuestContainer questState={currentQuests} />
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
            <SceneItemComponent
              sceneItem={sceneItem}
              currentInventory={currentInventory}
              setCurrentInventory={setCurrentInventory}
              currentScene={currentScene}
              setCurrentScene={setCurrentScene}
            />
          );
        })}
        {/* characters */}
        {currentScene?.sceneCharacters?.map(
          (sceneCharacter: SceneCharacter) => {
            return <SceneCharacterComponent sceneCharacter={sceneCharacter} />;
          }
        )}
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
                          //martin rikal ze tady mam dat koment (je to mrdka)
                          if (currentScene?.isCheckpoint) {
                            saveDataOnCheckpoint(
                              user,
                              setUser,
                              sceneId,
                              user?.gameState.inventoryState,
                              currentQuests
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
