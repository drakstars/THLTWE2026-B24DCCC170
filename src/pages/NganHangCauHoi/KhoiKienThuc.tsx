import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { KhoiKienThuc } from '@/models/nganhangcauhoi';
import { khoiKienThucService, initSampleData } from '@/services/NganHangCauHoi';
import KhoiKienThucTable from './components/KhoiKienThuc/KhoiKienThucTable';
import KhoiKienThucFormModal from './components/KhoiKienThuc/KhoiKienThucFormModal';

const KhoiKienThucPage: React.FC = () => {
  const [data, setData] = useState<KhoiKienThuc[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<KhoiKienThuc | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

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
      const exists = await khoiKienThucService.checkMaKhoiKienThucExists(
        values.maKhoiKienThuc,
        editingItem?.id,
      );

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

  const handleEdit = (record: KhoiKienThuc) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: KhoiKienThuc) => {
    await khoiKienThucService.delete(record.id!);
    message.success('Xóa thành công');
    loadData();
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ trangThai: true, thuTu: data.length + 1 });
    setModalVisible(true);
  };

  return (
    <PageContainer
      title="Danh mục khối kiến thức"
      extra={[
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>,
      ]}
    >
      <Card>
        <KhoiKienThucTable
          data={data}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <KhoiKienThucFormModal
        visible={modalVisible}
        editingItem={editingItem}
        form={form}
        dataLength={data.length}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </PageContainer>
  );
};

export default KhoiKienThucPage;