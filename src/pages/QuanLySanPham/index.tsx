import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, message, Space, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const QuanLySanPham: React.FC = () => {
  // Dữ liệu mẫu khởi tạo
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
    { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
    { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
    { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
    { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
  ]);

  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Lọc sản phẩm theo tên tìm kiếm
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Hiển thị modal thêm sản phẩm
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Thêm sản phẩm mới
  const handleAddProduct = (values: any) => {
    const newProduct: Product = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: values.name,
      price: values.price,
      quantity: values.quantity,
    };

    setProducts([...products, newProduct]);
    message.success('Thêm sản phẩm thành công!');
    setIsModalVisible(false);
    form.resetFields();
  };

  // Xóa sản phẩm
  const handleDelete = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
    message.success('Xóa sản phẩm thành công!');
  };

  // Định nghĩa các cột của bảng
  const columns: ColumnsType<Product> = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      align: 'right',
      render: (price: number) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'center',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận xóa"
          description="Bạn có chắc chắn muốn xóa sản phẩm này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title="Quản lý Sản phẩm" style={{ margin: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Thanh tìm kiếm và nút thêm */}
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên sản phẩm..."
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 400 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Thêm sản phẩm
          </Button>
        </Space>

        {/* Bảng hiển thị sản phẩm */}
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng số: ${total} sản phẩm`,
          }}
          bordered
        />

        {/* Modal thêm sản phẩm */}
        <Modal
          title="Thêm sản phẩm mới"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddProduct}
            autoComplete="off"
          >
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                { whitespace: true, message: 'Tên sản phẩm không được chỉ chứa khoảng trắng!' },
              ]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: 'Vui lòng nhập giá sản phẩm!' },
                { type: 'number', min: 1, message: 'Giá phải là số dương!' },
              ]}
            >
              <InputNumber
                placeholder="Nhập giá sản phẩm"
                style={{ width: '100%' }}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                min={0}
              />
            </Form.Item>

            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[
                { required: true, message: 'Vui lòng nhập số lượng!' },
                { type: 'number', min: 1, message: 'Số lượng phải là số nguyên dương!' },
              ]}
            >
              <InputNumber
                placeholder="Nhập số lượng"
                style={{ width: '100%' }}
                min={1}
                precision={0}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button type="primary" htmlType="submit">
                  Thêm
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
};

export default QuanLySanPham;
