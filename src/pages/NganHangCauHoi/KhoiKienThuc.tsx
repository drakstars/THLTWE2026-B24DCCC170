import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Space, Modal, Form, Input, message, Popconfirm, Tag, Switch, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { KhoiKienThuc } from '@/models/nganhangcauhoi';
import { khoiKienThucService, initSampleData } from '@/services/NganHangCauHoi';

const KhoiKienThucPage: React.FC = () => {
  const [data, setData] = useState<KhoiKienThuc[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<KhoiKienThuc | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await initSampleData();
      const result = await khoiKienThucService.getList();
      setData(result.sort((a, b) => (a.thuTu || 0) - (b.thuTu || 0)));
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const exists = await khoiKienThucService.checkMaKhoiKienThucExists(values.maKhoiKienThuc, editingItem?.id);
      if (exists) {
        message.error('Mã khối kiến thức đã tồn tại');
        return;
      }

      if (editingItem) {
        await khoiKienThucService.update(editingItem.id!, values);
        message.success('Cập nhật thành công');
      } else {
        await khoiKienThucService.create(values);
        message.success('Thêm mới thành công');
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns = [
    { title: 'STT', key: 'index', width: 60, align: 'center' as const, render: (_: any, __: any, index: number) => index + 1 },
    { title: 'Mã khối kiến thức', dataIndex: 'maKhoiKienThuc', key: 'maKhoiKienThuc', width: 150 },
    { title: 'Tên khối kiến thức', dataIndex: 'tenKhoiKienThuc', key: 'tenKhoiKienThuc' },
    { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa', ellipsis: true },
    { title: 'Thứ tự', dataIndex: 'thuTu', key: 'thuTu', width: 80, align: 'center' as const },
    {
      title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', width: 120, align: 'center' as const,
      render: (trangThai: boolean) => <Tag color={trangThai ? 'success' : 'error'}>{trangThai ? 'Hoạt động' : 'Ngưng'}</Tag>
    },
    {
      title: 'Thao tác', key: 'action', width: 150, align: 'center' as const,
      render: (_: any, record: KhoiKienThuc) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => { setEditingItem(record); form.setFieldsValue(record); setModalVisible(true); }}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => { khoiKienThucService.delete(record.id!); message.success('Xóa thành công'); loadData(); }} okText="Có" cancelText="Không">
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <PageContainer title="Danh mục khối kiến thức" extra={[
      <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); form.setFieldsValue({ trangThai: true, thuTu: data.length + 1 }); setModalVisible(true); }}>Thêm mới</Button>
    ]}>
      <Card>
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
          pagination={{ showSizeChanger: true, showTotal: (total) => `Tổng số ${total} bản ghi` }} />
      </Card>

      <Modal title={editingItem ? 'Chỉnh sửa khối kiến thức' : 'Thêm mới khối kiến thức'} visible={modalVisible}
        onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={600} okText="Lưu" cancelText="Hủy">
        <Form form={form} layout="vertical" initialValues={{ trangThai: true, thuTu: 1 }}>
          <Form.Item label="Mã khối kiến thức" name="maKhoiKienThuc"
            rules={[{ required: true, message: 'Vui lòng nhập mã' }, { pattern: /^[A-Z0-9]+$/, message: 'Mã chỉ chứa chữ in hoa và số' }]}>
            <Input placeholder="VD: KKT001" />
          </Form.Item>
          <Form.Item label="Tên khối kiến thức" name="tenKhoiKienThuc" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input placeholder="VD: Tổng quan" />
          </Form.Item>
          <Form.Item label="Mô tả" name="moTa"><Input.TextArea rows={3} placeholder="Nhập mô tả" /></Form.Item>
          <Form.Item label="Thứ tự" name="thuTu" rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Trạng thái" name="trangThai" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngưng" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default KhoiKienThucPage;
