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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Character, Dialog, DialogAnswer } from "../../../types";

const DialogManagement: React.FC = () => {
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [dialogAnswers, setDialogAnswers] = useState<DialogAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDialog, setEditingDialog] = useState<Dialog | null>(null);
  const [form] = Form.useForm();

  const fetchDialogs = async () => {
    try {
      const response = await fetch("/api/Dialog");
      if (!response.ok) throw new Error("Failed to fetch dialogs");
      const data = await response.json();
      setDialogs(data);
    } catch (error) {
      message.error("Failed to load dialogs");
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

  const fetchDialogAnswers = async () => {
    try {
      const response = await fetch("/api/DialogAnswer");
      if (!response.ok) throw new Error("Failed to fetch dialog answers");
      const data = await response.json();
      setDialogAnswers(data);
    } catch (error) {
      message.error("Failed to load dialog answers");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDialogs();
    fetchCharacters();
    fetchDialogAnswers();
  }, []);

  const handleDelete = async (dialogId: number) => {
    try {
      const response = await fetch(`/api/Dialog/${dialogId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete dialog");

      message.success("Dialog deleted successfully");
      fetchDialogs();
    } catch (error) {
      message.error("Failed to delete dialog");
      console.error(error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("characterId", values.characterId);
      formData.append("text", values.text);
      values.dialogAnswersIds.forEach((id: number) => {
        formData.append("dialogAnswersIds", id.toString());
      });

      const response = await fetch("/api/Dialog/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create dialog");

      message.success("Dialog created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchDialogs();
    } catch (error) {
      message.error("Failed to create dialog");
      console.error(error);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingDialog) return;

    try {
      const formData = new FormData();
      formData.append("characterId", values.characterId);
      formData.append("text", values.text);
      values.dialogAnswersIds.forEach((id: number) => {
        formData.append("dialogAnswersIds", id.toString());
      });

      const response = await fetch(
        `/api/Dialog/edit/${editingDialog.dialogId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update dialog");

      message.success("Dialog updated successfully");
      setIsModalVisible(false);
      setEditingDialog(null);
      form.resetFields();
      fetchDialogs();
    } catch (error) {
      message.error("Failed to update dialog");
      console.error(error);
    }
  };

  const columns: ColumnsType<Dialog> = [
    {
      title: "ID",
      dataIndex: "dialogId",
      key: "dialogId",
    },
    {
      title: "Character",
      dataIndex: ["character", "firstName"],
      key: "character",
      render: (_, record) => record.character?.firstName || "No character",
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Answers Count",
      key: "answersCount",
      render: (_, record) => record.dialogAnswers?.length || 0,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingDialog(record);
              form.setFieldsValue({
                characterId: record.character?.characterId,
                text: record.text,
                dialogAnswersIds: record.dialogAnswers?.map(
                  (a) => a.dialogAnswerId
                ),
              });
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete dialog"
            description="Are you sure you want to delete this dialog?"
            onConfirm={() => handleDelete(record.dialogId)}
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
        <Typography.Title level={2}>Dialog Management</Typography.Title>
        <Button
          type="primary"
          onClick={() => {
            setEditingDialog(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create New Dialog
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={dialogs}
        rowKey="dialogId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingDialog ? "Edit Dialog" : "Create New Dialog"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingDialog(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingDialog ? handleEdit : handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="characterId"
            label="Character"
            rules={[{ required: true, message: "Please select a character" }]}
          >
            <Select>
              {characters.map((char) => (
                <Select.Option key={char.characterId} value={char.characterId}>
                  {char.firstName} {char.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="text"
            label="Dialog Text"
            rules={[{ required: true, message: "Please input dialog text" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="dialogAnswersIds"
            label="Dialog Answers"
            rules={[
              { required: true, message: "Please select at least one answer" },
            ]}
          >
            <Select mode="multiple">
              {dialogAnswers.map((answer) => (
                <Select.Option
                  key={answer.dialogAnswerId}
                  value={answer.dialogAnswerId}
                >
                  {answer.answerText || `Answer ${answer.dialogAnswerId}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingDialog ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingDialog(null);
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

export default DialogManagement;
