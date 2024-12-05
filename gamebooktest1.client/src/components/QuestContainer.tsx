import "./QuestContainer.css";
import { Quest } from "./Quest";
import { useState } from "react";
import questIcon from "../assets/quest.png";

export const QuestContainer = () => {
  const [showQuests, setShowQuests] = useState(false);

  return (
    <div className="quest-system__container">
      <img
        src={questIcon}
        alt="Quest icon"
        className="quests__icon"
        onClick={() => setShowQuests(!showQuests)}
      />
      <div className={`quests__container ${showQuests ? "show" : ""}`}>
        <Quest
          heading="Heading"
          content="Lorem ipsum dorem ahoj. Lorem ipsum dorem ahoj. Lorem ipsum dorem ahoj. Lorem ipsum dorem ahoj. Lorem ipsum dorem ahoj."
        />
        <Quest heading="Heading" content="Lorem ipsum dorem ahoj." />
      </div>
    </div>
  );
};
