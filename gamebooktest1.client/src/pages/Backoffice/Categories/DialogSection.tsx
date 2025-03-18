import React from "react";
import { Card, Image, Typography, Space, Button, Collapse, List } from "antd";
import { Dialog } from "../../../types";

const { Panel } = Collapse;

interface Props {
  dialogs: Dialog[];
  editable?: boolean;
}

const DialogSection: React.FC<Props> = ({
  dialogs,
  editable = false,
}) => {
  return (
    <Collapse>
      {dialogs.length > 0 ? (
        <>
          {dialogs.map((dialog) => (
            <Panel
              key={dialog.dialogId}
              header={
                <Space>
                  {dialog.character.characterImages[0] && (
                    <Image
                      src={dialog.character.characterImages[0].filePath}
                      alt={dialog.character.firstName}
                      width={30}
                      height={30}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  {`${dialog.character.firstName} ${dialog.character.lastName}`}
                </Space>
              }
              extra={
                editable && (
                  <Button
                    danger
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Remove
                  </Button>
                )
              }
            >
              <Card>
                <Typography.Paragraph strong>
                  Dialog Content:
                </Typography.Paragraph>
                <Typography.Paragraph>{dialog.text}</Typography.Paragraph>

                <Typography.Title level={5}>Answers:</Typography.Title>
                <List
                  dataSource={dialog.dialogAnswers}
                  renderItem={(answer) => (
                    <List.Item
                      actions={
                        editable
                          ? [
                              <Button size="small" type="link">
                                Edit
                              </Button>,
                              <Button size="small" type="link" danger>
                                Delete
                              </Button>,
                            ]
                          : []
                      }
                    >
                      <List.Item.Meta
                        title={answer.answerText}
                        description={
                          <Space direction="vertical">
                            <Typography.Text type="secondary">
                              Next Scene ID: {answer.nextSceneId}
                            </Typography.Text>
                            <Typography.Text type="secondary">
                              Next Dialog ID: {answer.nextDialogId}
                            </Typography.Text>
                            {answer.answerText && (
                              <Typography.Text type="secondary">
                                Required Item ID: {answer.answerText}
                              </Typography.Text>
                            )}
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Panel>
          ))}
        </>
      ) : (
        <Typography.Text>No dialogs in this scene</Typography.Text>
      )}
    </Collapse>
  );
};

export default DialogSection;
