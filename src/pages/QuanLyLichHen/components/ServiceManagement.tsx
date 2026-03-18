import React, { useMemo, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import SectionCard from './common/SectionCard';
import { ServiceItem } from '../types';
import { formatCurrency } from '../utils/appointment';

interface ServiceManagementProps {
  services: ServiceItem[];
  submitting: boolean;
  onCreate: (payload: { name: string; price: number; durationMinutes: number }) => Promise<void>;
  onUpdate: (payload: { id: number; name: string; price: number; durationMinutes: number }) => Promise<void>;
  onDelete: (serviceId: number) => Promise<void>;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({ services, submitting, onCreate, onUpdate, onDelete }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [editing, setEditing] = useState<ServiceItem | null>(null);

  const columns = useMemo<ColumnsType<ServiceItem>>(
    () => [
      { title: 'Dịch vụ', dataIndex: 'name', key: 'name' },
      { title: 'Giá', dataIndex: 'price', key: 'price', render: (value: number) => formatCurrency(value) },
      {
        title: 'Thời gian',
        dataIndex: 'durationMinutes',
        key: 'durationMinutes',
        render: (value: number) => `${value} phút`,
      },
      {
        title: 'Thao tác',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => openModal(record)}>
              Sửa
            </Button>
            <Popconfirm title="Xóa dịch vụ này?" onConfirm={() => onDelete(record.id)}>
              <Button size="small" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [onDelete],
  );

  const openModal = (service?: ServiceItem) => {
    if (service) {
      setEditing(service);
      form.setFieldsValue(service);
    } else {
      setEditing(null);
      form.resetFields();
    }
    setVisible(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await onUpdate({ id: editing.id, ...values });
    } else {
      await onCreate(values);
    }
    setVisible(false);
    form.resetFields();
  };

  return (
    <SectionCard
      title="Quản lý dịch vụ"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm dịch vụ
        </Button>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={services} pagination={{ pageSize: 5 }} />
      <Modal
        title={editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={submit}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên dịch vụ" name="name" rules={[{ required: true, message: 'Nhập tên dịch vụ' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Nhập giá dịch vụ' }]}>
            <InputNumber min={1000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Thời gian thực hiện (phút)"
            name="durationMinutes"
            rules={[{ required: true, message: 'Nhập thời gian thực hiện' }]}
          >
            <InputNumber min={15} step={15} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </SectionCard>
  );
};

export default ServiceManagement;
