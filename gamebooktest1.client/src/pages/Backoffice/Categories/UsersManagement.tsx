import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Select,
  message,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";

interface User {
  id: number;
  userName: string;
  email: string;
  userRole: string;
  createdAt: string;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/Users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      message.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const formData = new FormData();
      formData.append("newRole", newRole);

      const response = await fetch(`/api/Users/role/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update role");

      message.success("User role updated successfully");
      fetchUsers(); // Refresh the users list
    } catch (error) {
      message.error("Failed to update user role");
      console.error(error);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch(`/api/Users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      message.success("User deleted successfully");
      fetchUsers(); // Refresh the users list
    } catch (error) {
      message.error("Failed to delete user");
      console.error(error);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "userRole",
      key: "userRole",
      render: (role: string, record) => (
        <Select
          defaultValue={role}
          style={{ width: 120 }}
          onChange={(value) => handleRoleChange(record.id, value)}
          options={[
            { value: "User", label: "User" },
            { value: "Admin", label: "Admin" },
          ]}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Delete user"
            description="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
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
      <Typography.Title level={2}>Users Management</Typography.Title>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UsersManagement;
