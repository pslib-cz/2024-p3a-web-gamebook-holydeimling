import "./QuestContainer.css";
import { useState } from "react";
import questIcon from "../assets/quest.png";
import { Quest } from "../types";
import { QuestComponent } from "./Quest";

interface QuestContainerProps {
  questState: Quest[] | null | undefined;
}

export const QuestContainer = ({ questState }: QuestContainerProps) => {
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
        {questState?.map((quest) => (
          <QuestComponent
            key={quest.questId}
            heading={quest.questHeading}
            content={quest.questContent}
          />
        ))}
      </div>
    </div>
  );
};
