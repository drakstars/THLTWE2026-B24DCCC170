import React from 'react';
import { Col, Form, Input, Modal, Row, Select } from 'antd';
import { ApplicationFormPayload, Club, Gender, MemberApplication } from '../types';

interface ApplicationFormModalProps {
  visible: boolean;
  submitting: boolean;
  editingItem?: MemberApplication;
  clubs: Club[];
  onCancel: () => void;
  onSubmit: (payload: ApplicationFormPayload) => Promise<void>;
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  visible,
  submitting,
  editingItem,
  clubs,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    await onSubmit(values as ApplicationFormPayload);
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title={editingItem ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký'}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
      width={960}
      okButtonProps={{ loading: submitting }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fullName: editingItem?.fullName,
          email: editingItem?.email,
          phone: editingItem?.phone,
          gender: editingItem?.gender || ('Male' as Gender),
          address: editingItem?.address,
          talent: editingItem?.talent,
          clubId: editingItem?.clubId,
          reason: editingItem?.reason,
          adminNote: editingItem?.adminNote,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}> 
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="SĐT"
              rules={[
                { required: true, message: 'Vui lòng nhập SĐT' },
                { pattern: /^\d{9,11}$/, message: 'SĐT gồm 9-11 chữ số' },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}> 
              <Select>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}> 
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="talent" label="Sở trường" rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}> 
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="clubId" label="Câu lạc bộ" rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}> 
              <Select showSearch optionFilterProp="children">
                {clubs.map((club) => (
                  <Select.Option key={club.id} value={club.id}>
                    {club.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="adminNote" label="Ghi chú admin">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="reason"
              label="Lý do đăng ký"
              rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ApplicationFormModal;
