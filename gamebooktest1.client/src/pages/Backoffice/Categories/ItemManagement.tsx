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
import { Item, Image as ImageType } from "../../../types";

const ItemManagement: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form] = Form.useForm();

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/Item");
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      message.error("Failed to load items");
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
    fetchItems();
    fetchImages();
  }, []);

  const handleDelete = async (itemId: number) => {
    try {
      const response = await fetch(`/api/Item/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      message.success("Item deleted successfully");
      fetchItems();
    } catch (error) {
      message.error("Failed to delete item");
      console.error(error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("itemName", values.itemName);
      if (values.itemDescription) {
        formData.append("itemDescription", values.itemDescription);
      }
      values.imageIds.forEach((id: number) => {
        formData.append("imageIds", id.toString());
      });

      const response = await fetch("/api/Item/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create item");

      message.success("Item created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchItems();
    } catch (error) {
      message.error("Failed to create item");
      console.error(error);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingItem) return;

    try {
      const formData = new FormData();
      formData.append("itemName", values.itemName);
      if (values.itemDescription) {
        formData.append("itemDescription", values.itemDescription);
      }
      values.imageIds.forEach((id: number) => {
        formData.append("imageIds", id.toString());
      });

      const response = await fetch(`/api/Item/edit/${editingItem.itemId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update item");

      message.success("Item updated successfully");
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
      fetchItems();
    } catch (error) {
      message.error("Failed to update item");
      console.error(error);
    }
  };

  const columns: ColumnsType<Item> = [
    {
      title: "ID",
      dataIndex: "itemId",
      key: "itemId",
    },
    {
      title: "Name",
      dataIndex: "itemName",
      key: "itemName",
    },
    {
      title: "Description",
      dataIndex: "itemDescription",
      key: "itemDescription",
    },
    {
      title: "Images",
      key: "images",
      render: (_, record) => (
        <Space>
          {record.itemImages.map((image) => (
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
              setEditingItem(record);
              form.setFieldsValue({
                itemName: record.itemName,
                itemDescription: record.itemDescription,
                imageIds: record.itemImages.map((img) => img.imageId),
              });
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete item"
            description="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record.itemId)}
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
        <Typography.Title level={2}>Item Management</Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setEditingItem(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create New Item
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="itemId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingItem ? "Edit Item" : "Create New Item"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingItem ? handleEdit : handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="itemName"
            label="Item Name"
            rules={[{ required: true, message: "Please input item name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="itemDescription" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="imageIds"
            label="Images"
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
                {editingItem ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingItem(null);
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

export default ItemManagement;
