import React from "react";
import { Card, Image, Typography, Space, Tag } from "antd";
import { Scene } from "../../../types";

interface Props {
  scene: Scene;
}

const ScenePreview: React.FC<Props> = ({ scene }) => {
  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Image
          src={scene.backgroundImage.filePath}
          alt={scene.sceneName}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "300px",
            objectFit: "cover",
          }}
        />

        <Typography.Title level={4}>{scene.sceneName}</Typography.Title>

        <Space wrap>
          {scene.isCheckpoint && <Tag color="blue">Checkpoint</Tag>}
          {scene.gameOver && <Tag color="red">Game Over</Tag>}
          {scene.minigameId && <Tag color="purple">Has Minigame</Tag>}
          {scene.questToAddId && <Tag color="green">Adds Quest</Tag>}
          {scene.questToRemoveId && <Tag color="orange">Removes Quest</Tag>}
        </Space>

        <Typography.Paragraph>
          <strong>Characters:</strong> {scene.sceneCharacters.length}
        </Typography.Paragraph>

        <Typography.Paragraph>
          <strong>Items:</strong> {scene.sceneItems.length}
        </Typography.Paragraph>

        <Typography.Paragraph>
          <strong>Dialogs:</strong> {scene.sceneDialogs.length}
        </Typography.Paragraph>
      </Space>
    </Card>
  );
};

export default ScenePreview;
