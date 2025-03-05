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
  InputNumber,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { DialogAnswer } from "../../../types";

const DialogAnswerManagement: React.FC = () => {
  const [dialogAnswers, setDialogAnswers] = useState<DialogAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<DialogAnswer | null>(null);
  const [form] = Form.useForm();

  const fetchDialogAnswers = async () => {
    try {
      const response = await fetch("/api/DialogAnswer");
      if (!response.ok) throw new Error("Failed to fetch dialog answers");
      const data = await response.json();
      setDialogAnswers(data);
    } catch (error) {
      message.error("Failed to load dialog answers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDialogAnswers();
  }, []);

  const handleDelete = async (answerId: number) => {
    try {
      const response = await fetch(`/api/DialogAnswer/${answerId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete dialog answer");

      message.success("Dialog answer deleted successfully");
      fetchDialogAnswers();
    } catch (error) {
      message.error("Failed to delete dialog answer");
      console.error(error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("answerText", values.answerText);
      if (values.nextSceneId)
        formData.append("nextSceneId", values.nextSceneId);
      if (values.nextDialogId)
        formData.append("nextDialogId", values.nextDialogId);

      const response = await fetch("/api/DialogAnswer/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create dialog answer");

      message.success("Dialog answer created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchDialogAnswers();
    } catch (error) {
      message.error("Failed to create dialog answer");
      console.error(error);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingAnswer) return;

    try {
      const formData = new FormData();
      formData.append("answerText", values.answerText);
      if (values.nextSceneId)
        formData.append("nextSceneId", values.nextSceneId);
      if (values.nextDialogId)
        formData.append("nextDialogId", values.nextDialogId);

      const response = await fetch(
        `/api/DialogAnswer/edit/${editingAnswer.dialogAnswerId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update dialog answer");

      message.success("Dialog answer updated successfully");
      setIsModalVisible(false);
      setEditingAnswer(null);
      form.resetFields();
      fetchDialogAnswers();
    } catch (error) {
      message.error("Failed to update dialog answer");
      console.error(error);
    }
  };

  const columns: ColumnsType<DialogAnswer> = [
    {
      title: "ID",
      dataIndex: "dialogAnswerId",
      key: "dialogAnswerId",
    },
    {
      title: "Answer Text",
      dataIndex: "answerText",
      key: "answerText",
    },
    {
      title: "Next Scene ID",
      dataIndex: "nextSceneId",
      key: "nextSceneId",
    },
    {
      title: "Next Dialog ID",
      dataIndex: "nextDialogId",
      key: "nextDialogId",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingAnswer(record);
              form.setFieldsValue({
                answerText: record.answerText,
                nextSceneId: record.nextSceneId,
                nextDialogId: record.nextDialogId,
              });
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete answer"
            description="Are you sure you want to delete this answer?"
            onConfirm={() => handleDelete(record.dialogAnswerId)}
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
        <Typography.Title level={2}>Dialog Answer Management</Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setEditingAnswer(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create New Answer
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={dialogAnswers}
        rowKey="dialogAnswerId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={
          editingAnswer ? "Edit Dialog Answer" : "Create New Dialog Answer"
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAnswer(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingAnswer ? handleEdit : handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="answerText"
            label="Answer Text"
            rules={[{ required: true, message: "Please input answer text" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="nextSceneId" label="Next Scene ID">
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item name="nextDialogId" label="Next Dialog ID">
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAnswer ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingAnswer(null);
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

export default DialogAnswerManagement;
