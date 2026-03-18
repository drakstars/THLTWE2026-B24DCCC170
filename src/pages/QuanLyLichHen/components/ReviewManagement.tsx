import React, { useMemo, useState } from 'react';
import { Button, Form, Input, Modal, Rate, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import SectionCard from './common/SectionCard';
import { Appointment, Review, ServiceItem, Staff } from '../types';

interface ReviewManagementProps {
  staffs: Staff[];
  services: ServiceItem[];
  reviews: Review[];
  completedAppointmentsWithoutReview: Appointment[];
  submitting: boolean;
  onCreate: (payload: { appointmentId: number; rating: number; comment: string }) => Promise<void>;
  onReply: (payload: { reviewId: number; employeeReply: string }) => Promise<void>;
}

const ReviewManagement: React.FC<ReviewManagementProps> = ({
  staffs,
  services,
  reviews,
  completedAppointmentsWithoutReview,
  submitting,
  onCreate,
  onReply,
}) => {
  const [reviewForm] = Form.useForm();
  const [replyForm] = Form.useForm();
  const [replyVisible, setReplyVisible] = useState<boolean>(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const staffById = useMemo(() => new Map(staffs.map((item) => [item.id, item])), [staffs]);
  const serviceById = useMemo(() => new Map(services.map((item) => [item.id, item])), [services]);

  const columns = useMemo<ColumnsType<Review>>(
    () => [
      { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
      {
        title: 'Nhân viên',
        key: 'staff',
        render: (_, record) => staffById.get(record.staffId)?.name || `#${record.staffId}`,
      },
      {
        title: 'Dịch vụ',
        key: 'service',
        render: (_, record) => serviceById.get(record.serviceId)?.name || `#${record.serviceId}`,
      },
      {
        title: 'Đánh giá',
        key: 'rating',
        render: (_, record) => <Rate disabled value={record.rating} />,
      },
      { title: 'Nhận xét', dataIndex: 'comment', key: 'comment' },
      {
        title: 'Phản hồi NV',
        key: 'employeeReply',
        render: (_, record) => (record.employeeReply ? <Tag color="blue">{record.employeeReply}</Tag> : <Tag>Chưa phản hồi</Tag>),
      },
      {
        title: 'Thao tác',
        key: 'action',
        render: (_, record) => (
          <Button size="small" onClick={() => openReply(record.id)}>
            Phản hồi
          </Button>
        ),
      },
    ],
    [serviceById, staffById],
  );

  const submitReview = async () => {
    const values = await reviewForm.validateFields();
    await onCreate(values);
    reviewForm.resetFields();
  };

  const openReply = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    const selected = reviews.find((item) => item.id === reviewId);
    replyForm.setFieldsValue({ employeeReply: selected?.employeeReply || '' });
    setReplyVisible(true);
  };

  const submitReply = async () => {
    const values = await replyForm.validateFields();
    if (!selectedReviewId) {
      return;
    }
    await onReply({ reviewId: selectedReviewId, employeeReply: values.employeeReply });
    setReplyVisible(false);
    replyForm.resetFields();
  };

  return (
    <SectionCard title="Đánh giá dịch vụ và nhân viên">
      <Form form={reviewForm} layout="vertical">
        <Space wrap align="end" size="middle">
          <Form.Item
            label="Lịch hẹn đã hoàn thành"
            name="appointmentId"
            rules={[{ required: true, message: 'Chọn lịch hẹn' }]}
          >
            <Select
              style={{ width: 300 }}
              options={completedAppointmentsWithoutReview.map((item) => ({
                label: `${item.customerName} - ${item.date} ${item.startTime}`,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item label="Số sao" name="rating" rules={[{ required: true, message: 'Chọn số sao' }]}>
            <Rate />
          </Form.Item>
          <Form.Item label="Nhận xét" name="comment" rules={[{ required: true, message: 'Nhập nhận xét' }]}>
            <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} style={{ width: 320 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={submitReview} loading={submitting}>
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Space>
      </Form>

      <Table rowKey="id" columns={columns} dataSource={reviews} pagination={{ pageSize: 6 }} />

      <Modal
        title="Phản hồi đánh giá"
        visible={replyVisible}
        onCancel={() => setReplyVisible(false)}
        onOk={submitReply}
        confirmLoading={submitting}
      >
        <Form form={replyForm} layout="vertical">
          <Form.Item
            label="Nội dung phản hồi"
            name="employeeReply"
            rules={[{ required: true, message: 'Nhập nội dung phản hồi' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </SectionCard>
  );
};

export default ReviewManagement;
