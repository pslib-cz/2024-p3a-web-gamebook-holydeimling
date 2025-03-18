import React from "react";
import { Card, Row, Col, Image, Typography, Button, Tooltip } from "antd";
import { SceneItem } from "../../../types";

interface Props {
  sceneItems: SceneItem[];
  editable?: boolean;
  onChange?: (items: number[]) => void;
}

const SceneItemSection: React.FC<Props> = ({
  sceneItems,
  editable = false,
}) => {
  return (
    <>
      <Row gutter={[16, 16]}>
        {sceneItems.length > 0 ? (
          <>
            {" "}
            {sceneItems.map((sceneItem) => (
              <Col span={8} key={sceneItem.sceneItemId}>
                <Card
                  title={sceneItem.item.itemName}
                  extra={
                    editable && (
                      <Button danger size="small">
                        Remove
                      </Button>
                    )
                  }
                >
                  <Image
                    src={sceneItem.item.itemImages[0]?.filePath}
                    alt={sceneItem.item.itemName}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <Typography.Paragraph>
                    <strong>Position:</strong> X: {sceneItem.position.x}, Y:{" "}
                    {sceneItem.position.y}
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    <strong>Size:</strong> W: {sceneItem.size.width}, H:{" "}
                    {sceneItem.size.height}
                  </Typography.Paragraph>
                  <Tooltip title={sceneItem.item.itemDescription}>
                    <Typography.Paragraph ellipsis={{ rows: 2 }}>
                      {sceneItem.item.itemDescription}
                    </Typography.Paragraph>
                  </Tooltip>
                </Card>
              </Col>
            ))}
          </>
        ) : (
          <Typography.Text>No items in this scene</Typography.Text>
        )}
      </Row>
    </>
  );
};

export default SceneItemSection;
