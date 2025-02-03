import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Inventory, Quest, Scene, SceneCharacter } from "../types";
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
import { getQuestFromDb } from "../utils/questsFunctions";
import { WrongOrientationScreen } from "../components/WrongOrientationScreen";
import { Minigame1 } from "../components/Minigames/Minigame1";
import { Minigame2 } from "../components/Minigames/Minigame2";
import { Minigame3 } from "../components/Minigames/Minigame3";
import Typewriter from "typewriter-effect";
import { Minigame4 } from "../components/Minigames/Minigame4";
import { GameOutro } from "../components/GameOutro";

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

  const [showGameOutro, setShowGameOutro] = useState(false);

  // Save the inventory to the user object whenever it changes
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
    fetchScene(newSceneId, setCurrentScene, setShowGameOutro);
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
  }, [currentScene?.minigameId]);

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

  const [showDoneDialog, setShowDoneDialog] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  return (
    <>
      {showGameOutro && <GameOutro />}
      {showMiniGame && currentScene?.minigameId === 1 && (
        <Minigame1 currentScene={currentScene} />
      )}
      {showMiniGame && currentScene?.minigameId === 2 && (
        <Minigame2 currentScene={currentScene} />
      )}
      {showMiniGame && currentScene?.minigameId === 3 && (
        <Minigame3 currentScene={currentScene} />
      )}
      {showMiniGame && currentScene?.minigameId === 4 && (
        <Minigame4 currentScene={currentScene} />
      )}
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
        {/* items */}
        {currentScene?.sceneItems &&
          currentScene?.sceneItems?.map((sceneItem) => {
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
        {currentScene?.sceneCharacters &&
          currentScene?.sceneCharacters?.map(
            (sceneCharacter: SceneCharacter) => {
              return (
                <SceneCharacterComponent sceneCharacter={sceneCharacter} />
              );
            }
          )}
        {/* dialogs*/}
        {currentScene?.sceneDialogs?.length !== undefined &&
          currentScene.sceneDialogs.length > 0 && (
            <div className="dialog-system">
              <div className="dialog-system__character__container">
                <img
                  src={`/${currentScene.sceneDialogs[dialogIndex].character.characterImages[0].filePath}`}
                  alt=""
                  className="dialog-system__character"
                />
              </div>
              <h3>
                {currentScene.sceneDialogs[dialogIndex].character.firstName}{" "}
                {currentScene.sceneDialogs[dialogIndex].character.nickname}{" "}
                {currentScene.sceneDialogs[dialogIndex].character.lastName}
              </h3>
              {!showDoneDialog && (
                <>
                  <button
                    onClick={() => {
                      setShowDoneDialog(true);
                      setIsTypingComplete(true);
                    }}
                    style={{ position: "absolute", right: "0", top: "0" }}
                  >
                    Skip Dialog
                  </button>
                  <Typewriter
                    key={currentScene.sceneDialogs[dialogIndex].dialogId}
                    options={{ delay: 50, skipAddStyles: true }}
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(currentScene.sceneDialogs[dialogIndex].text)
                        .start()
                        .pauseFor(500)
                        .callFunction(() => {
                          setIsTypingComplete(true);
                          setShowDoneDialog(true);
                        });
                    }}
                  />
                </>
              )}
              {showDoneDialog && (
                <>
                  <p>{currentScene.sceneDialogs[dialogIndex].text}</p>
                  {currentScene.sceneDialogs[dialogIndex].dialogAnswers
                    .length <= 0 ? (
                    <button
                      onClick={() => {
                        handleContinueClick();
                        setShowDoneDialog(false);
                        setIsTypingComplete(false);
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
                            style={{ width: "auto", padding: "10px 24px" }}
                            onClick={() => {
                              //martin rikal ze tady mam dat koment (je to mrdka)
                              //zde mozna hodit game over jako if stejne jak checkpoin
                              if (currentScene?.gameOver) {
                                setShowGameOver(true);
                              } else {
                                if (dialogAnswer.nextSceneId) {
                                  if (currentScene?.isCheckpoint) {
                                    saveDataOnCheckpoint(
                                      user,
                                      setUser,
                                      sceneId,
                                      user?.gameState.inventoryState,
                                      currentQuests
                                    );
                                  }
                                  navigate(
                                    `/scene/${dialogAnswer.nextSceneId}`
                                  );
                                  setDialogIndex(0);
                                  setShowDoneDialog(false);
                                  setIsTypingComplete(false);
                                } else if (dialogAnswer.nextDialogId) {
                                  // Find the index of the next dialog within the current scene
                                  setShowDoneDialog(false);
                                  setIsTypingComplete(false);
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
                                  setShowDoneDialog(false);
                                  setIsTypingComplete(false);
                                  navigate(
                                    `/scene/${dialogAnswer.nextSceneId}`
                                  );
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
                </>
              )}
            </div>
          )}
      </div>
    </>
  );
};
