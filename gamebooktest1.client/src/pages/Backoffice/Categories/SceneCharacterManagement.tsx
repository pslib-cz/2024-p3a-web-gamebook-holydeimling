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
  InputNumber,
  Select,
  Image,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SceneCharacter, Character } from "../../../types";

const SceneCharacterManagement: React.FC = () => {
  const [sceneCharacters, setSceneCharacters] = useState<SceneCharacter[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSceneCharacter, setEditingSceneCharacter] =
    useState<SceneCharacter | null>(null);
  const [form] = Form.useForm();

  const fetchSceneCharacters = async () => {
    try {
      const response = await fetch("/api/SceneCharacter");
      if (!response.ok) throw new Error("Failed to fetch scene characters");
      const data = await response.json();
      setSceneCharacters(data);
    } catch (error) {
      message.error("Failed to load scene characters");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCharacters = async () => {
    try {
      const response = await fetch("/api/Character");
      if (!response.ok) throw new Error("Failed to fetch characters");
      const data = await response.json();
      setCharacters(data);
    } catch (error) {
      message.error("Failed to load characters");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSceneCharacters();
    fetchCharacters();
  }, []);

  const handleDelete = async (sceneCharacterId: number) => {
    try {
      const response = await fetch(`/api/SceneCharacter/${sceneCharacterId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete scene character");

      message.success("Scene character deleted successfully");
      fetchSceneCharacters();
    } catch (error) {
      message.error("Failed to delete scene character");
      console.error(error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("characterId", values.characterId);
      formData.append("positionX", values.positionX);
      formData.append("positionY", values.positionY);
      formData.append("sizeWidth", values.sizeWidth);
      formData.append("sizeHeight", values.sizeHeight);

      const response = await fetch("/api/SceneCharacter/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create scene character");

      message.success("Scene character created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchSceneCharacters();
    } catch (error) {
      message.error("Failed to create scene character");
      console.error(error);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingSceneCharacter) return;

    try {
      const formData = new FormData();
      formData.append("positionX", values.positionX);
      formData.append("positionY", values.positionY);
      formData.append("sizeWidth", values.sizeWidth);
      formData.append("sizeHeight", values.sizeHeight);

      const response = await fetch(
        `/api/SceneCharacter/edit/${editingSceneCharacter.sceneCharacterId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update scene character");

      message.success("Scene character updated successfully");
      setIsModalVisible(false);
      setEditingSceneCharacter(null);
      form.resetFields();
      fetchSceneCharacters();
    } catch (error) {
      message.error("Failed to update scene character");
      console.error(error);
    }
  };

  const columns: ColumnsType<SceneCharacter> = [
    {
      title: "ID",
      dataIndex: "sceneCharacterId",
      key: "sceneCharacterId",
    },
    {
      title: "Character",
      key: "character",
      render: (_, record) => (
        <Space>
          <Image
            src={record.character.characterImages[0]?.filePath}
            alt={`${record.character.firstName} ${record.character.lastName}`}
            width={50}
            height={50}
            style={{ objectFit: "cover" }}
          />
          {`${record.character.firstName} ${record.character.lastName}`}
        </Space>
      ),
    },
    {
      title: "Position",
      key: "position",
      render: (_, record) => `X: ${record.position.x}, Y: ${record.position.y}`,
    },
    {
      title: "Size",
      key: "size",
      render: (_, record) =>
        `W: ${record.size.width}, H: ${record.size.height}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingSceneCharacter(record);
              form.setFieldsValue({
                characterId: record.character.characterId,
                positionX: record.position.x,
                positionY: record.position.y,
                sizeWidth: record.size.width,
                sizeHeight: record.size.height,
              });
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete scene character"
            description="Are you sure you want to delete this scene character?"
            onConfirm={() => handleDelete(record.sceneCharacterId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Space style={{ marginBottom: 16 }} direction="vertical" size="middle">
        <Typography.Title level={2}>
          Scene Character Management
        </Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setEditingSceneCharacter(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create New Scene Character
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={sceneCharacters}
        rowKey="sceneCharacterId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={
          editingSceneCharacter
            ? "Edit Scene Character"
            : "Create New Scene Character"
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingSceneCharacter(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingSceneCharacter ? handleEdit : handleCreate}
          layout="vertical"
        >
          {!editingSceneCharacter && (
            <Form.Item
              name="characterId"
              label="Character"
              rules={[{ required: true, message: "Please select a character" }]}
            >
              <Select>
                {characters.map((character) => (
                  <Select.Option
                    key={character.characterId}
                    value={character.characterId}
                  >
                    <Space>
                      <Image
                        src={character.characterImages[0]?.filePath}
                        alt={`${character.firstName} ${character.lastName}`}
                        width={30}
                        height={30}
                        style={{ objectFit: "cover" }}
                      />
                      {`${character.firstName} ${character.lastName}`}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="positionX"
            label="Position X"
            rules={[{ required: true, message: "Please input position X" }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="positionY"
            label="Position Y"
            rules={[{ required: true, message: "Please input position Y" }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name="sizeWidth"
            label="Width"
            rules={[{ required: true, message: "Please input width" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            name="sizeHeight"
            label="Height"
            rules={[{ required: true, message: "Please input height" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingSceneCharacter ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingSceneCharacter(null);
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

export default SceneCharacterManagement;
