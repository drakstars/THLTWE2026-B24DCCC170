import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Space, Modal, Form, Input, message, Popconfirm, Tag, Switch, InputNumber, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';
import { MonHoc } from '@/models/nganhangcauhoi';
import { monHocService, initSampleData } from '@/services/NganHangCauHoi';

const MonHocPage: React.FC = () => {
  const [data, setData] = useState<MonHoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MonHoc | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await initSampleData();
      setData(await monHocService.getList());
    } catch (error) {
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const exists = await monHocService.checkMaMonHocExists(values.maMonHoc, editingItem?.id);
      if (exists) {
        message.error('Mã môn học đã tồn tại');
        return;
      }

      if (editingItem) {
        await monHocService.update(editingItem.id!, values);
        message.success('Cập nhật thành công');
      } else {
        await monHocService.create(values);
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
    { title: 'Mã môn học', dataIndex: 'maMonHoc', key: 'maMonHoc', width: 120 },
    { title: 'Tên môn học', dataIndex: 'tenMonHoc', key: 'tenMonHoc' },
    { title: 'Số tín chỉ', dataIndex: 'soTinChi', key: 'soTinChi', width: 100, align: 'center' as const, render: (soTinChi: number) => <Tag color="blue">{soTinChi} TC</Tag> },
    { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa', ellipsis: true },
    {
      title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', width: 120, align: 'center' as const,
      render: (trangThai: boolean) => <Tag color={trangThai ? 'success' : 'error'}>{trangThai ? 'Hoạt động' : 'Ngưng'}</Tag>
    },
    {
      title: 'Thao tác', key: 'action', width: 150, align: 'center' as const,
      render: (_: any, record: MonHoc) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => { setEditingItem(record); form.setFieldsValue(record); setModalVisible(true); }}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => { monHocService.delete(record.id!); message.success('Xóa thành công'); loadData(); }} okText="Có" cancelText="Không">
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const totalCredits = data.reduce((sum, item) => sum + item.soTinChi, 0);
  const activeSubjects = data.filter(item => item.trangThai).length;

  return (
    <PageContainer title="Danh mục môn học" extra={[
      <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); form.setFieldsValue({ trangThai: true, soTinChi: 3 }); setModalVisible(true); }}>Thêm mới</Button>
    ]}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Card><Statistic title="Tổng số môn học" value={data.length} prefix={<BookOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title="Môn học hoạt động" value={activeSubjects} valueStyle={{ color: '#3f8600' }} /></Card></Col>
        <Col span={8}><Card><Statistic title="Tổng số tín chỉ" value={totalCredits} suffix="TC" /></Card></Col>
      </Row>

      <Card>
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading}
          pagination={{ showSizeChanger: true, showTotal: (total) => `Tổng số ${total} bản ghi` }} />
      </Card>

      <Modal title={editingItem ? 'Chỉnh sửa môn học' : 'Thêm mới môn học'} visible={modalVisible}
        onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={600} okText="Lưu" cancelText="Hủy">
        <Form form={form} layout="vertical" initialValues={{ trangThai: true, soTinChi: 3 }}>
          <Form.Item label="Mã môn học" name="maMonHoc"
            rules={[{ required: true, message: 'Vui lòng nhập mã' }, { pattern: /^[A-Z0-9]+$/, message: 'Mã chỉ chứa chữ in hoa và số' }]}>
            <Input placeholder="VD: IT001" />
          </Form.Item>
          <Form.Item label="Tên môn học" name="tenMonHoc" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input placeholder="VD: Lập trình căn bản" />
          </Form.Item>
          <Form.Item label="Số tín chỉ" name="soTinChi"
            rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }, { type: 'number', min: 1, max: 10, message: 'Số tín chỉ từ 1 đến 10' }]}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Mô tả" name="moTa"><Input.TextArea rows={3} placeholder="Nhập mô tả" /></Form.Item>
          <Form.Item label="Trạng thái" name="trangThai" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngưng" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default MonHocPage;
