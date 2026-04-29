import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, InputNumber, Modal, Popconfirm, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';

import { HealthMetric } from '../types';
import { calculateBMI, getBMICategory } from '../utils';

interface HealthMetricsTabProps {
  metrics: HealthMetric[];
  onCreate: (payload: Omit<HealthMetric, 'id'>) => void;
  onUpdate: (id: string, payload: Omit<HealthMetric, 'id'>) => void;
  onDelete: (id: string) => void;
}

interface MetricFormValues {
  date: Moment;
  weight: number;
  height: number;
  restingHeartRate: number;
  sleepHours: number;
}

const HealthMetricsTab: React.FC<HealthMetricsTabProps> = ({ metrics, onCreate, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<HealthMetric | null>(null);
  const [form] = Form.useForm<MetricFormValues>();

  const openCreateModal = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({
      date: moment(),
      weight: 65,
      height: 170,
      restingHeartRate: 70,
      sleepHours: 7,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: HealthMetric) => {
    setEditingItem(item);
    form.setFieldsValue({
      date: moment(item.date),
      weight: item.weight,
      height: item.height,
      restingHeartRate: item.restingHeartRate,
      sleepHours: item.sleepHours,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const bmi = calculateBMI(values.weight, values.height);

    const payload: Omit<HealthMetric, 'id'> = {
      date: values.date.format('YYYY-MM-DD'),
      weight: values.weight,
      height: values.height,
      bmi,
      restingHeartRate: values.restingHeartRate,
      sleepHours: values.sleepHours,
    };

    if (editingItem) {
      onUpdate(editingItem.id, payload);
    } else {
      onCreate(payload);
    }

    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const columns: ColumnsType<HealthMetric> = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (value: string) => moment(value).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      key: 'bmi',
      render: (value: number) => {
        const category = getBMICategory(value);
        return (
          <Space>
            <span>{value}</span>
            <Tag color={category.color}>{category.label}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Nhịp tim lúc nghỉ (bpm)',
      dataIndex: 'restingHeartRate',
      key: 'restingHeartRate',
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'sleepHours',
      key: 'sleepHours',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditModal(record)} />
          <Popconfirm title="Xóa chỉ số này?" okText="Xóa" cancelText="Hủy" onConfirm={() => onDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal} style={{ width: 'fit-content' }}>
        Thêm chỉ số
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={[...metrics].sort((a, b) => moment(b.date).diff(moment(a.date)))}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editingItem ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe'}
        visible={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Ngày" name="date" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Cân nặng (kg)" name="weight" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}>
            <InputNumber min={10} max={300} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Chiều cao (cm)" name="height" rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}>
            <InputNumber min={50} max={250} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Nhịp tim lúc nghỉ (bpm)"
            name="restingHeartRate"
            rules={[{ required: true, message: 'Vui lòng nhập nhịp tim' }]}
          >
            <InputNumber min={30} max={220} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Giờ ngủ" name="sleepHours" rules={[{ required: true, message: 'Vui lòng nhập số giờ ngủ' }]}>
            <InputNumber min={0} max={24} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default HealthMetricsTab;
