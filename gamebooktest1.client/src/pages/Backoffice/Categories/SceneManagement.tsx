import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Popconfirm,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  Image,
  Row,
  Col,
  Card,
  Switch,
  InputNumber,
  Tabs,
  Tag,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Scene, Image as ImageType } from "../../../types";
import SceneCharacterSection from "./SceneCharacterSection";
import SceneItemSection from "./SceneItemSection";
import DialogSection from "./DialogSection";

const { TabPane } = Tabs;

const SceneManagement: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [form] = Form.useForm();

  const fetchScenes = async () => {
    try {
      const response = await fetch("/api/Scene");
      if (!response.ok) throw new Error("Failed to fetch scenes");
      const data = await response.json();
      setScenes(data);
    } catch (error) {
      message.error("Failed to load scenes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/Image");
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      message.error("Failed to load images");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchScenes();
    fetchImages();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("imageId", values.imageId.toString());
      formData.append("sceneName", values.sceneName);
      formData.append("isCheckpoint", values.isCheckpoint.toString());
      formData.append("gameOver", values.gameOver.toString());

      if (values.minigameId)
        formData.append("minigameId", values.minigameId.toString());
      if (values.questToAddId)
        formData.append("questToAddId", values.questToAddId.toString());
      if (values.questToRemoveId)
        formData.append("questToRemoveId", values.questToRemoveId.toString());

      if (values.sceneCharactersIds) {
        values.sceneCharactersIds.forEach((id: number) => {
          formData.append("sceneCharactersIds", id.toString());
        });
      }

      if (values.sceneItemsIds) {
        values.sceneItemsIds.forEach((id: number) => {
          formData.append("sceneItemsIds", id.toString());
        });
      }

      if (values.sceneDialogsIds) {
        values.sceneDialogsIds.forEach((id: number) => {
          formData.append("sceneDialogsIds", id.toString());
        });
      }

      const response = await fetch("/api/Scene/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create scene");

      message.success("Scene created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchScenes();
    } catch (error) {
      message.error("Failed to create scene");
      console.error(error);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingScene) return;

    try {
      const formData = new FormData();
      if (values.imageId) formData.append("imageId", values.imageId.toString());
      if (values.sceneName) formData.append("sceneName", values.sceneName);
      if (values.isCheckpoint !== undefined)
        formData.append("isCheckpoint", values.isCheckpoint.toString());
      if (values.gameOver !== undefined)
        formData.append("gameOver", values.gameOver.toString());
      if (values.minigameId)
        formData.append("minigameId", values.minigameId.toString());
      if (values.questToAddId)
        formData.append("questToAddId", values.questToAddId.toString());
      if (values.questToRemoveId)
        formData.append("questToRemoveId", values.questToRemoveId.toString());

      // ... similar append for other arrays ...

      const response = await fetch(`/api/Scene/edit/${editingScene.sceneId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update scene");

      message.success("Scene updated successfully");
      setIsModalVisible(false);
      setEditingScene(null);
      form.resetFields();
      fetchScenes();
    } catch (error) {
      message.error("Failed to update scene");
      console.error(error);
    }
  };

  const handleDelete = async (sceneId: number) => {
    try {
      const response = await fetch(`/api/Scene/${sceneId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete scene");

      message.success("Scene deleted successfully");
      fetchScenes();
    } catch (error) {
      message.error("Failed to delete scene");
      console.error(error);
    }
  };

  const columns: ColumnsType<Scene> = [
    {
      title: "ID",
      dataIndex: "sceneId",
      key: "sceneId",
    },
    {
      title: "Name",
      dataIndex: "sceneName",
      key: "sceneName",
    },
    {
      title: "Background",
      key: "background",
      render: (_, record) => (
        <Image
          src={record.backgroundImage.filePath}
          alt={record.sceneName}
          width={100}
          height={100}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Space>
          {record.isCheckpoint && <Tag color="blue">Checkpoint</Tag>}
          {record.gameOver && <Tag color="red">Game Over</Tag>}
          {record.minigameId && <Tag color="green">Has Minigame</Tag>}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingScene(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this scene?"
            onConfirm={() => handleDelete(record.sceneId)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setEditingScene(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create New Scene
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={scenes}
        rowKey="sceneId"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <Tabs defaultActiveKey="1">
              <TabPane tab="Scene Overview" key="1">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card title="Background Image">
                      <Image
                        src={record.backgroundImage.filePath}
                        alt={record.sceneName}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </Card>
                  </Col>
                  <Col span={16}>
                    <Card title="Scene Details">
                      <Typography.Paragraph>
                        <strong>Name:</strong> {record.sceneName}
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <strong>Checkpoint:</strong>{" "}
                        {record.isCheckpoint ? "Yes" : "No"}
                      </Typography.Paragraph>
                      <Typography.Paragraph>
                        <strong>Game Over:</strong>{" "}
                        {record.gameOver ? "Yes" : "No"}
                      </Typography.Paragraph>
                      {record.minigameId && (
                        <Typography.Paragraph>
                          <strong>Minigame ID:</strong> {record.minigameId}
                        </Typography.Paragraph>
                      )}
                      {record.questToAddId && (
                        <Typography.Paragraph>
                          <strong>Quest to Add:</strong> {record.questToAddId}
                        </Typography.Paragraph>
                      )}
                      {record.questToRemoveId && (
                        <Typography.Paragraph>
                          <strong>Quest to Remove:</strong>{" "}
                          {record.questToRemoveId}
                        </Typography.Paragraph>
                      )}
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Characters" key="2">
                <SceneCharacterSection
                  sceneCharacters={record.sceneCharacters}
                />
              </TabPane>
              <TabPane tab="Items" key="3">
                <SceneItemSection sceneItems={record.sceneItems} />
              </TabPane>
              <TabPane tab="Dialogs" key="4">
                <DialogSection dialogs={record.sceneDialogs} />
              </TabPane>
            </Tabs>
          ),
        }}
      />

      <Modal
        title={editingScene ? "Edit Scene" : "Create Scene"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingScene(null);
          form.resetFields();
        }}
        footer={null}
        width={1200}
      >
        <Form
          form={form}
          onFinish={editingScene ? handleEdit : handleCreate}
          layout="vertical"
        >
          {/* Form fields for scene details */}
          <Tabs>
            <TabPane tab="Basic Info" key="1">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name="sceneName"
                    label="Scene Name"
                    rules={[
                      { required: true, message: "Please input scene name" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="imageId"
                    label="Background Image"
                    rules={[
                      {
                        required: true,
                        message: "Please select background image",
                      },
                    ]}
                  >
                    <Select>
                      {images.map((image) => (
                        <Select.Option
                          key={image.imageId}
                          value={image.imageId}
                        >
                          <Space>
                            <Image
                              src={image.filePath}
                              alt={image.name}
                              width={30}
                              height={30}
                              style={{ objectFit: "cover" }}
                            />
                            {image.name}
                          </Space>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item
                    name="isCheckpoint"
                    label="Is Checkpoint"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="gameOver"
                    label="Game Over"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="minigameId" label="Minigame ID">
                    <InputNumber />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Characters" key="2">
              <SceneCharacterSection
                sceneCharacters={editingScene?.sceneCharacters || []}
                editable
                onChange={(characters) =>
                  form.setFieldsValue({ sceneCharactersIds: characters })
                }
              />
            </TabPane>

            <TabPane tab="Items" key="3">
              <SceneItemSection
                sceneItems={editingScene?.sceneItems || []}
                editable
                onChange={(items) =>
                  form.setFieldsValue({ sceneItemsIds: items })
                }
              />
            </TabPane>

            <TabPane tab="Dialogs" key="4">
              <DialogSection
                dialogs={editingScene?.sceneDialogs || []}
                editable
                onChange={(dialogs) =>
                  form.setFieldsValue({ sceneDialogsIds: dialogs })
                }
              />
            </TabPane>
          </Tabs>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingScene ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingScene(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SceneManagement;
