import { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import { DialogAnswer, Scene } from "../types";
import { DialogSystemButton } from "./DialogSystemButton";
import "./DialogSystem.css";

interface DialogSystemProps {
  currentScene: Scene | null;
  dialogIndex: number;
  onContinue: () => void;
  onAnswerClick: (dialogAnswer: DialogAnswer) => void;
}

export const DialogSystem = ({
  currentScene,
  dialogIndex,
  onContinue,
  onAnswerClick,
}: DialogSystemProps) => {
  const [showDoneDialog, setShowDoneDialog] = useState(false);

  useEffect(() => {
    setShowDoneDialog(false);
  }, [dialogIndex]);

  if (!currentScene?.sceneDialogs || currentScene.sceneDialogs.length === 0) {
    return null;
  }

  const currentDialog = currentScene.sceneDialogs[dialogIndex];

  return (
    <div className="dialog-system">
      <div className="dialog-system__character__container">
        <img
          src={`/${currentDialog.character.characterImages[0].filePath}`}
          alt={currentDialog.character.firstName}
          className="dialog-system__character"
        />
      </div>
      <h3>
        {currentDialog.character.firstName} {currentDialog.character.nickname}{" "}
        {currentDialog.character.lastName}
      </h3>
      {!showDoneDialog && (
        <>
          <div className="dialog-system-skip__button__container">
            <DialogSystemButton
              text="Skip Dialog"
              onClick={() => {
                setShowDoneDialog(true);
              }}
            />
          </div>
          <Typewriter
            key={currentDialog.dialogId}
            options={{ delay: 50, skipAddStyles: true }}
            onInit={(typewriter) => {
              typewriter
                .callFunction(() => {
                  setShowDoneDialog(false);
                })
                .typeString(currentDialog.text)
                .start()
                .pauseFor(500)
                .callFunction(() => {
                  setShowDoneDialog(true);
                });
            }}
          />
        </>
      )}
      {showDoneDialog && (
        <>
          <p>{currentDialog.text}</p>
          {currentDialog.dialogAnswers.length <= 0 ? (
            <DialogSystemButton
              onClick={() => {
                onContinue();
                setShowDoneDialog(false);
              }}
              text="Pokračovat"
            />
          ) : (
            <div>
              {currentDialog.dialogAnswers.map((dialogAnswer) => (
                <DialogSystemButton
                  key={dialogAnswer.dialogAnswerId}
                  onClick={() => {
                    onAnswerClick(dialogAnswer);
                    setShowDoneDialog(false);
                  }}
                  text={dialogAnswer.answerText}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
