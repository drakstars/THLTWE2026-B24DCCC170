import React from 'react';
import { Form, Input, Modal, Switch, DatePicker } from 'antd';
import moment from 'moment';
import { Club, ClubFormPayload } from '../types';

interface ClubFormModalProps {
  visible: boolean;
  submitting: boolean;
  editingClub?: Club;
  onCancel: () => void;
  onSubmit: (payload: ClubFormPayload) => Promise<void>;
}

const ClubFormModal: React.FC<ClubFormModalProps> = ({
  visible,
  submitting,
  editingClub,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit({
      avatar: values.avatar,
      name: values.name,
      establishedDate: values.establishedDate.format('YYYY-MM-DD'),
      descriptionHtml: values.descriptionHtml,
      presidentName: values.presidentName,
      active: values.active,
    });
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title={editingClub ? 'Chỉnh sửa câu lạc bộ' : 'Thêm mới câu lạc bộ'}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okButtonProps={{ loading: submitting }}
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          avatar: editingClub?.avatar,
          name: editingClub?.name,
          establishedDate: editingClub?.establishedDate
            ? moment(editingClub.establishedDate)
            : moment(),
          descriptionHtml: editingClub?.descriptionHtml,
          presidentName: editingClub?.presidentName,
          active: editingClub?.active ?? true,
        }}
      >
        <Form.Item
          name="avatar"
          label="Ảnh đại diện (URL)"
          rules={[{ required: true, message: 'Vui lòng nhập URL ảnh đại diện' }]}
        >
          <Input placeholder="https://..." />
        </Form.Item>

        <Form.Item name="name" label="Tên câu lạc bộ" rules={[{ required: true, message: 'Vui lòng nhập tên CLB' }]}> 
          <Input />
        </Form.Item>

        <Form.Item
          name="establishedDate"
          label="Ngày thành lập"
          rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="descriptionHtml"
          label="Mô tả (HTML)"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả HTML' }]}
        >
          <Input.TextArea rows={4} placeholder="<p>...</p>" />
        </Form.Item>

        <Form.Item
          name="presidentName"
          label="Chủ nhiệm CLB"
          rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm CLB' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="active" label="Hoạt động" valuePropName="checked">
          <Switch checkedChildren="Có" unCheckedChildren="Không" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClubFormModal;
