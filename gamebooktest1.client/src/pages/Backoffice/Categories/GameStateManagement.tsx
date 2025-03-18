import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Popconfirm,
  Space,
  Typography,
  Select,
  Image,
  Row,
  Col,
  Card,
  InputNumber,
  Collapse,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { GameState, Quest } from "../../../types";

const { Panel } = Collapse;

const GameStateManagement: React.FC = () => {
  const [gameStates, setGameStates] = useState<GameState[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGameStates = async () => {
    try {
      const response = await fetch("/api/GameState");
      if (!response.ok) throw new Error("Failed to fetch game states");
      const data = await response.json();
      setGameStates(data);
    } catch (error) {
      message.error("Failed to load game states");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuests = async () => {
    try {
      const response = await fetch("/api/Quest");
      if (!response.ok) throw new Error("Failed to fetch quests");
      const data = await response.json();
      setQuests(data);
    } catch (error) {
      message.error("Failed to load quests");
      console.error(error);
    }
  };


  useEffect(() => {
    fetchGameStates();
    fetchQuests();
  }, []);

  const handleAddQuest = async (gameStateId: number, questId: number) => {
    try {
      const formData = new FormData();
      formData.append("questId", questId.toString());

      const response = await fetch(`/api/GameState/addQuest/${gameStateId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add quest");

      message.success("Quest added successfully");
      fetchGameStates();
    } catch (error) {
      message.error("Failed to add quest");
      console.error(error);
    }
  };

  const handleRemoveQuest = async (gameStateId: number, questId: number) => {
    try {
      const formData = new FormData();
      formData.append("questId", questId.toString());

      const response = await fetch(
        `/api/GameState/deleteQuest/${gameStateId}`,
        {
          method: "DELETE",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to remove quest");

      message.success("Quest removed successfully");
      fetchGameStates();
    } catch (error) {
      message.error("Failed to remove quest");
      console.error(error);
    }
  };

  const handleUpdateCheckpoint = async (
    gameStateId: number,
    checkpointSceneId: number
  ) => {
    try {
      const formData = new FormData();
      formData.append("checkpointSceneId", checkpointSceneId.toString());

      const response = await fetch(
        `/api/GameState/edit/CheckpointSceneId/${gameStateId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update checkpoint");

      message.success("Checkpoint updated successfully");
      fetchGameStates();
    } catch (error) {
      message.error("Failed to update checkpoint");
      console.error(error);
    }
  };

  const columns: ColumnsType<GameState> = [
    {
      title: "ID",
      dataIndex: "gameStateId",
      key: "gameStateId",
    },
    {
      title: "Checkpoint Scene",
      dataIndex: "checkpointSceneId",
      key: "checkpointSceneId",
      render: (checkpointSceneId: number, record) => (
        <Space>
          <InputNumber
            value={checkpointSceneId}
            onChange={(value) =>
              value && handleUpdateCheckpoint(record.gameStateId, value)
            }
          />
        </Space>
      ),
    },
    {
      title: "Inventory",
      key: "inventory",
      render: (_, record) => (
        <Collapse>
          <Panel header="View Inventory" key="1">
            <Row gutter={[8, 8]}>
              {[
                record.inventoryState.item1,
                record.inventoryState.item2,
                record.inventoryState.item3,
                record.inventoryState.item4,
                record.inventoryState.item5,
                record.inventoryState.item6,
                record.inventoryState.item7,
                record.inventoryState.item8,
                record.inventoryState.item9,
              ].map(
                (item, index) =>
                  item && (
                    <Col span={8} key={index}>
                      <Card size="small" title={`Slot ${index + 1}`}>
                        <Image
                          src={item.itemImages?.[0]?.filePath}
                          alt={item.itemName}
                          width={50}
                          height={50}
                          style={{ objectFit: "cover" }}
                        />
                        <Typography.Text>{item.itemName}</Typography.Text>
                      </Card>
                    </Col>
                  )
              )}
            </Row>
          </Panel>
        </Collapse>
      ),
    },
    {
      title: "Quests",
      key: "quests",
      render: (_, record) => (
        <Collapse>
          <Panel
            header={`Active Quests (${record.questsState.length})`}
            key="1"
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {record.questsState.map((quest) => (
                <Card
                  key={quest.questId}
                  size="small"
                  title={quest.questHeading}
                  extra={
                    <Popconfirm
                      title="Remove this quest?"
                      onConfirm={() =>
                        handleRemoveQuest(record.gameStateId, quest.questId)
                      }
                    >
                      <Button size="small" danger>
                        Remove
                      </Button>
                    </Popconfirm>
                  }
                >
                  <Typography.Paragraph>
                    {quest.questContent}
                  </Typography.Paragraph>
                </Card>
              ))}
              <Card size="small">
                <Space>
                  <Select
                    style={{ width: 200 }}
                    placeholder="Add new quest"
                    onChange={(questId) =>
                      handleAddQuest(record.gameStateId, questId)
                    }
                  >
                    {quests
                      .filter(
                        (q) =>
                          !record.questsState.some(
                            (rq) => rq.questId === q.questId
                          )
                      )
                      .map((quest) => (
                        <Select.Option
                          key={quest.questId}
                          value={quest.questId}
                        >
                          {quest.questHeading}
                        </Select.Option>
                      ))}
                  </Select>
                </Space>
              </Card>
            </Space>
          </Panel>
        </Collapse>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={gameStates}
        rowKey="gameStateId"
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Inventory Details">
                  <Collapse>
                    <Panel header="View Full Inventory" key="1">
                      <Row gutter={[8, 8]}>
                        {[
                          record.inventoryState.item1,
                          record.inventoryState.item2,
                          record.inventoryState.item3,
                          record.inventoryState.item4,
                          record.inventoryState.item5,
                          record.inventoryState.item6,
                          record.inventoryState.item7,
                          record.inventoryState.item8,
                          record.inventoryState.item9,
                        ].map(
                          (item, index) =>
                            item && (
                              <Col span={8} key={index}>
                                <Card size="small" title={`Slot ${index + 1}`}>
                                  <Image
                                    src={item.itemImages?.[0]?.filePath}
                                    alt={item.itemName}
                                    width={100}
                                    height={100}
                                    style={{ objectFit: "cover" }}
                                  />
                                  <Typography.Title level={5}>
                                    {item.itemName}
                                  </Typography.Title>
                                  <Typography.Paragraph>
                                    {item.itemDescription}
                                  </Typography.Paragraph>
                                </Card>
                              </Col>
                            )
                        )}
                      </Row>
                    </Panel>
                  </Collapse>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Quest Details">
                  <Collapse>
                    <Panel header="View All Quests" key="1">
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {record.questsState.map((quest) => (
                          <Card
                            key={quest.questId}
                            size="small"
                            title={quest.questHeading}
                          >
                            <Typography.Paragraph>
                              {quest.questContent}
                            </Typography.Paragraph>
                          </Card>
                        ))}
                      </Space>
                    </Panel>
                  </Collapse>
                </Card>
              </Col>
            </Row>
          ),
        }}
      />
    </div>
  );
};

export default GameStateManagement;
