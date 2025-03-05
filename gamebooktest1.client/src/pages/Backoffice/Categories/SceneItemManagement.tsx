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
import { SceneItem, Item } from "../../../types";

const SceneItemManagement: React.FC = () => {
  const [sceneItems, setSceneItems] = useState<SceneItem[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSceneItem, setEditingSceneItem] = useState<SceneItem | null>(
    null
  );
  const [form] = Form.useForm();

  const fetchSceneItems = async () => {
    try {
      const response = await fetch("/api/SceneItem");
      if (!response.ok) throw new Error("Failed to fetch scene items");
      const data = await response.json();
      setSceneItems(data);
    } catch (error) {
      message.error("Failed to load scene items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/Item");
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      message.error("Failed to load items");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSceneItems();
    fetchItems();
  }, []);

  const handleDelete = async (sceneItemId: number) => {
    try {
      const response = await fetch(`/api/SceneItem/${sceneItemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete scene item");

      message.success("Scene item deleted successfully");
      fetchSceneItems();
    } catch (error) {
      message.error("Failed to delete scene item");
      console.error(error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("itemId", values.itemId);
      formData.append("positionX", values.positionX);
      formData.append("positionY", values.positionY);
      formData.append("sizeWidth", values.sizeWidth);
      formData.append("sizeHeight", values.sizeHeight);

      const response = await fetch("/api/SceneItem/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create scene item");

      message.success("Scene item created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchSceneItems();
    } catch (error) {
      message.error("Failed to create scene item");
      console.error(error);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingSceneItem) return;

    try {
      const formData = new FormData();
      formData.append("itemId", values.itemId);
      formData.append("positionX", values.positionX);
      formData.append("positionY", values.positionY);
      formData.append("sizeWidth", values.sizeWidth);
      formData.append("sizeHeight", values.sizeHeight);

      const response = await fetch(
        `/api/SceneItem/edit/${editingSceneItem.sceneItemId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update scene item");

      message.success("Scene item updated successfully");
      setIsModalVisible(false);
      setEditingSceneItem(null);
      form.resetFields();
      fetchSceneItems();
    } catch (error) {
      message.error("Failed to update scene item");
      console.error(error);
    }
  };

  const columns: ColumnsType<SceneItem> = [
    {
      title: "ID",
      dataIndex: "sceneItemId",
      key: "sceneItemId",
    },
    {
      title: "Item",
      key: "item",
      render: (_, record) => (
        <Space>
          <Image
            src={record.item.itemImages[0]?.filePath}
            alt={record.item.itemName}
            width={50}
            height={50}
            style={{ objectFit: "cover" }}
          />
          {record.item.itemName}
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
              setEditingSceneItem(record);
              form.setFieldsValue({
                itemId: record.item.itemId,
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
            title="Delete scene item"
            description="Are you sure you want to delete this scene item?"
            onConfirm={() => handleDelete(record.sceneItemId)}
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
        <Typography.Title level={2}>Scene Item Management</Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setEditingSceneItem(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create New Scene Item
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={sceneItems}
        rowKey="sceneItemId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingSceneItem ? "Edit Scene Item" : "Create New Scene Item"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingSceneItem(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingSceneItem ? handleEdit : handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="itemId"
            label="Item"
            rules={[{ required: true, message: "Please select an item" }]}
          >
            <Select>
              {items.map((item) => (
                <Select.Option key={item.itemId} value={item.itemId}>
                  <Space>
                    <Image
                      src={item.itemImages[0]?.filePath}
                      alt={item.itemName}
                      width={30}
                      height={30}
                      style={{ objectFit: "cover" }}
                    />
                    {item.itemName}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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
                {editingSceneItem ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingSceneItem(null);
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

export default SceneItemManagement;
