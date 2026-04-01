import React from 'react';
import { Form, Input, Modal } from 'antd';

interface RejectModalProps {
  visible: boolean;
  submitting: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

const RejectModal: React.FC<RejectModalProps> = ({ visible, submitting, count, onCancel, onConfirm }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    await onConfirm(values.reason);
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title={`Không duyệt ${count} đơn đăng ký`}
      okText="Xác nhận"
      cancelText="Hủy"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okButtonProps={{ danger: true, loading: submitting }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="reason"
          label="Lý do từ chối"
          rules={[{ required: true, message: 'Bắt buộc nhập lý do từ chối' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RejectModal;
