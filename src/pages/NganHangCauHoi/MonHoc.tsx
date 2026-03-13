import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MonHoc } from '@/models/nganhangcauhoi';
import { monHocService, initSampleData } from '@/services/NganHangCauHoi';
import MonHocStats from './components/MonHoc/MonHocStats';
import MonHocTable from './components/MonHoc/MonHocTable';
import MonHocFormModal from './components/MonHoc/MonHocFormModal';

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

  const handleEdit = (record: MonHoc) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (record: MonHoc) => {
    await monHocService.delete(record.id!);
    message.success('Xóa thành công');
    loadData();
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({ trangThai: true, soTinChi: 3 });
    setModalVisible(true);
  };

  return (
    <PageContainer
      title="Danh mục môn học"
      extra={[
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>,
      ]}
    >
      <MonHocStats data={data} />

      <Card>
        <MonHocTable data={data} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      </Card>

      <MonHocFormModal
        visible={modalVisible}
        editingItem={editingItem}
        form={form}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </PageContainer>
  );
};

export default MonHocPage;
