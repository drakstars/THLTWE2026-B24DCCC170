import React from 'react';
import { Form, Modal, Select } from 'antd';
import { Club } from '../types';

interface TransferClubModalProps {
  visible: boolean;
  submitting: boolean;
  count: number;
  clubs: Club[];
  onCancel: () => void;
  onConfirm: (clubId: number) => Promise<void>;
}

const TransferClubModal: React.FC<TransferClubModalProps> = ({
  visible,
  submitting,
  count,
  clubs,
  onCancel,
  onConfirm,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    await onConfirm(values.clubId);
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title={`Chuyển CLB cho ${count} thành viên`}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText="Xác nhận"
      cancelText="Hủy"
      okButtonProps={{ loading: submitting }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="clubId"
          label="CLB đích"
          rules={[{ required: true, message: 'Vui lòng chọn CLB muốn chuyển đến' }]}
        >
          <Select showSearch optionFilterProp="children">
            {clubs.map((club) => (
              <Select.Option key={club.id} value={club.id}>
                {club.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransferClubModal;
