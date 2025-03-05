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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Character, Image as ImageType } from "../../../types";

const CharacterManagement: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null
  );
  const [form] = Form.useForm();

  const fetchCharacters = async () => {
    try {
      const response = await fetch("/api/Character");
      if (!response.ok) throw new Error("Failed to fetch characters");
      const data = await response.json();
      setCharacters(data);
    } catch (error) {
      message.error("Failed to load characters");
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
    fetchCharacters();
    fetchImages();
  }, []);

  const handleDelete = async (characterId: number) => {
    try {
      const response = await fetch(`/api/Character/${characterId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete character");

      message.success("Character deleted successfully");
      fetchCharacters();
    } catch (error) {
      message.error("Failed to delete character");
      console.error(error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      if (values.nickname) {
        formData.append("nickname", values.nickname);
      }
      if (values.backStory) {
        formData.append("backStory", values.backStory);
      }
      values.imageIds.forEach((id: number) => {
        formData.append("imageIds", id.toString());
      });

      const response = await fetch("/api/Character/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create character");

      message.success("Character created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchCharacters();
    } catch (error) {
      message.error("Failed to create character");
      console.error(error);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingCharacter) return;

    try {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      if (values.nickname) {
        formData.append("nickname", values.nickname);
      }
      if (values.backStory) {
        formData.append("backStory", values.backStory);
      }
      values.imageIds.forEach((id: number) => {
        formData.append("imageIds", id.toString());
      });

      const response = await fetch(
        `/api/Character/edit/${editingCharacter.characterId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update character");

      message.success("Character updated successfully");
      setIsModalVisible(false);
      setEditingCharacter(null);
      form.resetFields();
      fetchCharacters();
    } catch (error) {
      message.error("Failed to update character");
      console.error(error);
    }
  };

  const columns: ColumnsType<Character> = [
    {
      title: "ID",
      dataIndex: "characterId",
      key: "characterId",
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "Images",
      key: "images",
      render: (_, record) => (
        <Space>
          {record.characterImages.map((image) => (
            <Image
              key={image.imageId}
              src={image.filePath}
              alt={image.name}
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
            />
          ))}
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
              setEditingCharacter(record);
              form.setFieldsValue({
                firstName: record.firstName,
                lastName: record.lastName,
                nickname: record.nickname,
                backStory: record.backStory,
                imageIds: record.characterImages.map((img) => img.imageId),
              });
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete character"
            description="Are you sure you want to delete this character?"
            onConfirm={() => handleDelete(record.characterId)}
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
        <Typography.Title level={2}>Character Management</Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setEditingCharacter(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create New Character
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={characters}
        rowKey="characterId"
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>
              {record.backStory || "No backstory available"}
            </p>
          ),
        }}
      />

      <Modal
        title={editingCharacter ? "Edit Character" : "Create New Character"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCharacter(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingCharacter ? handleEdit : handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please input first name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input last name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="nickname" label="Nickname">
            <Input />
          </Form.Item>

          <Form.Item name="backStory" label="Backstory">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="imageIds"
            label="Character Images"
            rules={[
              { required: true, message: "Please select at least one image" },
            ]}
          >
            <Select mode="multiple">
              {images.map((image) => (
                <Select.Option key={image.imageId} value={image.imageId}>
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

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCharacter ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingCharacter(null);
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

export default CharacterManagement;
