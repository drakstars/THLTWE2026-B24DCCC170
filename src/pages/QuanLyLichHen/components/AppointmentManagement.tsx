import React, { useMemo } from 'react';
import { Button, DatePicker, Form, Input, Select, Space, Table, Tag, TimePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import SectionCard from './common/SectionCard';
import { Appointment, AppointmentStatus, ServiceItem, Staff } from '../types';

const STATUS_OPTIONS: AppointmentStatus[] = ['Chờ duyệt', 'Xác nhận', 'Hoàn thành', 'Hủy'];

interface AppointmentManagementProps {
  staffs: Staff[];
  services: ServiceItem[];
  appointments: Appointment[];
  submitting: boolean;
  onCreate: (payload: {
    customerName: string;
    customerPhone: string;
    staffId: number;
    serviceId: number;
    date: string;
    startTime: string;
  }) => Promise<void>;
  onUpdateStatus: (appointmentId: number, status: AppointmentStatus) => Promise<void>;
}

const AppointmentManagement: React.FC<AppointmentManagementProps> = ({
  staffs,
  services,
  appointments,
  submitting,
  onCreate,
  onUpdateStatus,
}) => {
  const [form] = Form.useForm();

  const staffById = useMemo(() => new Map(staffs.map((item) => [item.id, item])), [staffs]);
  const serviceById = useMemo(() => new Map(services.map((item) => [item.id, item])), [services]);

  const columns = useMemo<ColumnsType<Appointment>>(
    () => [
      { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
      { title: 'Số điện thoại', dataIndex: 'customerPhone', key: 'customerPhone' },
      {
        title: 'Nhân viên',
        key: 'staffId',
        render: (_, record) => staffById.get(record.staffId)?.name || `#${record.staffId}`,
      },
      {
        title: 'Dịch vụ',
        key: 'serviceId',
        render: (_, record) => serviceById.get(record.serviceId)?.name || `#${record.serviceId}`,
      },
      {
        title: 'Thời gian',
        key: 'time',
        render: (_, record) => `${record.date} ${record.startTime} - ${record.endTime}`,
      },
      {
        title: 'Trạng thái',
        key: 'status',
        render: (_, record) => {
          const color =
            record.status === 'Hoàn thành'
              ? 'success'
              : record.status === 'Xác nhận'
              ? 'processing'
              : record.status === 'Hủy'
              ? 'error'
              : 'warning';

          return <Tag color={color}>{record.status}</Tag>;
        },
      },
      {
        title: 'Cập nhật',
        key: 'update',
        render: (_, record) => (
          <Select
            value={record.status}
            style={{ width: 140 }}
            onChange={(value) => onUpdateStatus(record.id, value)}
            options={STATUS_OPTIONS.map((status) => ({ label: status, value: status }))}
          />
        ),
      },
    ],
    [onUpdateStatus, serviceById, staffById],
  );

  const submit = async () => {
    const values = await form.validateFields();
    await onCreate({
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      staffId: values.staffId,
      serviceId: values.serviceId,
      date: values.date.format('YYYY-MM-DD'),
      startTime: values.startTime.format('HH:mm'),
    });
    form.resetFields();
  };

  return (
    <SectionCard title="Đặt lịch hẹn và quản lý trạng thái">
      <Form form={form} layout="vertical">
        <Space size="middle" wrap align="end">
          <Form.Item label="Khách hàng" name="customerName" rules={[{ required: true, message: 'Nhập tên khách hàng' }]}>
            <Input style={{ width: 220 }} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="customerPhone"
            rules={[{ required: true, message: 'Nhập số điện thoại' }]}
          >
            <Input style={{ width: 180 }} />
          </Form.Item>
          <Form.Item label="Dịch vụ" name="serviceId" rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
            <Select style={{ width: 220 }} options={services.map((item) => ({ label: item.name, value: item.id }))} />
          </Form.Item>
          <Form.Item label="Nhân viên" name="staffId" rules={[{ required: true, message: 'Chọn nhân viên' }]}>
            <Select style={{ width: 220 }} options={staffs.map((item) => ({ label: item.name, value: item.id }))} />
          </Form.Item>
          <Form.Item label="Ngày" name="date" rules={[{ required: true, message: 'Chọn ngày' }]}>
            <DatePicker disabledDate={(date) => !!date && date < moment().startOf('day')} />
          </Form.Item>
          <Form.Item label="Giờ bắt đầu" name="startTime" rules={[{ required: true, message: 'Chọn giờ' }]}>
            <TimePicker format="HH:mm" minuteStep={15} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={submit} loading={submitting}>
              Đặt lịch
            </Button>
          </Form.Item>
        </Space>
      </Form>
      <Table rowKey="id" columns={columns} dataSource={appointments} pagination={{ pageSize: 6 }} />
    </SectionCard>
  );
};

export default AppointmentManagement;
