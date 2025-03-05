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
  Select,
  Image,
  Row,
  Col,
  Card,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Inventory, Item } from "../../../types";

const InventoryManagement: React.FC = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInventory, setEditingInventory] = useState<Inventory | null>(
    null
  );
  const [form] = Form.useForm();

  const fetchInventories = async () => {
    try {
      const response = await fetch("/api/Inventory");
      if (!response.ok) throw new Error("Failed to fetch inventories");
      const data = await response.json();
      setInventories(data);
    } catch (error) {
      message.error("Failed to load inventories");
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
    fetchInventories();
    fetchItems();
  }, []);

  const columns: ColumnsType<Inventory> = [
    {
      title: "ID",
      dataIndex: "inventoryId",
      key: "inventoryId",
    },
    {
      title: "Items",
      key: "items",
      render: (_, record) => (
        <Row gutter={[8, 8]}>
          {[
            record.item1,
            record.item2,
            record.item3,
            record.item4,
            record.item5,
            record.item6,
            record.item7,
            record.item8,
            record.item9,
          ].map(
            (item, index) =>
              item && (
                <Col span={8} key={index}>
                  <Card size="small" title={`Slot ${index + 1}`}>
                    <Image
                      src={item.itemImages?.[0]?.filePath}
                      alt={item.itemName}
                      width={50}
                      height={50}
                      style={{ objectFit: "cover" }}
                    />
                    <Typography.Text>{item.itemName}</Typography.Text>
                  </Card>
                </Col>
              )
          )}
        </Row>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditingInventory(record);
              form.setFieldsValue({
                item1Id: record.item1?.itemId,
                item2Id: record.item2?.itemId,
                item3Id: record.item3?.itemId,
                item4Id: record.item4?.itemId,
                item5Id: record.item5?.itemId,
                item6Id: record.item6?.itemId,
                item7Id: record.item7?.itemId,
                item8Id: record.item8?.itemId,
                item9Id: record.item9?.itemId,
              });
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this inventory?"
            onConfirm={() => handleDelete(record.inventoryId)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (inventoryId: number) => {
    try {
      const response = await fetch(`/api/Inventory/${inventoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete inventory");

      message.success("Inventory deleted successfully");
      fetchInventories();
    } catch (error) {
      message.error("Failed to delete inventory");
      console.error(error);
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const formData = new FormData();

      // Append all item IDs to the form data
      for (let i = 1; i <= 9; i++) {
        if (values[`item${i}Id`]) {
          formData.append(`item${i}Id`, values[`item${i}Id`].toString());
        }
      }

      const response = await fetch("/api/Inventory/create-inventory", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create inventory");

      message.success("Inventory created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchInventories();
    } catch (error) {
      message.error("Failed to create inventory");
      console.error(error);
    }
  };

  const handleEdit = async (values: any) => {
    if (!editingInventory) return;

    try {
      // Handle item removal
      for (let i = 1; i <= 9; i++) {
        const currentItemId = values[`item${i}Id`];
        const previousItemId = editingInventory[`item${i}`]?.itemId;

        if (previousItemId && !currentItemId) {
          // Remove item from slot
          await fetch(
            `/api/Inventory/${editingInventory.inventoryId}/remove-item/`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                itemNumber: i,
              }),
            }
          );
        }
      }

      // Handle item updates
      const formData = new FormData();
      for (let i = 1; i <= 9; i++) {
        if (values[`item${i}Id`]) {
          formData.append(`item${i}Id`, values[`item${i}Id`].toString());
        }
      }

      const response = await fetch(
        `/api/Inventory/edit/${editingInventory.inventoryId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update inventory");

      message.success("Inventory updated successfully");
      setIsModalVisible(false);
      setEditingInventory(null);
      form.resetFields();
      fetchInventories();
    } catch (error) {
      message.error("Failed to update inventory");
      console.error(error);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setEditingInventory(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Create New Inventory
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={inventories}
        rowKey="inventoryId"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingInventory ? "Edit Inventory" : "Create Inventory"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingInventory(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          onFinish={editingInventory ? handleEdit : handleCreate}
          layout="vertical"
        >
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((slot) => (
              <Col span={8} key={slot}>
                <Form.Item name={`item${slot}Id`} label={`Item Slot ${slot}`}>
                  <Select allowClear showSearch optionFilterProp="children">
                    {items.map((item) => (
                      <Select.Option key={item.itemId} value={item.itemId}>
                        <Space>
                          <Image
                            src={item.itemImages?.[0]?.filePath}
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
              </Col>
            ))}
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingInventory ? "Update" : "Create"}
              </Button>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingInventory(null);
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

export default InventoryManagement;
