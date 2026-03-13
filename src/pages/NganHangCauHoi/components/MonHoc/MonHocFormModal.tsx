import React from 'react';
import { Modal, Form, Input, InputNumber, Switch } from 'antd';
import type { FormInstance } from 'antd';
import { MonHoc } from '@/models/nganhangcauhoi';

interface MonHocFormModalProps {
  visible: boolean;
  editingItem: MonHoc | null;
  form: FormInstance;
  onOk: () => void;
  onCancel: () => void;
}

const MonHocFormModal: React.FC<MonHocFormModalProps> = ({
  visible,
  editingItem,
  form,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title={editingItem ? 'Chỉnh sửa môn học' : 'Thêm mới môn học'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" initialValues={{ trangThai: true, soTinChi: 3 }}>
        <Form.Item
          label="Mã môn học"
          name="maMonHoc"
          rules={[
            { required: true, message: 'Vui lòng nhập mã' },
            { pattern: /^[A-Z0-9]+$/, message: 'Mã chỉ chứa chữ in hoa và số' },
          ]}
        >
          <Input placeholder="VD: IT001" />
        </Form.Item>
        <Form.Item
          label="Tên môn học"
          name="tenMonHoc"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="VD: Lập trình căn bản" />
        </Form.Item>
        <Form.Item
          label="Số tín chỉ"
          name="soTinChi"
          rules={[
            { required: true, message: 'Vui lòng nhập số tín chỉ' },
            { type: 'number', min: 1, max: 10, message: 'Số tín chỉ từ 1 đến 10' },
          ]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Mô tả" name="moTa">
          <Input.TextArea rows={3} placeholder="Nhập mô tả" />
        </Form.Item>
        <Form.Item label="Trạng thái" name="trangThai" valuePropName="checked">
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngưng" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MonHocFormModal;
