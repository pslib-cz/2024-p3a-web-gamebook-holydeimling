import "./BackofficePage.css";
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
import { HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { Typography } from "antd";

export const BackofficePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Double-check user permissions
    if (!user || user.userRole !== "Admin") {
      toast.error("You don't have permission to access this page");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.userRole !== "Admin") {
    return null; // or a loading state
  }

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <div style={{ padding: "24px" }}>
      <Tabs
        defaultActiveKey="users"
        items={[
          {
            key: "userInfo",
            label: (
              <>
                <Typography.Title level={5}>{user?.userName}</Typography.Title>
                <Typography.Text>{user?.email}</Typography.Text>
              </>
            ),
            children: null,
            disabled: true,
          },
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
          {
            key: "home",
            label: (
              <Link to="/" onClick={(e) => handleHomeClick(e)}>
                <HomeOutlined />
              </Link>
            ),
            children: null,
          },
        ]}
      />
    </div>
  );
};
