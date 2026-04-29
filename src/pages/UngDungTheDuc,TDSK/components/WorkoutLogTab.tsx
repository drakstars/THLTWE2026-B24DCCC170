import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment, { Moment } from 'moment';
import React, { useMemo, useState } from 'react';

import { WORKOUT_STATUSES, WORKOUT_TYPES } from '../constants';
import { WorkoutSession } from '../types';

const { RangePicker } = DatePicker;

interface WorkoutLogTabProps {
  sessions: WorkoutSession[];
  onCreate: (payload: Omit<WorkoutSession, 'id'>) => void;
  onUpdate: (id: string, payload: Omit<WorkoutSession, 'id'>) => void;
  onDelete: (id: string) => void;
}

interface WorkoutFormValues {
  date: Moment;
  type: WorkoutSession['type'];
  duration: number;
  calories: number;
  note?: string;
  status: WorkoutSession['status'];
}

const WorkoutLogTab: React.FC<WorkoutLogTabProps> = ({ sessions, onCreate, onUpdate, onDelete }) => {
  const [keyword, setKeyword] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<WorkoutSession['type'] | undefined>();
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null] | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<WorkoutSession | null>(null);
  const [form] = Form.useForm<WorkoutFormValues>();

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((item) => {
        const matchKeyword = !keyword || item.type.toLowerCase().includes(keyword.toLowerCase());
        const matchType = !typeFilter || item.type === typeFilter;
        const matchDate =
          !dateRange ||
          !dateRange[0] ||
          !dateRange[1] ||
          (moment(item.date).isSameOrAfter(dateRange[0], 'day') &&
            moment(item.date).isSameOrBefore(dateRange[1], 'day'));

        return matchKeyword && matchType && matchDate;
      })
      .sort((a, b) => moment(b.date).diff(moment(a.date)));
  }, [dateRange, keyword, sessions, typeFilter]);

  const openCreateModal = () => {
    setEditingItem(null);
    form.resetFields();
    form.setFieldsValue({
      date: moment(),
      type: 'Cardio',
      duration: 30,
      calories: 200,
      status: 'Hoàn thành',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: WorkoutSession) => {
    setEditingItem(item);
    form.setFieldsValue({
      date: moment(item.date),
      type: item.type,
      duration: item.duration,
      calories: item.calories,
      note: item.note,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const payload: Omit<WorkoutSession, 'id'> = {
      date: values.date.format('YYYY-MM-DD'),
      type: values.type,
      duration: values.duration,
      calories: values.calories,
      note: values.note,
      status: values.status,
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

  const columns: ColumnsType<WorkoutSession> = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (value: string) => moment(value).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf(),
    },
    {
      title: 'Loại bài tập',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Calo đốt',
      dataIndex: 'calories',
      key: 'calories',
      render: (value: number) => `${value} kcal`,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (value?: string) => value || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: WorkoutSession['status']) => (
        <Tag color={value === 'Hoàn thành' ? 'green' : 'volcano'}>{value}</Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 130,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa buổi tập này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => onDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Space wrap>
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo loại bài tập"
          allowClear
          prefix={<SearchOutlined />}
          style={{ width: 240 }}
        />

        <Select
          allowClear
          value={typeFilter}
          placeholder="Lọc theo loại"
          onChange={(value) => setTypeFilter(value)}
          style={{ width: 180 }}
        >
          {WORKOUT_TYPES.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>

        <RangePicker value={dateRange || undefined} onChange={(value) => setDateRange(value)} />

        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Thêm buổi tập
        </Button>
      </Space>

      <Table rowKey="id" columns={columns} dataSource={filteredSessions} pagination={{ pageSize: 8 }} />

      <Modal
        title={editingItem ? 'Sửa buổi tập' : 'Thêm buổi tập mới'}
        visible={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Ngày tập" name="date" rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Loại bài tập" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}>
            <Select>
              {WORKOUT_TYPES.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Thời lượng"
            name="duration"
            rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
          >
            <InputNumber min={1} max={600} style={{ width: '100%' }} addonAfter="phút" />
          </Form.Item>

          <Form.Item label="Calo" name="calories" rules={[{ required: true, message: 'Vui lòng nhập calo' }]}>
            <InputNumber min={1} max={5000} style={{ width: '100%' }} addonAfter="kcal" />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn..." />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select>
              {WORKOUT_STATUSES.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default WorkoutLogTab;
