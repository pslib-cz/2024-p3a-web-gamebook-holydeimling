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
  Upload,
  Image as AntImage,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { Image } from "../../../types";

const ImageManagement: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/Image");
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      message.error("Failed to load images");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (imageId: number) => {
    try {
      const response = await fetch(`/api/Image/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete image");

      message.success("Image deleted successfully");
      fetchImages();
    } catch (error) {
      message.error("Failed to delete image");
      console.error(error);
    }
  };

  const handleUpload = async (values: any) => {
    try {
      if (fileList.length === 0) {
        message.error("Please select a file to upload");
        return;
      }

      const formData = new FormData();
      formData.append("file", fileList[0].originFileObj as Blob);
      formData.append("name", values.name);

      const response = await fetch("/api/Image/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      message.success("Image uploaded successfully");
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchImages();
    } catch (error) {
      message.error("Failed to upload image");
      console.error(error);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingImage) return;

    try {
      const formData = new FormData();
      formData.append("name", values.name);

      const response = await fetch(`/api/Image/edit/${editingImage.imageId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update image");

      message.success("Image updated successfully");
      setIsModalVisible(false);
      setEditingImage(null);
      form.resetFields();
      fetchImages();
    } catch (error) {
      message.error("Failed to update image");
      console.error(error);
    }
  };

  const columns: ColumnsType<Image> = [
    {
      title: "Preview",
      key: "preview",
      render: (_, record) => (
        <AntImage
          src={record.filePath}
          alt={record.name}
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "File Path",
      dataIndex: "filePath",
      key: "filePath",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingImage(record);
              form.setFieldsValue({
                name: record.name,
              });
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Image"
            description="Are you sure you want to delete this image?"
            onConfirm={() => handleDelete(record.imageId)}
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
        <Typography.Title level={2}>Image Management</Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setEditingImage(null);
            form.resetFields();
            setFileList([]);
            setIsModalVisible(true);
          }}
        >
          Upload New Image
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={images}
        rowKey="imageId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingImage ? "Edit Image" : "Upload New Image"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingImage(null);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingImage ? handleEdit : handleUpload}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Image Name"
            rules={[{ required: true, message: "Please input image name" }]}
          >
            <Input />
          </Form.Item>

          {!editingImage && (
            <Form.Item
              name="file"
              label="Image File"
              rules={[
                { required: true, message: "Please select an image file" },
              ]}
            >
              <Upload
                beforeUpload={() => false}
                maxCount={1}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                accept=".jpg,.jpeg,.png,.gif"
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
          )}

          {editingImage && (
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong>Current Image:</Typography.Text>
              <br />
              <AntImage
                src={editingImage.filePath}
                alt={editingImage.name}
                width={200}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingImage ? "Update" : "Upload"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingImage(null);
                  form.resetFields();
                  setFileList([]);
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

export default ImageManagement;
