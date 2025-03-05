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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Quest } from "../../../types";

const QuestManagement: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [form] = Form.useForm();

  const fetchQuests = async () => {
    try {
      const response = await fetch("/api/Quest");
      if (!response.ok) throw new Error("Failed to fetch quests");
      const data = await response.json();
      setQuests(data);
    } catch (error) {
      message.error("Failed to load quests");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const columns: ColumnsType<Quest> = [
    {
      title: "ID",
      dataIndex: "questId",
      key: "questId",
    },
    {
      title: "Heading",
      dataIndex: "questHeading",
      key: "questHeading",
    },
    {
      title: "Content",
      dataIndex: "questContent",
      key: "questContent",
      render: (text) => (
        <Typography.Paragraph ellipsis={{ rows: 2 }}>
          {text}
        </Typography.Paragraph>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingQuest(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this quest?"
            onConfirm={() => handleDelete(record.questId)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (questId: number) => {
    try {
      const response = await fetch(`/api/Quest/delete/${questId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete quest");

      message.success("Quest deleted successfully");
      fetchQuests();
    } catch (error) {
      message.error("Failed to delete quest");
      console.error(error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("questHeading", values.questHeading);
      formData.append("questContent", values.questContent);

      const response = await fetch("/api/Quest/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create quest");

      message.success("Quest created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchQuests();
    } catch (error) {
      message.error("Failed to create quest");
      console.error(error);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingQuest) return;

    try {
      const formData = new FormData();
      formData.append("questHeading", values.questHeading);
      formData.append("questContent", values.questContent);

      const response = await fetch(`/api/Quest/edit/${editingQuest.questId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update quest");

      message.success("Quest updated successfully");
      setIsModalVisible(false);
      setEditingQuest(null);
      form.resetFields();
      fetchQuests();
    } catch (error) {
      message.error("Failed to update quest");
      console.error(error);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setEditingQuest(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create New Quest
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={quests}
        rowKey="questId"
        loading={loading}
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <Typography.Paragraph>{record.questContent}</Typography.Paragraph>
          ),
        }}
      />

      <Modal
        title={editingQuest ? "Edit Quest" : "Create Quest"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingQuest(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingQuest ? handleEdit : handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="questHeading"
            label="Quest Heading"
            rules={[{ required: true, message: "Please input quest heading" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="questContent"
            label="Quest Content"
            rules={[{ required: true, message: "Please input quest content" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingQuest ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingQuest(null);
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

export default QuestManagement;
