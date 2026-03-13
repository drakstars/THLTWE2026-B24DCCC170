import React from 'react';
import { Modal, Form, Input, InputNumber, Switch } from 'antd';
import type { FormInstance } from 'antd';
import { KhoiKienThuc } from '@/models/nganhangcauhoi';

interface KhoiKienThucFormModalProps {
  visible: boolean;
  editingItem: KhoiKienThuc | null;
  form: FormInstance;
  dataLength: number;
  onOk: () => void;
  onCancel: () => void;
}

const KhoiKienThucFormModal: React.FC<KhoiKienThucFormModalProps> = ({
  visible,
  editingItem,
  form,
  dataLength,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title={editingItem ? 'Chỉnh sửa khối kiến thức' : 'Thêm mới khối kiến thức'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" initialValues={{ trangThai: true, thuTu: dataLength + 1 }}>
        <Form.Item
          label="Mã khối kiến thức"
          name="maKhoiKienThuc"
          rules={[
            { required: true, message: 'Vui lòng nhập mã' },
            { pattern: /^[A-Z0-9]+$/, message: 'Mã chỉ chứa chữ in hoa và số' },
          ]}
        >
          <Input placeholder="VD: KKT001" />
        </Form.Item>
        <Form.Item
          label="Tên khối kiến thức"
          name="tenKhoiKienThuc"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="VD: Tổng quan" />
        </Form.Item>
        <Form.Item label="Mô tả" name="moTa">
          <Input.TextArea rows={3} placeholder="Nhập mô tả" />
        </Form.Item>
        <Form.Item
          label="Thứ tự"
          name="thuTu"
          rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Trạng thái" name="trangThai" valuePropName="checked">
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngưng" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default KhoiKienThucFormModal;
