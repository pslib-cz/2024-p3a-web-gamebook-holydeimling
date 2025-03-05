import { Tabs } from "antd";
import UsersManagement from "./Categories/UsersManagement";
import DialogManagement from "./Categories/DialogManagement";
import DialogAnswerManagement from "./Categories/DialogAnswerManagement";
import ItemManagement from "./Categories/ItemManagement";
import SceneItemManagement from "./Categories/SceneItemManagement";
import CharacterManagement from "./Categories/CharacterManagement";
import SceneCharacterManagement from "./Categories/SceneCharacterManagement";
import ImageManagement from "./Categories/ImageManagement";
import InventoryManagement from "./Categories/InventoryManagement";
import QuestManagement from "./Categories/QuestManagement";
import GameStateManagement from "./Categories/GameStateManagement";
import SceneManagement from "./Categories/SceneManagement";

export const BackofficePage = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Tabs
        defaultActiveKey="users"
        items={[
          {
            key: "users",
            label: "Users",
            children: <UsersManagement />,
          },
          {
            key: "characters",
            label: "Characters",
            children: <CharacterManagement />,
          },
          {
            key: "sceneCharacters",
            label: "Scene Characters",
            children: <SceneCharacterManagement />,
          },
          {
            key: "dialogs",
            label: "Dialogs",
            children: <DialogManagement />,
          },
          {
            key: "dialogAnswers",
            label: "Dialog Answers",
            children: <DialogAnswerManagement />,
          },
          {
            key: "items",
            label: "Items",
            children: <ItemManagement />,
          },
          {
            key: "sceneItems",
            label: "Scene Items",
            children: <SceneItemManagement />,
          },
          {
            key: "images",
            label: "Images",
            children: <ImageManagement />,
          },
          {
            key: "inventories",
            label: "Inventories",
            children: <InventoryManagement />,
          },
          {
            key: "quests",
            label: "Quests",
            children: <QuestManagement />,
          },
          {
            key: "gameStates",
            label: "Game States",
            children: <GameStateManagement />,
          },
          {
            key: "scenes",
            label: "Scenes",
            children: <SceneManagement />,
          },
        ]}
      />
    </div>
  );
};
