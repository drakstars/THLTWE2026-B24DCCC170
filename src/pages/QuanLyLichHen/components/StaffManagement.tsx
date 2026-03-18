import React, { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Rate,
  Space,
  Table,
  TimePicker,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import moment, { Moment } from 'moment';
import SectionCard from './common/SectionCard';
import { Staff } from '../types';
import { WEEKDAY_OPTIONS } from '../utils/appointment';

interface StaffManagementProps {
  staffs: Staff[];
  averageRatingByStaff: Record<number, number>;
  submitting: boolean;
  onCreate: (payload: { name: string; maxCustomersPerDay: number; workingSlots: Staff['workingSlots'] }) => Promise<void>;
  onUpdate: (payload: {
    id: number;
    name: string;
    maxCustomersPerDay: number;
    workingSlots: Staff['workingSlots'];
  }) => Promise<void>;
  onDelete: (staffId: number) => Promise<void>;
}

interface StaffFormValues {
  name: string;
  maxCustomersPerDay: number;
  workDays: number[];
  startTime: Moment;
  endTime: Moment;
}

const StaffManagement: React.FC<StaffManagementProps> = ({
  staffs,
  averageRatingByStaff,
  submitting,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [form] = Form.useForm<StaffFormValues>();
  const [visible, setVisible] = useState<boolean>(false);
  const [editing, setEditing] = useState<Staff | null>(null);

  const columns = useMemo<ColumnsType<Staff>>(
    () => [
      { title: 'Nhân viên', dataIndex: 'name', key: 'name' },
      { title: 'Giới hạn khách/ngày', dataIndex: 'maxCustomersPerDay', key: 'maxCustomersPerDay' },
      {
        title: 'Lịch làm việc',
        key: 'workingSlots',
        render: (_, record) =>
          record.workingSlots
            .map((slot) => {
              const dayLabel = WEEKDAY_OPTIONS.find((item) => item.value === slot.dayOfWeek)?.label || `Thu ${slot.dayOfWeek}`;
              return `${dayLabel}: ${slot.startTime}-${slot.endTime}`;
            })
            .join(', '),
      },
      {
        title: 'Đánh giá TB',
        key: 'rating',
        render: (_, record) => <Rate disabled allowHalf value={averageRatingByStaff[record.id] || 0} />,
      },
      {
        title: 'Thao tác',
        key: 'action',
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => openModal(record)}>
                Sửa
            </Button>
            <Popconfirm title="Xóa nhân viên này?" onConfirm={() => onDelete(record.id)}>
              <Button size="small" danger>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [averageRatingByStaff, onDelete],
  );

  const openModal = (staff?: Staff) => {
    if (staff) {
      setEditing(staff);
      form.setFieldsValue({
        name: staff.name,
        maxCustomersPerDay: staff.maxCustomersPerDay,
        workDays: staff.workingSlots.map((slot) => slot.dayOfWeek),
        startTime: moment(staff.workingSlots[0]?.startTime || '09:00', 'HH:mm'),
        endTime: moment(staff.workingSlots[0]?.endTime || '17:00', 'HH:mm'),
      });
    } else {
      setEditing(null);
      form.resetFields();
      form.setFieldsValue({
        workDays: [1, 2, 3, 4, 5],
        startTime: moment('09:00', 'HH:mm'),
        endTime: moment('17:00', 'HH:mm'),
      });
    }
    setVisible(true);
  };

  const submit = async () => {
    const values = await form.validateFields();
    const payload = {
      name: values.name,
      maxCustomersPerDay: values.maxCustomersPerDay,
      workingSlots: values.workDays.map((day) => ({
        dayOfWeek: day,
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime.format('HH:mm'),
      })),
    };

    if (editing) {
      await onUpdate({ id: editing.id, ...payload });
    } else {
      await onCreate(payload);
    }

    setVisible(false);
    form.resetFields();
  };

  return (
    <SectionCard
      title="Quản lý nhân viên"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Thêm nhân viên
        </Button>
      }
    >
      <Table rowKey="id" columns={columns} dataSource={staffs} pagination={{ pageSize: 5 }} />
      <Modal
        title={editing ? 'Sửa nhân viên' : 'Thêm nhân viên'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={submit}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Tên nhân viên" name="name" rules={[{ required: true, message: 'Nhập tên nhân viên' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Số khách tối đa/ngày"
            name="maxCustomersPerDay"
            rules={[{ required: true, message: 'Nhập giới hạn khách/ngày' }]}
          >
            <InputNumber min={1} max={50} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Ngày làm việc" name="workDays" rules={[{ required: true, message: 'Chọn ngày làm việc' }]}>
            <Checkbox.Group options={WEEKDAY_OPTIONS} />
          </Form.Item>
          <Space size="large" style={{ width: '100%' }}>
            <Form.Item label="Giờ bắt đầu" name="startTime" rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}>
              <TimePicker format="HH:mm" minuteStep={15} />
            </Form.Item>
            <Form.Item label="Giờ kết thúc" name="endTime" rules={[{ required: true, message: 'Chọn giờ kết thúc' }]}>
              <TimePicker format="HH:mm" minuteStep={15} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </SectionCard>
  );
};

export default StaffManagement;
