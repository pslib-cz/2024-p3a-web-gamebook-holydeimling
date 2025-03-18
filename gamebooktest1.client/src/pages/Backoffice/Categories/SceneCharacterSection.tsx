import React from "react";
import { Card, Row, Col, Image, Typography, Button } from "antd";
import { SceneCharacter } from "../../../types";

interface Props {
  sceneCharacters: SceneCharacter[];
  editable?: boolean;
  onChange?: (characters: number[]) => void;
}

const SceneCharacterSection: React.FC<Props> = ({
  sceneCharacters,
  editable = false,
}) => {
  return (
    <Row gutter={[16, 16]}>
      {sceneCharacters.length > 0 ? (
        <>
          {sceneCharacters.map((character) => (
            <Col span={8} key={character.sceneCharacterId}>
              <Card
                title={`${character.character.firstName} ${character.character.lastName}`}
                extra={
                  editable && (
                    <Button danger size="small">
                      Remove
                    </Button>
                  )
                }
              >
                <Image
                  src={character.character.characterImages[0]?.filePath}
                  alt={character.character.firstName}
                  style={{ width: "100%", height: "auto" }}
                />
                <Typography.Paragraph>
                  <strong>Position:</strong> X: {character.position.x}, Y:{" "}
                  {character.position.y}
                </Typography.Paragraph>
                <Typography.Paragraph>
                  <strong>Size:</strong> W: {character.size.width}, H:{" "}
                  {character.size.height}
                </Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </>
      ) : (
        <Col span={24}>
          <Typography.Text type="secondary">
            No characters in this scene
          </Typography.Text>
        </Col>
      )}
    </Row>
  );
};

export default SceneCharacterSection;
